import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore - node-getopt doesn't have types
import * as Getopt from 'node-getopt';
import Environment from './Environment';
import { setup, container } from './wiring';

import {
  Application,
  ConfigProcessor,
  CurrentConditionsRoutes,
} from '@tbiegner99/temperature-sensor';
import { ReporterConfig } from '@tbiegner99/reporter';
async function run(): Promise<void> {
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
    const data = await fs.promises.readFile(path.resolve(process.cwd(), options.config), {
      encoding: 'utf8',
    });
    config = JSON.parse(data);
  }

  setup(config);
  const routes = require('./routes');

  let reporters: any = {
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
  reporters = { ...ReporterConfig.loadFromEnvironment(), ...reporters };
  if (config.kafka) {
    reporters.kafka = {
      topic: config.kafka.topic,
      brokers: config.kafka.brokers,
      zoneName: config.zoneName,
      zoneDescritpion: config.zoneDescription,
      reportingInterval: config.kafka.reportingInterval * 1000,
      appName: config.zoneName,
    };
  }

  const appConfig = {
    zoneName: config.zoneName,
    zoneDescription: config.zoneDescription,
    appPort: config.appPort,
    gpioPin: config.temperatureSensorPin,
    interval: config.temperatureReportIntervalInSeconds * 1000,
    contextRoot: config.contextRoot,
    reporters: await ConfigProcessor.getReporters({ reporters }),
  };
  console.log(appConfig);
  const heatingService: any = container.resolve('heatingService');

  setInterval(heatingService.performCheck, config.checkIntervalInSeconds * 1000);

  new Application(appConfig).addRoutes(routes).addRoutes(CurrentConditionsRoutes).start();
}

run().catch(console.error);
