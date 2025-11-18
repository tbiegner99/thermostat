# Docker SQLite Migration

## Changes Made

The dockerfile has been updated to support the new SQLite database backend:

### 1. SQLite Installation

- Added `sqlite3` package installation alongside vim
- This provides the SQLite3 runtime needed for the sqlite3 Node.js package

### 2. Database Directory Setup

- Removed old JSON file creation (`database/settings.json`)
- Created proper database directory with correct permissions:
  - `chown -R node:node ./database` - Ensures node user owns the database directory
  - `chmod 755 ./database` - Sets proper read/write permissions

### 3. Database Initialization

- Creates SQLite database schema with settings table during container build
- Adds timestamp trigger for tracking setting updates
- Inserts default values:
  - `heatThreshold`: 20.0°C
  - `coolingThreshold`: 24.0°C  
  - `margin`: 1.0°C
  - `mode`: "auto"
- Uses `INSERT OR REPLACE` to handle existing databases gracefully

### 4. Volume Mapping (Already Configured)

The docker-compose.yml already has the correct volume mapping:

```yaml
volumes:
  - ./server/database:/srv/package/database
```

This ensures:

- SQLite database persists between container restarts
- Database files are stored on the host filesystem
- Easy backup and migration of database files

## Database Files

The SQLite database will be created at:

- Container path: `/srv/package/database/thermostat.db`
- Host path: `./server/database/thermostat.db`

## Migration Process

When the container starts with the new SQLite configuration:

1. **Pre-initialized Database**: The SQLite database is created during the Docker build process with default settings
2. **Automatic Migration**: If an existing `database.json` file exists on the host volume, the application will migrate it and merge with defaults
3. **Volume Persistence**: Database persists between container updates via volume mapping
4. **Ready to Use**: Container starts with sensible defaults immediately available

## Benefits

- **Persistence**: Database survives container restarts and updates
- **Performance**: SQLite provides better performance than JSON file I/O
- **Atomicity**: Database transactions ensure data consistency
- **Extensibility**: Easy to add new settings without schema changes
- **CLI Management**: Use `npm run settings` commands to manage database

## Deployment

To deploy with the new SQLite support:

1. Build the new Docker image:

   ```bash
   docker build -t tbiegner99/thermostat-backend ./server
   ```

2. Update the running container:

   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Verify the migration:
   ```bash
   docker exec -it thermostat npm run settings list
   ```

The existing volume mapping ensures your settings will be preserved during the migration.
