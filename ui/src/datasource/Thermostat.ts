import serializer from './serializer/Thermostat';
import httpClient from '../util/HttpClient';

const THRESHOLDS_URL = '/api/thresholds';
const SYSTEM_URL = '/api/system';

class ThermostatDatasource {
  async getCurrentConditions() {
    const CURRENT_CONDITIONS_URL = '/api/currentConditions';
    const response = await httpClient.get(CURRENT_CONDITIONS_URL);
    return serializer.fromCurrentConditionsResponse(response);
  }

  async getThresholds() {
    const response = await httpClient.get(THRESHOLDS_URL);
    return serializer.fromThresholdsResponse(response);
  }

  async updateHeatingThreshold(threshold: number) {
    const request = serializer.toUpdateHeatingThresholdRequest(threshold);
    const response = await httpClient.put(`${THRESHOLDS_URL}/heating`, request);
    return serializer.fromThresholdsResponse(response);
  }

  async updateCoolingThreshold(threshold: number) {
    const request = serializer.toUpdateCoolingThresholdRequest(threshold);
    const response = await httpClient.put(`${THRESHOLDS_URL}/cooling`, request);
    return serializer.fromThresholdsResponse(response);
  }

  async getSystemStatus() {
    const response = await httpClient.get(SYSTEM_URL);
    return serializer.fromSystemStatusResponse(response);
  }
  async controlOverride(system: string, enabled: boolean) {
    const func = enabled ? 'on' : 'off';
    const response = await httpClient.put(`${SYSTEM_URL}/${system}/override/${func}`);
    return serializer.fromSystemStatusResponse(response);
  }

  overrideHeating() {
    return this.controlOverride('heating', true);
  }

  overrideCooling() {
    return this.controlOverride('cooling', true);
  }

  disableHeatingOverride() {
    return this.controlOverride('heating', false);
  }

  disableCoolingOverride() {
    return this.controlOverride('cooling', false);
  }
}

export default new ThermostatDatasource();
