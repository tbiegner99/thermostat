const {
  Application,
  ConfigProcessor,
  CurrentConditionsRoutes,
} = require("@tjb/temperature-sensor");
const Getopt = require("node-getopt");
const { setup, container } = require("./wiring");

const getopt = new Getopt([
  ["c", "config=", "location of the configuration file"],
  ["h", "help"],
]).bindHelp();

const { options } = getopt.parse(process.argv.slice(2));

if (!options.config) {
  console.error("Config file is required. Pass --config");
  process.exit(1);
}
const config = require(options.config); // eslint-disable-line import/no-dynamic-require

setup(config);
const routes = require("./routes");

const reporters = {
  logger: {
    formatters: {
      humidity: {},
      temperature: {
        unit: "C",
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
const heatingService = container.resolve("heatingService");

setInterval(heatingService.performCheck, config.checkIntervalInSeconds * 1000);

new Application(appConfig)
  .addRoutes(routes)
  .addRoutes(CurrentConditionsRoutes)
  .start();
