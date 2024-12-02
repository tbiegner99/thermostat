import React from 'react';
import combineClasses from 'classnames';
import { Fire, Snow } from '../icons/Icons';

import styles from './TemperatureDisplay.module.css';
import TemperatureConverter from '../../util/unitConverter/TemperatureConverter';

const SystemStatus = (props: { on: boolean; children: React.ReactNode }) =>
  props.on ? <div className={styles.status}>{props.children}</div> : null;

interface TemperatureDisplayProps {
  temperature: number;
  humidity: number;
  unit: string;
  displayUnit: string;
  isHeatOn: boolean;
  isCoolingOn: boolean;
  className?: string;
}

export default (props: TemperatureDisplayProps) => {
  const temperature = new TemperatureConverter(props.temperature, props.unit).toUnit(
    props.displayUnit
  );
  return (
    <div className={combineClasses(styles.temperatureDisplay, props.className)}>
      <div className={styles.systemStatus}>
        <SystemStatus on={props.isHeatOn}>
          <Fire className={styles.statusIcon} />
        </SystemStatus>
        <SystemStatus on={props.isCoolingOn}>
          <Snow className={styles.statusIcon} />
        </SystemStatus>
      </div>
      <section className={styles.temperature}>
        {temperature.toFixed(1)}
        &deg;&nbsp;
        {props.displayUnit}
      </section>
      <section className={styles.humidity}>
        {props.humidity}
        &nbsp;%
      </section>
    </div>
  );
};
