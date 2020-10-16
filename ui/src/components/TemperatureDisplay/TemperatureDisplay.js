import React from 'react';
import combineClasses from 'classnames';
import { Fire, Snow } from '../icons/Icons';

import styles from './TemperatureDisplay.css';
import TemperatureConverter from '../../util/unitConverter/TemperatureConverter';

const systemIsOn = (status) => status && status.on;

const SystemStatus = (props) =>
  systemIsOn(props.status) ? <div className={styles.status}>{props.children}</div> : null;

export default (props) => {
  const temperature = new TemperatureConverter(props.temperature, props.unit).toUnit(
    props.displayUnit
  );
  return (
    <div className={combineClasses(styles.temperatureDisplay, props.className)}>
      <div className={styles.systemStatus}>
        <SystemStatus status={props.heatingSystemStatus}>
          <Fire />
        </SystemStatus>
        <SystemStatus status={props.coolingSystemStatus}>
          <Snow />
        </SystemStatus>
      </div>
      <section className={styles.temperature}>
        {temperature.toFixed(1)}&deg;&nbsp;{props.displayUnit}
      </section>
      <section className={styles.humidity}>{props.humidity}&nbsp;%</section>
    </div>
  );
};
