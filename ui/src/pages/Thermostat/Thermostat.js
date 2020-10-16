import React from 'react';
import { Temperature } from '../../util/constants/Units';
import { HeatingLimits, CoolingLimits } from '../../util/constants/TemperatureLimits';
import styles from './Thermostat.css';
import TemperatureDisplay from '../../components/TemperatureDisplay/TemperatureDisplay';
import TemperatureControlPanel from './TemperatureControlPanel/TemperatureControlPanel';

export default (props) => {
  return (
    <section className={styles.page}>
      <section className={styles.heading}>{props.zoneName}</section>
      <section className={styles.mainContent}>
        <TemperatureDisplay
          className={styles.temperature}
          temperature={props.temperature}
          humidity={props.humidity}
          unit={props.unit}
          displayUnit={props.displayUnit}
        />
        <div>
          <section className={styles.controlHeaders}>
            <div></div>
            <div className={styles.controlHeader}>Control</div>
            <div className={styles.controlHeader}>Override</div>
          </section>
          <section className={styles.controls}>
            {props.heatingSystemStatus && (
              <TemperatureControlPanel
                override={props.heatingOverride}
                onOverride={props.onHeatingOverrideChange}
                onThresholdChange={props.onHeatingThresholdChange}
                temperature={props.heatingThreshold}
                unit={Temperature.CELCIUS}
                title="Heating"
                maxTemperature={HeatingLimits.max}
                minTemperature={HeatingLimits.min}
                displayUnit={props.displayUnit}
                onOverrideToggle={props.onHeatingOverride}
                override={props.heatingSystemStatus.overrideEnabled}
              />
            )}

            {props.coolingSystemStatus && (
              <TemperatureControlPanel
                override={props.coolingOverride}
                temperature={props.coolingThreshold}
                title="Cooling"
                onOverride={props.onCoolingOverrideChange}
                onThresholdChange={props.onCoolingThresholdChange}
                unit={Temperature.CELCIUS}
                maxTemperature={CoolingLimits.max}
                minTemperature={CoolingLimits.min}
                displayUnit={props.displayUnit}
                onOverrideToggle={props.onCoolingOverride}
                override={props.coolingSystemStatus.overrideEnabled}
              />
            )}
          </section>
        </div>
      </section>
    </section>
  );
};
