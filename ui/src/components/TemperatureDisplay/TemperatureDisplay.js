import React from 'react';
import combineClasses from 'classnames';
import styles from './TemperatureDisplay.css';
import TemperatureConverter from '../../util/unitConverter/TemperatureConverter';

export default (props) => {
  const temperature = new TemperatureConverter(props.temperature, props.unit).toUnit(
    props.displayUnit
  );
  return (
    <div className={combineClasses(styles.temperatureDisplay, props.className)}>
      <section className={styles.temperature}>
        {temperature.toFixed(1)}&deg;&nbsp;{props.displayUnit}
      </section>
      <section className={styles.humidity}>{props.humidity}&nbsp;%</section>
    </div>
  );
};
