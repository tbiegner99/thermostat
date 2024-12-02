import AbstractReducingStore from './AbstractReducingStore';
import ThermostatActions from '../actions/thermostat';

class ThermostatStore extends AbstractReducingStore {
  constructor() {
    super();
    this.data = {};
  }
  get currentTemperature() {
    if (this.data.currentConditions) {
      return this.data.currentConditions.temperature;
    }
    return {};
  }

  get currentHumidity() {
    if (this.data.currentConditions) {
      return this.data.currentConditions.humidity;
    }
    return {};
  }
  get zoneName() {
    return this.data.zoneName;
  }

  get zoneDescription() {
    return this.data.zoneDescription;
  }

  get thresholds() {
    return this.data.thresholds;
  }

  get heatingThreshold() {
    if (this.data.thresholds) {
      return this.data.thresholds.heatingThreshold;
    }
    return {};
  }

  get coolingThreshold() {
    if (this.data.thresholds) {
      return this.data.thresholds.coolingThreshold;
    }
    return {};
  }

  get coolingSystemStatus() {
    return this.data.coolingSystemStatus;
  }

  get heatingSystemStatus() {
    return this.data.heatingSystemStatus;
  }

  handleEvent(action: { type: string; data: any }) {
    switch (action.type) {
      case ThermostatActions.CURRENT_CONDITIONS_LOADED:
        this.data.zoneName = action.data.zoneName;
        this.data.zoneDescription = action.data.zoneDescription;
        this.data.currentConditions = action.data;
        break;
      case ThermostatActions.THRESHOLDS_LOADED:
        this.data.thresholds = action.data;
        break;
      case ThermostatActions.SYSTEM_STATUS_LOADED:
        this.data.coolingSystemStatus = action.data.cooling;
        this.data.heatingSystemStatus = action.data.heating;
        break;
      default:
        return false;
    }
    return true;
  }
}

export default new ThermostatStore();
