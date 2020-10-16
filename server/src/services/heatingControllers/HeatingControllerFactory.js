const GPIOHeatingController = require("./GPIOHeatingController");
const WemoController = require("./WemoController");

class HeatingControllerFactory {
  fromConfig(config) {
    if (!config) return null;
    let Class;
    switch (config.type) {
      case "gpio":
        Class = GPIOHeatingController;
        break;
      case "wemo":
        Class = WemoController;
        break;
      case "module":
        Class = require(config.module);
        break;
      default:
        return null;
    }
    return new Class(config);
  }
}

module.exports = HeatingControllerFactory;
