const {
  Application,
  ConfigProcessor,
  CurrentConditionsRoutes,
} = require("@tjb/temperature-sensor");
const config = require("../config.json");
const { setup, container } = require("./wiring");

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
