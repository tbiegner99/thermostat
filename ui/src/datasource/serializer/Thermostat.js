import { Temperature } from '../../util/constants/Units';
const mapUnit = (tempUnit) => {
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

const format = (number) => {
  if (number) {
    return number.toFixed(1);
  }
  return number;
};

const fromSystemComponent = (data) => {
  if (!data) return null;
  return {
    on: data.on,
    overrideEnabled: data.overrideEnabled,
  };
};

const fromSystemStatusResponse = (response) => ({
  heating: fromSystemComponent(response.data.heating),
  cooling: fromSystemComponent(response.data.cooling),
});

const fromCurrentConditionsResponse = (response) => {
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

const fromThresholdsResponse = (response) => {
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

const toUpdateCoolingThresholdRequest = (threshold) => ({
  coolingThreshold: threshold,
});

const toUpdateHeatingThresholdRequest = (threshold) => ({
  heatThreshold: threshold,
});

export default {
  fromSystemStatusResponse,
  fromCurrentConditionsResponse,
  fromThresholdsResponse,
  toUpdateCoolingThresholdRequest,
  toUpdateHeatingThresholdRequest,
};
