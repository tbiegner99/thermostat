import { combineReducers } from 'redux';
import ApplicationStore from '../stores/ApplicationStore';
import ThermostatStore from '../stores/ThermostatStore';

export default combineReducers({
  application: ApplicationStore.reduce,
  thermostat: ThermostatStore.reduce,
});
