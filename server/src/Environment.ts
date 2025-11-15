interface ControllerConfig {
  type?: string;
  [key: string]: string | undefined;
}

interface KafkaConfig {
  topic: string;
  brokers: string[];
  reportingInterval: number;
}

export interface Config {
  zoneName: string;
  zoneDescription: string;
  contextRoot: string;
  appPort: number;
  temperatureSensorPin: number;
  temperatureReportIntervalInSeconds: number;
  checkIntervalInSeconds: number;
  kafka?: KafkaConfig;
  controllers: {
    heating: ControllerConfig;
    cooling: ControllerConfig;
  };
}

class Environment {
  static loadConfig(): Config {
    const heatingController = Environment.loadController('HEATING');
    const coolingController = Environment.loadController('COOLING');
    return {
      zoneName: process.env.ZONE_NAME || 'Default',
      zoneDescription: process.env.ZONE_DESCRIPTION || '',
      contextRoot: process.env.CONTEXT_ROOT || '/api',
      appPort: Number.parseInt(process.env.APP_PORT || '8080', 10),
      temperatureSensorPin: Number.parseInt(process.env.TEMPERATURE_SENSOR_PIN || '0', 10),
      temperatureReportIntervalInSeconds: Number.parseInt(
        process.env.REPORT_INTERVAL_SECONDS || '60',
        10
      ),
      checkIntervalInSeconds: Number.parseInt(process.env.CHECK_INTERVAL_SECONDS || '5', 10),
      ...Environment.loadKafkaConfig(),
      controllers: {
        heating: heatingController,
        cooling: coolingController,
      },
    };
  }

  static loadKafkaConfig(): { kafka?: KafkaConfig } {
    if (process.env.USE_KAFKA !== 'true') {
      return {};
    }
    const interval = Number.parseInt(process.env.KAFKA_INTERVAL || '60', 10);
    console.log(process.env.KAFKA_BROKERS);
    return {
      kafka: {
        topic: process.env.KAFKA_TOPIC || '',
        brokers: process.env.KAFKA_BROKERS?.split(',') || [],
        reportingInterval: Number.isNaN(interval) ? 60 : interval,
      },
    };
  }

  static loadController(type: string): ControllerConfig {
    const keyPrefix = `${type}_CONTROLLER_`;
    const controllerConfig: ControllerConfig = {};
    const getSettingNameFromVar = (key: string): string => {
      const keyName = key.substring(keyPrefix.length).toLowerCase();
      return keyName.replace(/([-_][a-z])/gi, (group) => group.toUpperCase().replace('_', ''));
    };
    Object.entries(process.env)
      .filter(([key]) => key.startsWith(keyPrefix))
      .forEach(([key, value]) => {
        const keyName = getSettingNameFromVar(key);
        controllerConfig[keyName] = value ?? '';
      });
    return controllerConfig;
  }
}

export default Environment;
