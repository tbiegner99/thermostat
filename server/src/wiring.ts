import * as awilix from 'awilix';
import * as fs from 'fs';
import * as path from 'path';
import Environment, { Config } from './Environment';
import HeatingControllerFactory from './services/heatingControllers/HeatingControllerFactory';

const { CurrentConditionsManager } = require('@tbiegner99/temperature-sensor');

const SETTINGS_FILE = path.resolve(__dirname, '../database/settings.json');

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

export const setup = (config: Config): void => {
  CurrentConditionsManager.setZoneInfo({
    zoneName: config.zoneName,
    zoneDescription: config.zoneDescription,
  });
  const fileContents = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const thresholds = JSON.parse(fileContents);
  console.log('Starting temperature thresholds', thresholds);
  container.loadModules(
    [
      path.resolve(__dirname, './controllers/**/*.js'),
      path.resolve(__dirname, './datasource/**/*.js'),
      path.resolve(__dirname, './services/**/*.js'),
    ],
    {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: awilix.Lifetime.SINGLETON,
        register: awilix.asClass,
      },
    }
  );
  const { controllers } = config;
  const controllerFactory = new HeatingControllerFactory();
  const heatingController = controllers?.heating
    ? controllerFactory.fromConfig(controllers.heating)
    : null;
  const coolingController = controllers?.cooling
    ? controllerFactory.fromConfig(controllers.cooling)
    : null;

  container.register({
    fs: awilix.asValue(fs.promises),
    currentConditionsManager: awilix.asValue(CurrentConditionsManager),
    settingsFile: awilix.asValue(SETTINGS_FILE),
    thresholds: awilix.asValue(thresholds),
    heatingController: awilix.asValue(heatingController),
    coolingController: awilix.asValue(coolingController),
  });
};
