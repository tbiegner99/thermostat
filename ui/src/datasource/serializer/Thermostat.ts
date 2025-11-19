import { C } from 'react-router/dist/production/fog-of-war-CbNQuoo8';
import { Temperature } from '../../util/constants/Units';
import {
  RawSystemStatusResponse,
  RawCurrentConditionsResponse,
  RawThresholdsResponse,
  RawSystemComponentData,
  SystemComponent,
  SystemStatus,
  CurrentConditions,
  Thresholds,
  UpdateThresholdRequest,
} from '../models';

const mapUnit = (tempUnit: string): string => {
  switch (tempUnit) {
    case 'F':
      return Temperature.FARENHEIT;
    case 'K':
      return Temperature.KELVIN;
    case 'C':
      return Temperature.CELCIUS;
    default:
      throw new Error(`Unexpected temperature unit received: ${tempUnit}`);
  }
};

const format = (number: number): string | number => {
  if (number) {
    return number.toFixed(1);
  }
  return number;
};

const fromSystemComponent = (data: RawSystemComponentData | null): SystemComponent | null => {
  if (!data) return null;
  return {
    on: data.on,
    overrideEnabled: data.overrideEnabled,
  };
};

const fromSystemStatusResponse = (response: RawSystemStatusResponse): SystemStatus => ({
  heating: fromSystemComponent(response.data.heating),
  cooling: fromSystemComponent(response.data.cooling),
  mode: response.data.thresholds.mode,
  thresholds: {
    heatingThreshold: {
      value: response.data.thresholds.heatThreshold,
      unit: Temperature.CELCIUS,
    },
    coolingThreshold: {
      value: response.data.thresholds.coolingThreshold,
      unit: Temperature.CELCIUS,
    },
  },
});

const fromCurrentConditionsResponse = (
  response: RawCurrentConditionsResponse
): CurrentConditions => {
  const { humidity, temperature, zoneName, zoneDescription } = response.data;
  return {
    zoneName,
    zoneDescription,
    humidity: {
      value: format(humidity.value),
      unit: '%',
    },
    temperature: {
      value: format(temperature.value),
      unit: mapUnit(temperature.unit),
    },
  };
};

const fromThresholdsResponse = (response: RawThresholdsResponse): Thresholds => {
  const { heatThreshold, coolingThreshold } = response.data;
  return {
    heatingThreshold: {
      value: heatThreshold,
      unit: Temperature.CELCIUS,
    },
    coolingThreshold: {
      value: coolingThreshold,
      unit: Temperature.CELCIUS,
    },
  };
};

const toUpdateCoolingThresholdRequest = (threshold: number): UpdateThresholdRequest => ({
  coolingThreshold: threshold,
});

const toUpdateHeatingThresholdRequest = (threshold: number): UpdateThresholdRequest => ({
  heatThreshold: threshold,
});

const toSetModeRequest = (mode: string) => ({
  mode,
});

export default {
  fromSystemStatusResponse,
  fromCurrentConditionsResponse,
  fromThresholdsResponse,
  toUpdateCoolingThresholdRequest,
  toUpdateHeatingThresholdRequest,
  toSetModeRequest,
};
