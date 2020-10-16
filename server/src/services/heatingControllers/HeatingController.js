class HeatingController {
  constructor() {
    this.override = false;
  }
  turnOn() {}

  turnOff() {}

  isOn() {}

  isOverrideOn() {
    return this.override;
  }
}

module.exports = HeatingController;
