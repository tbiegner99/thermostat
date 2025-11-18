import EventEmitter from 'events';

import { MQTT_EVENTS } from '../constants/MqttEvents';
import { Mode } from '../models/mode';

interface Controller {
  isOn(): boolean;
  turnOn(): void;
  turnOff(): void;
  override?: boolean;
}

interface CurrentConditionsManager {
  getCurrentTemperature(): { temperature: number };
  currentTemperature: number;
}

interface Thresholds {
  heatThreshold?: number;
  coolingThreshold?: number;
  margin?: number;
}

interface HeatingServiceDependencies {
  thresholds: Thresholds;
  currentConditionsManager: CurrentConditionsManager;
  coolingController?: Controller;
  heatingController?: Controller;
  events?: EventEmitter;
}

interface ControllerStatus {
  on: boolean;
  overrideEnabled?: boolean;
}

interface SystemStatus {
  heating: ControllerStatus;
  cooling: ControllerStatus;
  mode: Mode;
}

class HeatingService {
  private coolingController?: Controller;
  private heatingController?: Controller;
  private currentConditionsManager: CurrentConditionsManager;
  private thresholds: Thresholds;
  private events?: EventEmitter;
  private mode: Mode = Mode.AUTO;

  constructor({
    thresholds,
    currentConditionsManager,
    coolingController,
    heatingController,
  }: HeatingServiceDependencies) {
    this.coolingController = coolingController;
    this.heatingController = heatingController;
    this.currentConditionsManager = currentConditionsManager;
    this.thresholds = thresholds;

    this.performCheck = this.performCheck.bind(this);

    process.on('exit', () => {
      if (this.coolingController) {
        this.coolingController.turnOff();
      }

      if (this.heatingController) {
        this.heatingController.turnOff();
      }
    });
  }

  private getControllerStatus(controller?: Controller): ControllerStatus {
    return {
      on: controller?.isOn() ?? false,
      overrideEnabled: controller?.override,
    };
  }

  getSystemStatus(): SystemStatus {
    return {
      heating: this.getControllerStatus(this.heatingController),
      cooling: this.getControllerStatus(this.coolingController),
      mode: this.mode,
    };
  }

  setHeatingThreshold(threshold: number): void {
    console.log(`Updating heating threshold to: ${threshold}`);
    this.thresholds.heatThreshold = threshold;
  }

  setCoolingThreshold(threshold: number): void {
    console.log(`Updating cooling threshold to: ${threshold}`);
    this.thresholds.coolingThreshold = threshold;
  }

  setMargin(margin: number): void {
    this.thresholds.margin = margin;
    this.events?.emit(MQTT_EVENTS.MARGIN_UPDATED, {
      value: margin,
    });
  }

  setMode(mode: Mode): void {
    this.mode = mode;
    this.performCheck();
  }

  private handleHeating(): void {
    if (!this.heatingController || this.heatingController.override) {
      console.log('Skipping heating');
      return;
    }
    if ((this.mode === Mode.OFF || this.mode === Mode.COOLING) && this.heatingController.isOn()) {
      this.heatingController.turnOff();
      console.log(`turning off heat due to mode ${this.mode}`);
      return;
    }

    if (
      (this.mode === Mode.HEATING || this.heatingController.override) &&
      !this.heatingController.isOn()
    ) {
      this.heatingController.turnOn();
      console.log(`turning on heat due to mode ${this.mode}`);
      return;
    }
    const { margin = 0, heatThreshold } = this.thresholds;
    if (heatThreshold === undefined) return;

    const temperature = this.currentConditionsManager.currentTemperature;
    if (this.heatingController.isOn()) {
      if (temperature > heatThreshold + margin) {
        console.log('turning off heat');
        this.heatingController.turnOff();
      }
    } else if (temperature < heatThreshold - margin) {
      console.log('turning on heat');
      this.heatingController.turnOn();
    }
  }

  private handleCooling(): void {
    if (!this.coolingController || this.coolingController.override) {
      console.log('Skipping heating');
      return;
    }
    if ((this.mode === Mode.OFF || this.mode === Mode.HEATING) && this.coolingController.isOn()) {
      this.coolingController.turnOff();
      console.log(`turning off AC due to mode ${this.mode}`);
      return;
    }
    if (
      (this.mode === Mode.COOLING || this.coolingController.override) &&
      !this.coolingController.isOn()
    ) {
      this.coolingController.turnOn();
      console.log(`turning on AC due to mode ${this.mode}`);
      return;
    }
    const { margin = 0, coolingThreshold } = this.thresholds;
    if (coolingThreshold === undefined) return;

    const temperature = this.currentConditionsManager.currentTemperature;
    if (this.coolingController.isOn()) {
      if (temperature < coolingThreshold - margin) {
        console.log('turning off AC');
        this.coolingController.turnOff();
      }
    } else if (temperature > coolingThreshold + margin) {
      console.log('turning on AC');
      this.coolingController.turnOn();
    }
  }

  performCheck(): void {
    try {
      this.handleHeating();
    } catch (err) {
      console.error('Error processing heating', err);
    }
    try {
      this.handleCooling();
    } catch (err) {
      console.error('Error processing cooling', err);
    }
  }

  overrideHeat(on: boolean): void {
    if (this.heatingController) {
      this.heatingController.override = true;
      this.performCheck();
    }
  }

  overrideCooling(on: boolean): void {
    if (this.coolingController) {
      this.coolingController.override = true;
      this.performCheck();
    }
  }

  disableHeatingOverride(): void {
    if (this.heatingController) {
      this.heatingController.override = false;
      this.performCheck();
    }
  }

  disableCoolingOverride(): void {
    if (this.coolingController) {
      this.coolingController.override = false;
      this.performCheck();
    }
  }
}
export = HeatingService;
