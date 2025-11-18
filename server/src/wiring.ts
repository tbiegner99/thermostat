import * as awilix from 'awilix';
import * as fs from 'fs';
import * as path from 'path';
import Environment, { Config } from './Environment';
import HeatingControllerFactory from './services/heatingControllers/HeatingControllerFactory';
import MqttThermostatService from './mqtt/MqttThermostatService';
import { EventEmitter } from 'events';
import { CurrentConditionsManager } from '@tbiegner99/reporter';
import { MQTT_EVENTS } from './constants/MqttEvents';

const SETTINGS_FILE = path.resolve(__dirname, '../database/settings.json');

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

export const setup = async (config: Config): Promise<void> => {
  const conditionsManager = new CurrentConditionsManager();

  conditionsManager.setZoneInfo({
    zoneName: config.zoneName,
    zoneDescription: config.zoneDescription,
  });

  const events = new EventEmitter();
  conditionsManager.setEmitter(events);

  console.log('Starting thermostat with SQLite database...');

  container.register({
    events: awilix.asValue(events),
    settingsFile: awilix.asValue(SETTINGS_FILE),
    fs: awilix.asValue(fs.promises),
    currentConditionsManager: awilix.asValue(conditionsManager),
  });

  container.loadModules(
    [
      path.resolve(__dirname, './datasource/**/*.js'),
      path.resolve(__dirname, './services/**/*.js'),
      path.resolve(__dirname, './controllers/**/*.js'),
    ],
    {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: awilix.Lifetime.SINGLETON,
        register: awilix.asClass,
      },
    }
  );

  // Get threshold datasource and read initial settings
  const thresholdDatasource = container.resolve('thresholdDatasource') as any;
  const thresholds = await thresholdDatasource.readSettings();
  console.log('Loaded initial temperature thresholds:', thresholds);

  const { controllers } = config;
  const controllerFactory = new HeatingControllerFactory();

  const heatingController = controllers?.heating
    ? controllerFactory.fromConfig(controllers.heating)
    : null;
  const coolingController = controllers?.cooling
    ? controllerFactory.fromConfig(controllers.cooling)
    : null;

  // Create MQTT service if configured
  let mqttService: MqttThermostatService | null = null;
  if (config.mqtt) {
    console.log('Initializing MQTT service with config:', config.mqtt);
    mqttService = new MqttThermostatService({ config: config.mqtt, emitter: events });
  }

  container.register({
    mqttService: awilix.asValue(mqttService),
    thresholds: awilix.asValue(thresholds),
    heatingController: awilix.asValue(heatingController),
    coolingController: awilix.asValue(coolingController),
  });
};
