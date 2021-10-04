const rpio = require('rpio');
const HeatingController = require('./HeatingController');

class GPIOHeatingController extends HeatingController {
  constructor({ pin, invertLogic }) {
    super();
    this.pinNumber = Number.parseInt(pin, 10);
    this.invertLogic =
      typeof invertLogic === 'string' ? invertLogic === 'true' : Boolean(invertLogic);
    this.on = false;
    rpio.init({ mapping: 'gpio' });
    rpio.open(this.pinNumber, rpio.OUTPUT, this.getState(this.on));
  }

  getState(on) {
    const value = this.invertLogic ? !on : on;
    const pinState = value ? rpio.HIGH : rpio.LOW;
    return pinState;
  }

  updatePinState() {
    rpio.write(this.pinNumber, this.getState(this.on));
  }

  isOn() {
    return this.on;
  }

  turnOn() {
    this.on = true;
    console.log(`turning on pin ${this.pinNumber}`);
    this.updatePinState();
  }

  turnOff() {
    this.on = false;
    this.updatePinState();
  }
}

module.exports = GPIOHeatingController;
