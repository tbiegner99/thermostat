import HeatingController from './HeatingController';
const rpio = require('rpio');

interface GPIOHeatingControllerConfig {
  pin: string | number;
  invertLogic?: string | boolean;
}

class GPIOHeatingController extends HeatingController {
  private pinNumber: number;
  private invertLogic: boolean;
  private on: boolean = false;

  constructor({ pin, invertLogic }: GPIOHeatingControllerConfig) {
    super();
    this.pinNumber = Number.parseInt(pin.toString(), 10);
    this.invertLogic =
      typeof invertLogic === 'string' ? invertLogic === 'true' : Boolean(invertLogic);
    this.on = false;
    rpio.init({ mapping: 'gpio' });
    rpio.open(this.pinNumber, rpio.OUTPUT, this.getState(this.on));
  }

  private getState(on: boolean): number {
    const value = this.invertLogic ? !on : on;
    const pinState = value ? rpio.HIGH : rpio.LOW;
    return pinState;
  }

  private updatePinState(): void {
    rpio.write(this.pinNumber, this.getState(this.on));
  }

  override isOn(): boolean {
    return this.on;
  }

  override turnOn(): void {
    this.on = true;
    console.log(`turning on pin ${this.pinNumber}`);
    this.updatePinState();
  }

  override turnOff(): void {
    this.on = false;
    this.updatePinState();
  }
}

export = GPIOHeatingController;