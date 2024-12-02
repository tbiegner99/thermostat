import React from 'react';
import { Temperature } from '../../util/constants/Units';
import { HeatingLimits, CoolingLimits } from '../../util/constants/TemperatureLimits';
import styles from './Thermostat.module.css';
import TemperatureDisplay from '../../components/TemperatureDisplay/TemperatureDisplay';
import TemperatureControlPanel from './TemperatureControlPanel/TemperatureControlPanel';

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

  onHeatingThresholdChange: (temperature: number) => void;
  onCoolingThresholdChange: (temperature: number) => void;
  onHeatingOverride: (enabled: boolean) => void;
  onCoolingOverride: (enabled: boolean) => void;
}

export default (props: ThermostatProps) => {
  return (
    <section className={styles.page}>
      <section className={styles.heading}>{props.zoneName}</section>
      <section className={styles.mainContent}>
        <TemperatureDisplay
          className={styles.temperature}
          temperature={props.temperature}
          humidity={props.humidity}
          unit={props.unit}
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
    </section>
  );
};
