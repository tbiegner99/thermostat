import { promises as fsPromises } from 'fs';
import { Mode } from '../../models/mode';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import * as path from 'path';

interface ThresholdSettings {
  margin?: number;
  heatThreshold?: number;
  coolingThreshold?: number;
  mode: Mode;
  [key: string]: any;
}

interface ThresholdDatasourceDependencies {
  settingsFile: string;
  fs: typeof fsPromises;
}

class ThresholdDatasource {
  private settingsFile: string;
  private fs: typeof fsPromises;
  private settings?: ThresholdSettings;
  private db?: Database;
  private dbPath: string;

  constructor({ settingsFile, fs }: ThresholdDatasourceDependencies) {
    this.settingsFile = settingsFile;
    this.fs = fs;
    // Convert JSON file path to SQLite database path
    const dir = path.dirname(settingsFile);
    this.dbPath = path.join(dir, 'thermostat.db');
  }

  private async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
      });

      // Initialize the database schema if needed
      await this.initializeSchema();

      // Migrate existing JSON data if it exists and database is empty
      await this.migrateFromJsonIfNeeded();
    }
    return this.db;
  }

  private async initializeSchema(): Promise<void> {
    if (!this.db) return;

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'string',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TRIGGER IF NOT EXISTS update_settings_timestamp 
      AFTER UPDATE ON settings
      BEGIN
        UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
      END;
    `);

    // Insert default settings if table is empty
    const count = await this.db.get('SELECT COUNT(*) as count FROM settings');
    if (count.count === 0) {
      await this.db.exec(`
        INSERT INTO settings (key, value, type) VALUES 
        ('margin', '1.0', 'number'),
        ('heatThreshold', '20.0', 'number'),
        ('coolingThreshold', '24.0', 'number'),
        ('mode', 'auto', 'string');
      `);
    }
  }

  private async migrateFromJsonIfNeeded(): Promise<void> {
    try {
      // Check if JSON file exists
      await this.fs.access(this.settingsFile);

      // Check if database already has data
      if (!this.db) return;
      const count = await this.db.get('SELECT COUNT(*) as count FROM settings');
      if (count.count > 0) return; // Database already has data, skip migration

      // Read JSON file and migrate
      const content = await this.fs.readFile(this.settingsFile, 'utf8');
      const jsonSettings = JSON.parse(content) as ThresholdSettings;

      console.log('Migrating settings from JSON to SQLite key-value store:', jsonSettings);

      // Migrate each setting as a key-value pair
      const migrations = [
        { key: 'margin', value: String(jsonSettings.margin ?? 1.0), type: 'number' },
        { key: 'heatThreshold', value: String(jsonSettings.heatThreshold ?? 20.0), type: 'number' },
        {
          key: 'coolingThreshold',
          value: String(jsonSettings.coolingThreshold ?? 24.0),
          type: 'number',
        },
        { key: 'mode', value: jsonSettings.mode ?? 'auto', type: 'string' },
      ];

      for (const migration of migrations) {
        await this.db.run(
          `
          INSERT OR REPLACE INTO settings (key, value, type) VALUES (?, ?, ?)
        `,
          [migration.key, migration.value, migration.type]
        );
      }

      console.log('Successfully migrated settings from JSON to SQLite key-value store');
    } catch (err) {
      // JSON file doesn't exist or is invalid, that's fine
      console.log('No JSON file to migrate or migration already complete');
    }
  }
  async readSettings(): Promise<ThresholdSettings> {
    const db = await this.getDb();
    const rows = await db.all(`SELECT key, value, type FROM settings`);

    if (!rows || rows.length === 0) {
      throw new Error('No threshold settings found in database');
    }

    const settings: any = {};

    for (const row of rows) {
      let value: any = row.value;

      // Convert value based on type
      if (row.type === 'number') {
        value = parseFloat(row.value);
      } else if (row.type === 'boolean') {
        value = row.value === 'true';
      } else if (row.type === 'json') {
        value = JSON.parse(row.value);
      }
      // 'string' type stays as-is

      settings[row.key] = value;
    }

    const thresholdSettings: ThresholdSettings = {
      margin: settings.margin,
      heatThreshold: settings.heatThreshold,
      coolingThreshold: settings.coolingThreshold,
      mode: settings.mode as Mode,
    };

    this.settings = thresholdSettings;
    return thresholdSettings;
  }

  async update(settings: Partial<ThresholdSettings>): Promise<void> {
    try {
      const db = await this.getDb();

      // Update each setting as a key-value pair
      for (const [key, value] of Object.entries(settings)) {
        if (value === undefined) continue;

        let stringValue: string;
        let type: string;

        if (typeof value === 'number') {
          stringValue = String(value);
          type = 'number';
        } else if (typeof value === 'boolean') {
          stringValue = String(value);
          type = 'boolean';
        } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value);
          type = 'json';
        } else {
          stringValue = String(value);
          type = 'string';
        }

        await db.run(
          `
          INSERT OR REPLACE INTO settings (key, value, type) VALUES (?, ?, ?)
        `,
          [key, stringValue, type]
        );
      }

      // Update cached settings
      if (!this.settings) {
        this.settings = await this.readSettings();
      } else {
        this.settings = { ...this.settings, ...settings };
      }

      console.log('Updated threshold settings:', this.settings);
    } catch (err) {
      console.error('Error updating threshold settings:', err);
      throw err;
    }
  }

  updateMode(mode: Mode): Promise<void> {
    return this.update({ mode });
  }

  updateMargin(margin: number): Promise<void> {
    return this.update({ margin });
  }

  updateHeatThreshold(heatThreshold: number): Promise<void> {
    return this.update({ heatThreshold });
  }

  updateCoolingThreshold(coolingThreshold: number): Promise<void> {
    return this.update({ coolingThreshold });
  }

  // Generic key-value operations for extensibility
  async getSetting<T = any>(key: string): Promise<T | null> {
    const db = await this.getDb();
    const row = await db.get('SELECT value, type FROM settings WHERE key = ?', [key]);

    if (!row) return null;

    let value: any = row.value;
    if (row.type === 'number') {
      value = parseFloat(row.value);
    } else if (row.type === 'boolean') {
      value = row.value === 'true';
    } else if (row.type === 'json') {
      value = JSON.parse(row.value);
    }

    return value as T;
  }

  async setSetting<T = any>(key: string, value: T): Promise<void> {
    const db = await this.getDb();

    let stringValue: string;
    let type: string;

    if (typeof value === 'number') {
      stringValue = String(value);
      type = 'number';
    } else if (typeof value === 'boolean') {
      stringValue = String(value);
      type = 'boolean';
    } else if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
      type = 'json';
    } else {
      stringValue = String(value);
      type = 'string';
    }

    await db.run(
      `
      INSERT OR REPLACE INTO settings (key, value, type) VALUES (?, ?, ?)
    `,
      [key, stringValue, type]
    );

    console.log(`Updated setting ${key} = ${stringValue} (${type})`);
  }

  async deleteSetting(key: string): Promise<void> {
    const db = await this.getDb();
    await db.run('DELETE FROM settings WHERE key = ?', [key]);
    console.log(`Deleted setting: ${key}`);
  }

  async getAllSettings(): Promise<Record<string, any>> {
    const db = await this.getDb();
    const rows = await db.all('SELECT key, value, type FROM settings');

    const settings: Record<string, any> = {};

    for (const row of rows) {
      let value: any = row.value;
      if (row.type === 'number') {
        value = parseFloat(row.value);
      } else if (row.type === 'boolean') {
        value = row.value === 'true';
      } else if (row.type === 'json') {
        value = JSON.parse(row.value);
      }
      settings[row.key] = value;
    }

    return settings;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = undefined;
    }
  }
}

export = ThresholdDatasource;
