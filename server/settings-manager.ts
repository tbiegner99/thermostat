#!/usr/bin/env ts-node

/**
 * Thermostat Settings Manager CLI
 *
 * A command-line tool for managing thermostat settings in the SQLite key-value store.
 */

import * as path from 'path';
import ThresholdDatasource from './src/datasource/thresholds/ThresholdDatasource';
import { promises as fsPromises } from 'fs';

const SETTINGS_FILE = path.resolve(__dirname, 'database/settings.json');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const datasource = new ThresholdDatasource({
    settingsFile: SETTINGS_FILE,
    fs: fsPromises,
  });

  try {
    switch (command) {
      case 'list':
      case 'ls':
        await listSettings(datasource);
        break;

      case 'get':
        if (args.length < 2) {
          console.error('Usage: get <key>');
          process.exit(1);
        }
        await getSetting(datasource, args[1]);
        break;

      case 'set':
        if (args.length < 3) {
          console.error('Usage: set <key> <value>');
          process.exit(1);
        }
        await setSetting(datasource, args[1], args[2]);
        break;

      case 'delete':
      case 'del':
        if (args.length < 2) {
          console.error('Usage: delete <key>');
          process.exit(1);
        }
        await deleteSetting(datasource, args[1]);
        break;

      case 'reset':
        await resetSettings(datasource);
        break;

      case 'export':
        await exportSettings(datasource);
        break;

      default:
        showUsage();
    }
  } catch (error: any) {
    console.error('Error:', error?.message || error);
    process.exit(1);
  } finally {
    await datasource.close();
  }
}

async function listSettings(datasource: ThresholdDatasource) {
  console.log('📋 Current Thermostat Settings:');
  console.log('================================');

  const settings = await datasource.getAllSettings();

  for (const [key, value] of Object.entries(settings)) {
    console.log(`${key.padEnd(20)} = ${value} ${getUnit(key)}`);
  }
}

async function getSetting(datasource: ThresholdDatasource, key: string) {
  const value = await datasource.getSetting(key);
  if (value === null) {
    console.log(`Setting '${key}' not found`);
  } else {
    console.log(`${key} = ${value} ${getUnit(key)}`);
  }
}

async function setSetting(datasource: ThresholdDatasource, key: string, valueStr: string) {
  // Try to parse as number first, then boolean, then keep as string
  let value: any = valueStr;

  if (!isNaN(parseFloat(valueStr)) && isFinite(parseFloat(valueStr))) {
    value = parseFloat(valueStr);
  } else if (valueStr.toLowerCase() === 'true' || valueStr.toLowerCase() === 'false') {
    value = valueStr.toLowerCase() === 'true';
  }

  await datasource.setSetting(key, value);
  console.log(`✅ Set ${key} = ${value} ${getUnit(key)}`);
}

async function deleteSetting(datasource: ThresholdDatasource, key: string) {
  await datasource.deleteSetting(key);
  console.log(`🗑️ Deleted setting: ${key}`);
}

async function resetSettings(datasource: ThresholdDatasource) {
  console.log('⚠️ Resetting to default settings...');

  await datasource.update({
    margin: 1.0,
    heatThreshold: 20.0,
    coolingThreshold: 24.0,
    mode: 'auto' as any,
  });

  console.log('✅ Reset to default settings');
  await listSettings(datasource);
}

async function exportSettings(datasource: ThresholdDatasource) {
  const settings = await datasource.getAllSettings();
  console.log('📤 Exporting settings as JSON:');
  console.log(JSON.stringify(settings, null, 2));
}

function getUnit(key: string): string {
  if (key.includes('threshold') || key.includes('Threshold')) {
    return '°C';
  }
  if (key === 'margin') {
    return '°C';
  }
  return '';
}

function showUsage() {
  console.log(`
🏠 Thermostat Settings Manager

Usage:
  npm run settings <command> [arguments]

Commands:
  list, ls              List all settings
  get <key>            Get a specific setting value
  set <key> <value>    Set a setting value
  delete <key>         Delete a setting
  reset                Reset to default settings
  export               Export all settings as JSON

Examples:
  npm run settings list
  npm run settings get heatThreshold
  npm run settings set heatThreshold 21.5
  npm run settings set mode heat
  npm run settings delete customSetting
  npm run settings reset

Thermostat-specific settings:
  margin              Temperature margin for hysteresis (°C)
  heatThreshold       Temperature to start heating (°C)
  coolingThreshold    Temperature to start cooling (°C)
  mode                HVAC mode: heat, cool, auto, off
`);
}

if (require.main === module) {
  main().catch(console.error);
}
