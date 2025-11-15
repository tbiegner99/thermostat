import GPIOHeatingController from './GPIOHeatingController';
import WemoController from './WemoController';
import HeatingController from './HeatingController';

interface ControllerConfig {
  type?: string;
  module?: string;
  [key: string]: any;
}

type ControllerClass = new (config: any) => HeatingController;

class HeatingControllerFactory {
  fromConfig(config: ControllerConfig | undefined): HeatingController | null {
    if (!config || !config.type) return null;
    let Class: ControllerClass;
    switch (config.type) {
      case 'gpio':
        Class = GPIOHeatingController;
        break;
      case 'wemo':
        Class = WemoController;
        break;
      case 'module':
        if (!config.module) return null;
        Class = require(config.module);
        break;
      default:
        return null;
    }
    return new Class(config);
  }
}

export = HeatingControllerFactory;
