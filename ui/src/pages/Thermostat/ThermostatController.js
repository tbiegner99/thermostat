import React from 'react';
import { connect } from 'react-redux';
import { Temperature } from '../../util/constants/Units';
import Thermostat from './Thermostat';
import ThermostatActionCreator from '../../actionCreators/ThermostatActionCreator';

class ThermostatController extends React.Component {
  constructor(props) {
    super(props);
    this.loadStatus = this.loadStatus.bind(this);
  }

  async componentDidMount() {
    this.currentConditionsInterval = setInterval(this.loadConditions, 5000);
    this.statusInterval = setInterval(this.loadStatus, 2000);
    this.loadStatus();
    this.loadConditions();
    this.loadThresholds();
  }

  componentWillUnmount() {
    clearInterval(this.currentConditionsInterval);
    clearInterval(this.statusInterval);
  }

  async loadThresholds() {
    try {
      const thresholds = await ThermostatActionCreator.getThresholds();
      if (
        Number.isNaN(thresholds.heatingThreshold.value) ||
        Number.isNaN(thresholds.coolingThreshold.value)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.loadThresholds();
      }
    } catch (err) {}
  }

  async loadConditions() {
    try {
      await ThermostatActionCreator.getCurrentConditions();
    } catch (err) {}
  }

  async loadStatus() {
    try {
      await ThermostatActionCreator.getSystemStatus();
    } catch (err) {}
  }

  render() {
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
    } = this.props;
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
  }
}

const mapEventsToProps = () => ({
  onHeatingThresholdChange: (newTemp) => {
    return ThermostatActionCreator.updateHeatingThreshold(newTemp);
  },
  onCoolingThresholdChange: (newTemp) => {
    return ThermostatActionCreator.updateCoolingThreshold(newTemp);
  },
  onCoolingOverride(overrideEnabled) {
    return ThermostatActionCreator.overrideCooling(overrideEnabled);
  },
  onHeatingOverride(overrideEnabled) {
    return ThermostatActionCreator.overrideHeating(overrideEnabled);
  },
});

const mapStateToProps = (state) => {
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
