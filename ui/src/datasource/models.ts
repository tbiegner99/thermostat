import { ThermostatMode } from '../pages/Thermostat/ModeSelector';

// Raw API response interfaces
export interface RawTemperatureData {
  value: number;
  unit: string;
}

export interface RawHumidityData {
  value: number;
}

export interface RawSystemComponentData {
  on: boolean;
  overrideEnabled: boolean;
}

export interface RawSystemStatusResponse {
  data: {
    heating: RawSystemComponentData;
    cooling: RawSystemComponentData;
    thresholds: {
      mode: ThermostatMode;
    };
  };
}

export interface RawCurrentConditionsResponse {
  data: {
    humidity: RawHumidityData;
    temperature: RawTemperatureData;
    zoneName: string;
    zoneDescription: string;
  };
}

export interface RawThresholdsResponse {
  data: {
    heatThreshold: number;
    coolingThreshold: number;
  };
}

// Formatted output interfaces
export interface SystemComponent {
  on: boolean;
  overrideEnabled: boolean;
}

export interface FormattedTemperature {
  value: string | number;
  unit: string; // Changed from Temperature to string since Temperature values are strings
}

export interface FormattedHumidity {
  value: string | number;
  unit: string;
}

export interface SystemStatus {
  heating: SystemComponent | null;
  cooling: SystemComponent | null;
  mode: ThermostatMode;
}

export interface CurrentConditions {
  zoneName: string;
  zoneDescription: string;
  humidity: FormattedHumidity;
  temperature: FormattedTemperature;
}

export interface Thresholds {
  heatingThreshold: FormattedTemperature;
  coolingThreshold: FormattedTemperature;
}

export interface UpdateThresholdRequest {
  coolingThreshold?: number;
  heatThreshold?: number;
}
