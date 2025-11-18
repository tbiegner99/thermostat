import { promises as fsPromises } from 'fs';
import { Mode } from '../../models/mode';
import sqlite3 from 'sqlite3'
interface ThresholdSettings {
  margin?: number;
  heatThreshold?: number;
  coolingThreshold?: number;
  mode:Mode;
  [key: string]: any;
}

interface ThresholdDatasourceDependencies {
  settingsFile: string;
  fs: typeof fsPromises;
}

class ThresholdDatasource {
  private settingsFile: string;
  private fs: typeof fsPromises;
  private settings?: ThresholdSettings

  constructor({ settingsFile, fs }: ThresholdDatasourceDependencies) {
    this.settingsFile = settingsFile;
    this.fs = fs
    
  }
  

  async readSettings(): Promise<ThresholdSettings> {
    const content = await this.fs.readFile(this.settingsFile, 'utf8');
    const settings = JSON.parse(content) as ThresholdSettings;
    this.settings = settings;
    return settings;
  }

  async update(settings: Partial<ThresholdSettings>): Promise<void> {
    try {
      if(!this.settings) {
        this.settings = await this.readSettings();
      }
      this.settings = { ...this.settings, ...settings };
      await this.fs.writeFile(this.settingsFile, JSON.stringify(this.settings, undefined, 4));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

 updateMode(mode:Mode) : Promise<void> {
  return this.update({ mode })
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
}

export = ThresholdDatasource;
