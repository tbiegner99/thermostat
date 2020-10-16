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
    this.intervalId = setInterval(this.loadStatus, 5000);
    this.loadStatus();
    try {
      ThermostatActionCreator.getThresholds();
    } catch (err) {}
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  async loadStatus() {
    try {
      await ThermostatActionCreator.getCurrentConditions();
    } catch (err) {}
    try {
      await ThermostatActionCreator.getSystemStatus();
    } catch (err) {}
  }

  render() {
    return <Thermostat {...this.props} />;
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
