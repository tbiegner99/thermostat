import React from 'react';
import { connect } from 'react-redux';
import { Temperature } from '../../util/constants/Units';
import Thermostat, { ThermostatProps } from './Thermostat';
import ThermostatActionCreator from '../../actionCreators/ThermostatActionCreator';
import ThermostatDatasource from '../../datasource/Thermostat';
import { ThermostatMode } from './ModeSelector';
interface ControllerProps extends Partial<ThermostatProps> {
  coolingSystemStatus: any;
  heatingSystemStatus: any;
}

const ThermostatController = (props: ControllerProps) => {
  const statusInterval = React.useRef<NodeJS.Timeout | null>(null);
  const currentConditionsInterval = React.useRef<NodeJS.Timeout | null>(null);
  const loadConditions = async () => {
    try {
      await ThermostatActionCreator.getCurrentConditions();
    } catch (err) {}
  };
  const [currentMode, setCurrentMode] = React.useState<ThermostatMode>(ThermostatMode.AUTO);

  const onModeChanged = async (newMode: ThermostatMode) => {
    const lastMode = currentMode;
    try {
      setCurrentMode(newMode);
      await ThermostatDatasource.setMode(newMode);
    } catch (error) {
      console.error('Error setting mode:', error);
      setCurrentMode(lastMode);
    }
  };

  const loadStatus = async () => {
    try {
      const systemStatus = await ThermostatActionCreator.getSystemStatus();
      setCurrentMode(systemStatus.mode);
    } catch (err) {}
  };
  const loadThresholds = async () => {
    try {
      const thresholds = await ThermostatActionCreator.getThresholds();
      if (
        Number.isNaN(thresholds.heatingThreshold.value) ||
        Number.isNaN(thresholds.coolingThreshold.value)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await loadThresholds();
      }
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadThresholds();
    }
  };
  React.useEffect(() => {
    loadThresholds();
    loadStatus();
    loadConditions();

    const currentConditionsIntervalId = setInterval(loadConditions, 5000);
    const statusIntervalId = setInterval(loadStatus, 2000);
    statusInterval.current = statusIntervalId;
    currentConditionsInterval.current = currentConditionsIntervalId;
    return () => {
      if (currentConditionsInterval.current) {
        clearInterval(currentConditionsInterval.current);
      }
      if (statusInterval.current) {
        clearInterval(statusInterval.current);
      }
    };
  }, []);

  const {
    onHeatingThresholdChange,
    onCoolingThresholdChange,
    onCoolingOverride,
    onHeatingOverride,
    unit,
    temperature,
    humidity,
    zoneName,
    coolingThreshold,
    heatingThreshold,
    displayUnit,
    coolingSystemStatus,
    heatingSystemStatus,
  } = props;
  const noop = () => {};
  return (
    <Thermostat
      onHeatingThresholdChange={onHeatingThresholdChange || noop}
      onCoolingThresholdChange={onCoolingThresholdChange || noop}
      onCoolingOverride={onCoolingOverride || noop}
      onHeatingOverride={onHeatingOverride || noop}
      unit={unit || Temperature.CELCIUS}
      temperature={temperature || 0}
      mode={currentMode}
      onModeChange={onModeChanged}
      humidity={humidity || 0}
      zoneName={zoneName || ''}
      coolingThreshold={coolingThreshold || 0}
      heatingThreshold={heatingThreshold || 0}
      displayUnit={displayUnit || Temperature.FARENHEIT}
      isHeatingSystemEnabled={Boolean(coolingSystemStatus)}
      isCoolingSystemEnabled={Boolean(heatingSystemStatus)}
      isCoolingOverrideEnabled={coolingSystemStatus && coolingSystemStatus.overrideEnabled}
      isHeatingOverrideEnabled={heatingSystemStatus && heatingSystemStatus.overrideEnabled}
      isHeatOn={heatingSystemStatus && heatingSystemStatus.on}
      isCoolingOn={coolingSystemStatus && coolingSystemStatus.on}
    />
  );
};

const mapEventsToProps = () => ({
  onHeatingThresholdChange: (newTemp: number) => {
    return ThermostatActionCreator.updateHeatingThreshold(newTemp);
  },
  onCoolingThresholdChange: (newTemp: number) => {
    return ThermostatActionCreator.updateCoolingThreshold(newTemp);
  },
  onCoolingOverride(overrideEnabled: boolean) {
    return ThermostatActionCreator.overrideCooling(overrideEnabled);
  },
  onHeatingOverride(overrideEnabled: boolean) {
    return ThermostatActionCreator.overrideHeating(overrideEnabled);
  },
});

const mapStateToProps = (state: any) => {
  const thermostatStore = state.thermostat.store;
  return {
    unit: thermostatStore.currentTemperature.unit,
    temperature: thermostatStore.currentTemperature.value,
    humidity: thermostatStore.currentHumidity.value,
    zoneName: thermostatStore.zoneName,
    coolingThreshold: thermostatStore.coolingThreshold.value,
    heatingThreshold: thermostatStore.heatingThreshold.value,
    displayUnit: Temperature.FARENHEIT,
    coolingSystemStatus: thermostatStore.coolingSystemStatus,
    heatingSystemStatus: thermostatStore.heatingSystemStatus,
  };
};

export default connect(mapStateToProps, mapEventsToProps)(ThermostatController);
