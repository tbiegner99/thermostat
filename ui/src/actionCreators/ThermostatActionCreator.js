import BaseActionCreator from './BaseActionCreator';
import ThermostatActions from '../actions/thermostat';
import ThermostatDatasource from '../datasource/Thermostat';

class ThermostatActionCreator extends BaseActionCreator {
  async getCurrentConditions() {
    const currentConditions = await ThermostatDatasource.getCurrentConditions();
    this.dispatch(
      this.createAction(ThermostatActions.CURRENT_CONDITIONS_LOADED, currentConditions)
    );
    return currentConditions;
  }

  async getThresholds() {
    const thresholds = await ThermostatDatasource.getThresholds();
    this.dispatch(this.createAction(ThermostatActions.THRESHOLDS_LOADED, thresholds));
    return thresholds;
  }

  async updateHeatingThreshold(heatingThreshold) {
    const thresholds = await ThermostatDatasource.updateHeatingThreshold(heatingThreshold);
    this.dispatch(this.createAction(ThermostatActions.THRESHOLDS_LOADED, thresholds));
    return thresholds;
  }

  async updateCoolingThreshold(coolingThreshold) {
    const thresholds = await ThermostatDatasource.updateCoolingThreshold(coolingThreshold);
    this.dispatch(this.createAction(ThermostatActions.THRESHOLDS_LOADED, thresholds));
    return thresholds;
  }

  async getSystemStatus() {
    const status = await ThermostatDatasource.getSystemStatus();
    this.dispatch(this.createAction(ThermostatActions.SYSTEM_STATUS_LOADED, status));
    this.dispatch(this.createAction(ThermostatActions.THRESHOLDS_LOADED, status.thresholds));
    return status;
  }

  async overrideCooling(enableOverride) {
    let status;
    if (enableOverride) {
      status = await ThermostatDatasource.overrideCooling();
    } else {
      status = await ThermostatDatasource.disableCoolingOverride();
    }
    this.dispatch(this.createAction(ThermostatActions.SYSTEM_STATUS_LOADED, status));
    return status;
  }

  async overrideHeating(enableOverride) {
    let status;
    if (enableOverride) {
      status = await ThermostatDatasource.overrideHeating();
    } else {
      status = await ThermostatDatasource.disableHeatingOverride();
    }
    this.dispatch(this.createAction(ThermostatActions.SYSTEM_STATUS_LOADED, status));
    return status;
  }
}

export default new ThermostatActionCreator();
