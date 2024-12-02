import React from 'react';
import { connect } from 'react-redux';
import { Temperature } from '../../util/constants/Units';
import Thermostat, { ThermostatProps } from './Thermostat';
import ThermostatActionCreator from '../../actionCreators/ThermostatActionCreator';

interface ControllerProps extends Partial<ThermostatProps> {
  coolingSystemStatus: any;
  heatingSystemStatus: any;
}

const ThermostatController = (props: ControllerProps) => {
  const [statusInterval, setStatusInterval] = React.useState(null);
  const [currentConditionsInterval, setCurrnetConditionsInterval] = React.useState(null);
  const loadConditions = async () => {
    try {
      await ThermostatActionCreator.getCurrentConditions();
    } catch (err) {}
  };

  const loadStatus = async () => {
    try {
      await ThermostatActionCreator.getSystemStatus();
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

    const currentConditionsInterval = setInterval(loadConditions, 5000);
    const statusInterval = setInterval(loadStatus, 2000);
    setStatusInterval(statusInterval);
    setCurrnetConditionsInterval(currentConditionsInterval);
    return () => {
      clearInterval(currentConditionsInterval);
      clearInterval(statusInterval);
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
  return (
    <Thermostat
      onHeatingThresholdChange={onHeatingThresholdChange}
      onCoolingThresholdChange={onCoolingThresholdChange}
      onCoolingOverride={onCoolingOverride}
      onHeatingOverride={onHeatingOverride}
      unit={unit}
      temperature={temperature}
      humidity={humidity}
      zoneName={zoneName}
      coolingThreshold={coolingThreshold}
      heatingThreshold={heatingThreshold}
      displayUnit={displayUnit}
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
