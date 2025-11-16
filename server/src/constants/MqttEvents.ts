/**
 * MQTT Event Constants
 *
 * These constants define the event names used for communication between
 * the MQTT service and other components of the thermostat system.
 */

export const MQTT_EVENTS = {
  // Mode control events
  SET_MODE: 'setMode',
  TURN_ON: 'turnOn',
  TURN_OFF: 'turnOff',

  // Temperature control events
  SET_TEMPERATURE: 'setTemperature',
  SET_HEATING_THRESHOLD: 'setHeatingThreshold',
  SET_COOLING_THRESHOLD: 'setCoolingThreshold',

  // Manual override events
  SET_HEATING: 'setHeating',
  SET_COOLING: 'setCooling',

  // State update events
  HEATING_THRESHOLD_UPDATED: 'heatingThresholdUpdated',
  COOLING_THRESHOLD_UPDATED: 'coolingThresholdUpdated',
  MARGIN_UPDATED: 'marginUpdated',
  TEMPERATURE_CHANGED: 'temperatureChanged',
} as const;

// Type for event names to ensure type safety
export type MqttEventName = typeof MQTT_EVENTS[keyof typeof MQTT_EVENTS];
