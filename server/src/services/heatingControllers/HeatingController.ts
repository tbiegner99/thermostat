class HeatingController {
  public override: boolean = false;

  constructor() {}

  turnOn(): void {}

  turnOff(): void {}

  isOn(): boolean {
    return false;
  }

  isOverrideOn(): boolean {
    return this.override;
  }
}

export = HeatingController;
