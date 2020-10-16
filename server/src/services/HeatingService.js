class HeatingService {
  constructor({
    thresholds,
    currentConditionsManager,
    coolingController,
    heatingController,
  }) {
    this.coolingController = coolingController;
    this.heatingController = heatingController;
    this.currentConditionsManager = currentConditionsManager;
    this.thresholds = thresholds;

    this.performCheck = this.performCheck.bind(this);
    process.on("exit", () => {
      if (this.coolingController) {
        this.coolingController.turnOff();
      }

      if (this.heatingController) {
        this.heatingController.turnOff();
      }
    });
  }

  getControllerStatus(controller) {
    return {
      on: controller.isOn(),
      overrideEnabled: controller.override,
    };
  }

  getSystemStatus() {
    return {
      heating: this.getControllerStatus(this.heatingController),
      cooling: this.getControllerStatus(this.coolingController),
    };
  }

  setHeatingThreshold(threshold) {
    this.thresholds.heatThreshold = threshold;
  }

  setCoolingThreshold(threshold) {
    this.thresholds.coolingThreshold = threshold;
  }

  setMargin(margin) {
    this.thresholds.margin = margin;
  }

  handleHeating() {
    if (!this.heatingController || this.heatingController.override) {
      return;
    }
    const { margin = 0, heatThreshold } = this.thresholds;
    const {
      temperature,
    } = this.currentConditionsManager.getCurrentTemperature();
    if (this.heatingController.isOn()) {
      if (temperature > heatThreshold + margin) {
        console.log("turning off heat");
        this.heatingController.turnOff();
      }
    } else if (temperature < heatThreshold) {
      console.log("turning on heat");
      this.heatingController.turnOn();
    }
  }

  handleCooling() {
    if (!this.coolingController || this.coolingController.override) {
      return;
    }
    const { margin = 0, coolingThreshold } = this.thresholds;
    const {
      temperature,
    } = this.currentConditionsManager.getCurrentTemperature();
    if (this.coolingController.isOn()) {
      if (temperature < coolingThreshold - margin) {
        console.log("turning off AC");
        this.coolingController.turnOff();
      }
    } else if (temperature > coolingThreshold) {
      console.log("turning on AC");
      this.coolingController.turnOn();
    }
  }

  performCheck() {
    try {
      this.handleHeating();
    } catch (err) {
      console.error("Error processing heating", err);
    }
    try {
      this.handleCooling();
    } catch (err) {
      console.error("Error processing cooling", err);
    }
  }

  overrideHeat(on) {
    if (this.heatingController) {
      this.heatingController.override = true;
      if (on) {
        this.heatingController.turnOn();
      } else {
        this.heatingController.turnOff();
      }
    }
  }

  overrideCooling(on) {
    if (this.coolingController) {
      this.coolingController.override = true;
      if (on) {
        this.coolingController.turnOn();
      } else {
        this.coolingController.turnOff();
      }
    }
  }

  disableHeatingOverride() {
    if (this.heatingController) {
      this.heatingController.override = false;
    }
  }

  disableCoolingOverride() {
    if (this.coolingController) {
      this.coolingController.override = false;
    }
  }
}

module.exports = HeatingService;
