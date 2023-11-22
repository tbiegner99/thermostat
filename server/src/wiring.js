const awilix = require('awilix');
const fs = require('fs');
const path = require('path');
const { CurrentConditionsManager } = require('@tbiegner99/temperature-sensor');
const HeatingControllerFactory = require('./services/heatingControllers/HeatingControllerFactory');
const SETTINGS_FILE = path.resolve(__dirname, '../database/settings.json');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

const setup = (config) => {
  CurrentConditionsManager.setZoneInfo({
    zoneName: config.zoneName,
    zoneDescription: config.zoneDescription,
  });
  const fileContents = fs.readFileSync(SETTINGS_FILE);
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
  const { controllers = {} } = config;
  const controllerFactory = new HeatingControllerFactory();
  const heatingController = controllerFactory.fromConfig(controllers.heating);
  const coolingController = controllerFactory.fromConfig(controllers.cooling);

  container.register({
    fs: awilix.asValue(fs.promises),
    currentConditionsManager: awilix.asValue(CurrentConditionsManager),
    settingsFile: awilix.asValue(SETTINGS_FILE),
    thresholds: awilix.asValue(thresholds),
    heatingController: awilix.asValue(heatingController),
    coolingController: awilix.asValue(coolingController),
  });
};

module.exports = { setup, container };
