import React from 'react';
import { Temperature } from '../../util/constants/Units';
import { HeatingLimits, CoolingLimits } from '../../util/constants/TemperatureLimits';
import styles from './Thermostat.module.css';
import TemperatureDisplay from '../../components/TemperatureDisplay/TemperatureDisplay';
import TemperatureControlPanel from './TemperatureControlPanel/TemperatureControlPanel';
import { T } from 'react-router/dist/production/fog-of-war-CbNQuoo8';
import TemperatureSliderPanel from './TemperatureSliderPanel';
import { ModeSelectorController } from './ModeSelector/ModeSelectorController';
import ModeSelector, { ThermostatMode } from './ModeSelector';

export interface ThermostatProps {
  zoneName: string;
  temperature: number;
  humidity: number;
  unit: string;
  isHeatOn: boolean;
  isCoolingOn: boolean;
  displayUnit: string;
  isHeatingSystemEnabled: boolean;
  isCoolingSystemEnabled: boolean;
  isHeatingOverrideEnabled: boolean;
  isCoolingOverrideEnabled: boolean;
  heatingThreshold: number;
  coolingThreshold: number;
  mode: ThermostatMode; // 'auto', 'heat', 'cool', 'off'

  onHeatingThresholdChange: (temperature: number) => void;
  onCoolingThresholdChange: (temperature: number) => void;
  onHeatingOverride: (enabled: boolean) => void;
  onCoolingOverride: (enabled: boolean) => void;
  onModeChange: (mode: ThermostatMode) => void;
}
export const OldTemperatureDisplay = (props: ThermostatProps) => {
  return (
    <section className={styles.mainContent}>
      <TemperatureDisplay
        className={styles.temperature}
        temperature={props.temperature}
        humidity={props.humidity}
        unit={Temperature.CELCIUS}
        isHeatOn={props.isHeatOn}
        isCoolingOn={props.isCoolingOn}
        displayUnit={props.displayUnit}
      />
      <div>
        <section className={styles.controlHeaders}>
          <div />
          <div className={styles.controlHeader}>Control</div>
          <div className={styles.controlHeader}>Override</div>
        </section>

        <section className={styles.controls}>
          {props.isHeatingSystemEnabled && (
            <TemperatureControlPanel
              override={props.isHeatingOverrideEnabled}
              onThresholdChange={props.onHeatingThresholdChange}
              temperature={props.heatingThreshold}
              unit={Temperature.CELCIUS}
              title="Heating"
              maxTemperature={HeatingLimits.max}
              minTemperature={HeatingLimits.min}
              displayUnit={props.displayUnit}
              onOverrideToggle={props.onHeatingOverride}
            />
          )}

          {props.isCoolingSystemEnabled && (
            <TemperatureControlPanel
              override={props.isCoolingOverrideEnabled}
              temperature={props.coolingThreshold}
              title="Cooling"
              onThresholdChange={props.onCoolingThresholdChange}
              unit={Temperature.CELCIUS}
              maxTemperature={CoolingLimits.max}
              minTemperature={CoolingLimits.min}
              displayUnit={props.displayUnit}
              onOverrideToggle={props.onCoolingOverride}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export const NewTemperatureDisplay = (props: ThermostatProps) => {
  return (
    <section>
      <TemperatureSliderPanel
        currentTemperature={props.temperature}
        heatingThreshold={props.heatingThreshold}
        coolingThreshold={props.coolingThreshold}
        currentHumidity={props.humidity}
        minTemperature={HeatingLimits.min}
        maxTemperature={CoolingLimits.max}
        unit={Temperature.CELCIUS}
        displayUnit={props.displayUnit}
        isHeatOn={props.isHeatOn}
        isCoolingOn={props.isCoolingOn}
        onHeatingThresholdChange={props.onHeatingThresholdChange}
        onCoolingThresholdChange={props.onCoolingThresholdChange}
      />
      <ModeSelector selectedMode={props.mode} onModeChange={props.onModeChange} />
    </section>
  );
};
export default (props: ThermostatProps) => {
  return (
    <section className={styles.page}>
      <section className={styles.heading}>{props.zoneName}</section>
      <NewTemperatureDisplay {...props} />
    </section>
  );
};
