# Mode API Endpoint

## Set Thermostat Mode

Sets the operating mode of the thermostat.

### Endpoint

```
PUT /api/thresholds/mode
```

### Request Body

```json
{
  "mode": "auto"
}
```

### Valid Mode Values

- `"auto"` - Automatic heating/cooling based on thresholds
- `"heat"` - Heating only mode
- `"cool"` - Cooling only mode
- `"off"` - Thermostat disabled

### Response

Returns the updated threshold settings including the new mode:

```json
{
  "margin": 1.0,
  "heatThreshold": 20.0,
  "coolingThreshold": 24.0,
  "mode": "auto"
}
```

### Error Responses

- **400 Bad Request**:
  - Missing mode in request body
  - Invalid mode value (not one of: auto, heat, cool, off)
- **500 Internal Server Error**: Database or service error

### Validation

The API validates that:

- The `mode` field is present in the request body
- The `mode` value is one of the valid enum values: `auto`, `heat`, `cool`, `off`
- Invalid modes will return a 400 error with a list of valid options

### Example Usage

```bash
# Set to auto mode
curl -X PUT http://localhost:8080/api/thresholds/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "auto"}'

# Set to heating only
curl -X PUT http://localhost:8080/api/thresholds/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "heat"}'

# Turn off thermostat
curl -X PUT http://localhost:8080/api/thresholds/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "off"}'
```

### Integration

This endpoint integrates with:

- **MQTT Service**: Mode changes are published to Home Assistant
- **Heating Service**: Physical controllers are updated immediately
- **Database**: Mode is persisted in SQLite database
- **Event System**: Other services are notified of mode changes

### UI Integration

The thermostat UI can use this endpoint to provide mode control:

- Dropdown/button group for mode selection
- Real-time feedback with updated settings response
- Error handling for invalid modes
