import * as mqtt from 'mqtt';
import { EventEmitter } from 'events';
import { MQTT_EVENTS } from '../constants/MqttEvents';

interface MqttConfig {
  brokerUrl: string;
  username?: string;
  password?: string;
  clientId?: string;
  baseTopic: string;
}

export class MqttThermostatService extends EventEmitter {
  private client: mqtt.MqttClient;
  private config: MqttConfig;
  private baseTopic: string;

  constructor(config: MqttConfig) {
    super();
    this.config = config;
    this.baseTopic = config.baseTopic;

    // Connect to MQTT broker
    this.client = mqtt.connect(config.brokerUrl, {
      username: config.username,
      password: config.password,
      clientId: config.clientId || `thermostat-${Date.now()}`,
      clean: true,
      will: {
        topic: `${this.baseTopic}/availability`,
        payload: 'offline',
        retain: true,
        qos: 1,
      },
    });

    this.setupMqttHandlers();
    this.subscribeToCommands();
  }

  private setupMqttHandlers(): void {
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');

      // Publish availability
      this.client.publish(`${this.baseTopic}/availability`, 'online', { retain: true, qos: 1 });

      // Publish Home Assistant auto-discovery config
      this.publishAutoDiscoveryConfig();
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
    });

    this.client.on('message', (topic, message) => {
      this.handleCommand(topic, message.toString());
    });
  }

  private subscribeToCommands(): void {
    const commandTopics = [
      `${this.baseTopic}/mode/set`,
      `${this.baseTopic}/temperature/heating/set`, // Dual setpoint - heating threshold
      `${this.baseTopic}/temperature/cooling/set`, // Dual setpoint - cooling threshold
      `${this.baseTopic}/heating/set`,
      `${this.baseTopic}/cooling/set`,
    ];

    commandTopics.forEach((topic) => {
      this.client.subscribe(topic, { qos: 1 });
    });
  }

  private handleCommand(topic: string, message: string): void {
    try {
      console.log(`Received MQTT command on ${topic}: ${message}`);

      if (topic.endsWith('/mode/set')) {
        // Home Assistant sends: "heat", "cool", "auto", "off" (lowercase)
        this.emit(MQTT_EVENTS.SET_MODE, message.toLowerCase());
      } else if (topic.endsWith('/temperature/heating/set')) {
        // Dual setpoint - heating threshold
        const temperature = parseFloat(message);
        if (!isNaN(temperature)) {
          this.emit(MQTT_EVENTS.SET_HEATING_THRESHOLD, temperature);
        }
      } else if (topic.endsWith('/temperature/cooling/set')) {
        // Dual setpoint - cooling threshold
        const temperature = parseFloat(message);
        if (!isNaN(temperature)) {
          this.emit(MQTT_EVENTS.SET_COOLING_THRESHOLD, temperature);
        }
      } else if (topic.endsWith('/heating/set')) {
        const enable =
          message.toLowerCase() === 'on' || message === '1' || message.toLowerCase() === 'true';
        this.emit(MQTT_EVENTS.SET_HEATING, enable);
      } else if (topic.endsWith('/cooling/set')) {
        const enable =
          message.toLowerCase() === 'on' || message === '1' || message.toLowerCase() === 'true';
        this.emit(MQTT_EVENTS.SET_COOLING, enable);
      }
    } catch (error) {
      console.error('Error handling MQTT command:', error);
    }
  }

  public publishTemperature(temperature: number): void {
    // Publish as plain number string with 1 decimal place (HA format)
    this.publishTopic('temperature/current', temperature.toFixed(1), true);
  }

  public publishTargetTemperature(temperature: number): void {
    // Publish as plain number string with 1 decimal place (HA format)
    this.publishTopic('temperature/target', temperature.toFixed(1), true);
  }

  public publishMode(mode: string): void {
    // Publish as lowercase string (HA requirement)
    this.publishTopic('mode', mode.toLowerCase(), true);
  }

  public publishHeatingThreshold(temperature: number): void {
    // Publish heating threshold for dual setpoint
    this.publishTopic('temperature/heating/target', temperature.toFixed(1), true);
  }

  public publishCoolingThreshold(temperature: number): void {
    // Publish cooling threshold for dual setpoint
    this.publishTopic('temperature/cooling/target', temperature.toFixed(1), true);
  }

  public publishThresholds(thresholds: any): void {
    this.publishTopic('thresholds', JSON.stringify(thresholds), true);
  }

  private publishTopic(subtopic: string, payload: string, retain = false): void {
    const topic = `${this.baseTopic}/${subtopic}`;
    this.client.publish(topic, payload, { retain, qos: 1 });
  }

  private publishAutoDiscoveryConfig(): void {
    const deviceInfo = {
      identifiers: [`thermostat_${this.baseTopic.replace(/\//g, '_')}`],
      name: 'Custom Thermostat',
      model: 'DIY Thermostat v1.0',
      manufacturer: 'Custom',
    };

    // Climate entity auto-discovery with dual setpoints
    const climateConfig = {
      name: 'Thermostat',
      unique_id: `thermostat_climate_${this.baseTopic.replace(/\//g, '_')}`,
      device: deviceInfo,

      // Temperature topics
      current_temperature_topic: `${this.baseTopic}/temperature/current`,

      // Dual setpoint configuration (heating and cooling thresholds)
      temperature_low_state_topic: `${this.baseTopic}/temperature/heating/target`,
      temperature_high_state_topic: `${this.baseTopic}/temperature/cooling/target`,
      temperature_low_command_topic: `${this.baseTopic}/temperature/heating/set`,
      temperature_high_command_topic: `${this.baseTopic}/temperature/cooling/set`,

      // Mode topics
      mode_state_topic: `${this.baseTopic}/mode`,
      mode_command_topic: `${this.baseTopic}/mode/set`,

      // Action topic (what system is doing)
      action_topic: `${this.baseTopic}/action`,

      // Availability
      availability_topic: `${this.baseTopic}/availability`,
      payload_available: 'online',
      payload_not_available: 'offline',

      // Supported modes
      modes: ['off', 'heat', 'cool', 'auto'],

      // Temperature configuration
      temperature_unit: 'C',
      min_temp: 10,
      max_temp: 35,
      temp_step: 0.5,
      precision: 0.1,

      // JSON attributes for additional state
      json_attributes_topic: `${this.baseTopic}/state`,
    };

    const discoveryTopic = `homeassistant/climate/${this.baseTopic.replace(/\//g, '_')}/config`;
    this.client.publish(discoveryTopic, JSON.stringify(climateConfig), { retain: true, qos: 1 });

    // Temperature sensor auto-discovery
    const tempSensorConfig = {
      name: 'Current Temperature',
      unique_id: `thermostat_temp_${this.baseTopic.replace(/\//g, '_')}`,
      device: deviceInfo,
      state_topic: `${this.baseTopic}/temperature/current`,
      availability_topic: `${this.baseTopic}/availability`,
      unit_of_measurement: '°C',
      device_class: 'temperature',
      state_class: 'measurement',
    };

    const tempDiscoveryTopic = `homeassistant/sensor/${this.baseTopic.replace(
      /\//g,
      '_'
    )}_temp/config`;
    this.client.publish(tempDiscoveryTopic, JSON.stringify(tempSensorConfig), {
      retain: true,
      qos: 1,
    });
  }

  public disconnect(): void {
    if (this.client) {
      this.client.publish(`${this.baseTopic}/availability`, 'offline', { retain: true, qos: 1 });
      this.client.end();
    }
  }
}
