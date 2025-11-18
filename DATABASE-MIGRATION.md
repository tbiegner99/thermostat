# Database Migration to Key-Value Structure

## Overview

The thermostat project has been migrated from a fixed-column database schema to a flexible key-value structure. This provides better extensibility and easier management of settings.

## Benefits of Key-Value Structure

### 1. Extensibility
- Add new settings without database schema changes
- Support for different data types (string, number, boolean, JSON objects)
- Future-proof for unknown requirements

### 2. Type Safety
- Automatic type detection and conversion
- Type information stored alongside values
- Runtime validation of data types

### 3. Easy Management
- CLI tool for viewing and modifying settings
- No need for database migrations when adding new settings
- Settings can be added dynamically through the API

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL
)
```

## Migration Process

The system automatically migrates from the old `database.json` file format:
- Reads existing JSON configuration
- Converts to key-value pairs with proper typing
- Removes the old JSON file after successful migration
- Creates SQLite database with settings table

## CLI Management

Use the settings CLI tool to manage thermostat settings:

```bash
# List all settings
npm run settings list

# Get a specific setting
npm run settings get heatThreshold

# Set a setting (auto-detects type)
npm run settings set heatThreshold 22
npm run settings set mode "heat"

# Delete a setting
npm run settings delete someSetting
```

## Supported Data Types

- **string**: Text values
- **number**: Numeric values (integers and floats)
- **boolean**: true/false values
- **object**: JSON objects (automatically serialized/deserialized)

## Default Settings

After migration, the following settings are available:
- `margin`: Temperature margin in degrees (number)
- `heatThreshold`: Heating setpoint in degrees (number)
- `coolingThreshold`: Cooling setpoint in degrees (number)
- `mode`: Thermostat mode - auto, heat, cool, off (string)

## API Integration

The `ThresholdDatasource` class provides methods for programmatic access:
- `getSetting<T>(key: string): T | undefined`
- `setSetting<T>(key: string, value: T): void`
- `deleteSetting(key: string): boolean`
- `getAllSettings(): Record<string, any>`

This allows the MQTT service and other components to dynamically read and update settings without code changes.

## Home Assistant Integration

The key-value structure makes it easy to expose new settings to Home Assistant:
- Add new MQTT topics for additional settings
- Settings are immediately available without restart
- Type information ensures proper Home Assistant entity types

## Future Enhancements

With this flexible structure, we can easily add:
- Schedule settings (JSON objects)
- User preferences per room/zone
- Advanced algorithms with configurable parameters
- Temporary overrides with expiration times
- Historical setting changes logging