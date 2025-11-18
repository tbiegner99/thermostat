#!/usr/bin/env node

/**
 * SQLite Migration Guide for Thermostat
 *
 * This guide explains how the thermostat has been upgraded from JSON file storage
 * to SQLite database storage for better reliability and performance.
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Thermostat Database Migration Guide');
console.log('=====================================');
console.log();

console.log('✅ What Changed:');
console.log('- Settings are now stored in SQLite database instead of JSON file');
console.log('- Better data integrity and concurrent access');
console.log('- Automatic migration from existing JSON settings');
console.log('- Backward compatibility during transition');
console.log();

console.log('📁 File Locations:');
console.log('- Old: server/database/settings.json');
console.log('- New: server/database/thermostat.db');
console.log();

console.log('🚀 Migration Process:');
console.log('1. SQLite database is automatically created on first run');
console.log('2. If settings.json exists, data is migrated automatically');
console.log('3. Default settings are created if no existing data found');
console.log('4. JSON file can be safely removed after migration');
console.log();

console.log('🛠️ What You Need to Do:');
console.log('1. Start the thermostat normally - migration is automatic');
console.log('2. Check logs for "Successfully migrated settings from JSON to SQLite"');
console.log('3. Optionally backup your settings.json file');
console.log('4. No configuration changes required');
console.log();

console.log('📋 Database Schema:');
console.log(`
CREATE TABLE threshold_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  margin REAL,
  heat_threshold REAL,
  cooling_threshold REAL,
  mode TEXT NOT NULL DEFAULT 'auto',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('🔍 Verify Migration:');
console.log('After starting the thermostat, check:');
console.log('1. Database file exists: server/database/thermostat.db');
console.log('2. Settings load correctly in the logs');
console.log('3. MQTT updates work with Home Assistant');
console.log();

console.log('🆘 Rollback (if needed):');
console.log('1. Stop the thermostat');
console.log('2. Delete thermostat.db');
console.log('3. Restore previous version of ThresholdDatasource.ts');
console.log('4. Ensure settings.json exists with valid data');
console.log();

console.log('📞 Support:');
console.log('- Check application logs for detailed migration info');
console.log('- Database operations are logged for troubleshooting');
console.log('- All existing API endpoints continue to work unchanged');

// Check if migration might be needed
const settingsPath = path.resolve(__dirname, '../database/settings.json');
const dbPath = path.resolve(__dirname, '../database/thermostat.db');

if (fs.existsSync(settingsPath)) {
  console.log();
  console.log('🟡 Found existing settings.json - automatic migration will occur on next start');
} else if (fs.existsSync(dbPath)) {
  console.log();
  console.log("🟢 SQLite database already exists - you're all set!");
} else {
  console.log();
  console.log('🆕 Fresh installation - default settings will be created');
}
