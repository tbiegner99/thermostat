class Environment {
  static loadConfig() {
    const heatingController = Environment.loadController('HEATING');
    const coolingController = Environment.loadController('COOLING');
    return {
      zoneName: process.env.ZONE_NAME || 'Default',
      zoneDescription: process.env.ZONE_DESCRIPTION,
      contextRoot: process.env.CONTEXT_ROOT || '/api',
      appPort: Number.parseInt(process.env.APP_PORT, 10) || 8080,
      temperatureSensorPin: Number.parseInt(process.env.TEMPERATURE_SENSOR_PIN, 10),
      temperatureReportIntervalInSeconds:
        Number.parseInt(process.env.REPORT_INTERVAL_SECONDS, 10) || 60,
      checkIntervalInSeconds: Number.parseInt(process.env.CHECK_INTERVAL_SECONDS, 10) || 5,
      ...Environment.loadKafkaConfig(),
      controllers: {
        heating: heatingController,
        cooling: coolingController,
      },
    };
  }

  static loadKafkaConfig(type) {
    if (process.env.USE_KAFKA !== 'true') {
      return {};
    }
    var interval = Number.parseInt(process.env.KAFKA_INTERVAL);
    console.log(process.env.KAFKA_BROKERS);
    return {
      kafka: {
        topic: process.env.KAFKA_TOPIC,
        brokers: process.env.KAFKA_BROKERS.split(','),
        reportingInterval: Number.isNaN(interval) ? 60 : interval,
      },
    };
  }

  static loadController(type) {
    const keyPrefix = `${type}_CONTROLLER_`;
    const controllerConfig = {};
    const getSettingNameFromVar = (key) => {
      const keyName = key.substring(keyPrefix.length).toLowerCase();
      return keyName.replace(/([-_][a-z])/gi, (group) => group.toUpperCase().replace('_', ''));
    };
    Object.entries(process.env)
      .filter(([key]) => key.startsWith(keyPrefix))
      .forEach(([key, value]) => {
        const keyName = getSettingNameFromVar(key);
        controllerConfig[keyName] = value;
      });
    return controllerConfig;
  }
}

module.exports = Environment;
