import EventEmitter from 'events';

import { MQTT_EVENTS } from '../constants/MqttEvents';

interface Controller {
  isOn(): boolean;
  turnOn(): void;
  turnOff(): void;
  override?: boolean;
}

export enum Mode {
  HEATING = 'heating',
  COOLING = 'cooling',
  AUTO = 'auto',
  OFF = 'off',
}

interface CurrentConditionsManager {
  getCurrentTemperature(): { temperature: number };
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
}

export class HeatingService {
  private coolingController?: Controller;
  private heatingController?: Controller;
  private currentConditionsManager: CurrentConditionsManager;
  private thresholds: Thresholds;
  private events?: EventEmitter;
  public mode: Mode = Mode.AUTO;

  constructor({
    thresholds,
    currentConditionsManager,
    coolingController,
    heatingController,
    events,
  }: HeatingServiceDependencies) {
    this.coolingController = coolingController;
    this.heatingController = heatingController;
    this.currentConditionsManager = currentConditionsManager;
    this.thresholds = thresholds;
    this.events = events;

    this.performCheck = this.performCheck.bind(this);

    // Setup MQTT handlers if MQTT service is available
    if (this.events) {
      this.setupMqttHandlers();
    }
    process.on('exit', () => {
      if (this.coolingController) {
        this.coolingController.turnOff();
      }

      if (this.heatingController) {
        this.heatingController.turnOff();
      }
    });
  }

  private setupMqttHandlers(): void {
    if (!this.events) return;

    console.log('Setting up MQTT handlers for HeatingService');

    // Handle mode changes from Home Assistant
    this.events.on(MQTT_EVENTS.SET_MODE, (mode: string) => {
      console.log(`MQTT: Setting mode to ${mode}`);
      this.setMode(mode as Mode);
    });

    // Handle single temperature commands (fallback)
    this.events.on(MQTT_EVENTS.SET_TEMPERATURE, (temperature: number) => {
      console.log(`MQTT: Setting temperature to ${temperature}°C`);
      if (this.mode === Mode.HEATING) {
        this.setHeatingThreshold(temperature);
      } else if (this.mode === Mode.COOLING) {
        this.setCoolingThreshold(temperature);
      }
    });

    // Handle dual setpoint commands
    this.events.on(MQTT_EVENTS.SET_HEATING_THRESHOLD, (temperature: number) => {
      console.log(`MQTT: Setting heating threshold to ${temperature}°C`);
      this.thresholds.heatThreshold = temperature;
    });

    this.events.on(MQTT_EVENTS.SET_COOLING_THRESHOLD, (temperature: number) => {
      console.log(`MQTT: Setting cooling threshold to ${temperature}°C`);
      this.thresholds.coolingThreshold = temperature;
    });

    // Handle manual override commands
    this.events.on(MQTT_EVENTS.SET_HEATING, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.mode = Mode.HEATING;
      this.performCheck();
    });

    // Handle manual override commands
    this.events.on(MQTT_EVENTS.TURN_ON, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.mode = Mode.AUTO;
      this.performCheck();
    });

    this.events.on(MQTT_EVENTS.TURN_OFF, (enable: boolean) => {
      console.log(`MQTT: Setting heating override to ${enable}`);
      this.mode = Mode.OFF;
      this.performCheck();
    });

    this.events.on(MQTT_EVENTS.SET_COOLING, (enable: boolean) => {
      console.log(`MQTT: Setting cooling override to ${enable}`);
      this.mode = Mode.COOLING;
      this.performCheck();
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
    };
  }

  setHeatingThreshold(threshold: number): void {
    this.thresholds.heatThreshold = threshold;
    this.events?.emit(MQTT_EVENTS.HEATING_THRESHOLD_UPDATED, {
      value: threshold,
    });
  }

  setCoolingThreshold(threshold: number): void {
    this.thresholds.coolingThreshold = threshold;
    this.events?.emit(MQTT_EVENTS.COOLING_THRESHOLD_UPDATED, {
      value: threshold,
    });
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

    const { temperature } = this.currentConditionsManager.getCurrentTemperature();
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
      return;
    }
    if ((this.mode === Mode.OFF || this.mode === Mode.COOLING) && this.coolingController.isOn()) {
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

    const { temperature } = this.currentConditionsManager.getCurrentTemperature();
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
