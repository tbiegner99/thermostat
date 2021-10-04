const {
  Application,
  ConfigProcessor,
  CurrentConditionsRoutes,
} = require('@tbiegner99/temperature-sensor');
const Getopt = require('node-getopt');
const Environment = require('./Environment');
const { setup, container } = require('./wiring');

const getopt = new Getopt([
  ['c', 'config=', 'location of the configuration file'],
  ['h', 'help'],
]).bindHelp();

const { options } = getopt.parse(process.argv.slice(2));
let config;
if (!options.config) {
  config = Environment.loadConfig();
  console.warn('Config file not passed. Using config from environment: ', config);
} else {
  config = require(options.config); // eslint-disable-line import/no-dynamic-require
}

setup(config);
const routes = require('./routes');

const reporters = {
  logger: {
    formatters: {
      humidity: {},
      temperature: {
        unit: 'C',
      },
    },
  },
  currentStatus: {},
};

const appConfig = {
  zoneName: config.zoneName,
  zoneDescription: config.zoneDescription,
  appPort: config.appPort,
  gpioPin: config.temperatureSensorPin,
  interval: config.temperatureReportIntervalInSeconds * 1000,
  contextRoot: config.contextRoot,
  reporters: ConfigProcessor.getReporters({ reporters }),
};
const heatingService = container.resolve('heatingService');

setInterval(heatingService.performCheck, config.checkIntervalInSeconds * 1000);

new Application(appConfig).addRoutes(routes).addRoutes(CurrentConditionsRoutes).start();
