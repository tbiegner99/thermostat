import React from 'react';
import combineClasses from 'classnames';
import { UpArrow, DownArrow } from '../Arrow/Arrow';

import styles from './TemperatureSelect.css';

const ifNotNumber = (number, defaultVal) =>
  typeof number === 'number' && !Number.isNaN(number) ? number : defaultVal;

export default (props) => {
  const isAtMinTemperature = props.temperature === props.minTemperature;
  const isAtMaxTemperature = props.temperature === props.maxTemperature;
  const fireChangeEvent = (newTemp) => {
    const minTemperature = ifNotNumber(props.minTemperature, Number.MIN_SAFE_INTEGER);
    const maxTemperature = ifNotNumber(props.maxTemperature, Number.MAX_SAFE_INTEGER);

    if (
      typeof props.onChange === 'function' &&
      !props.disabled &&
      newTemp >= minTemperature &&
      newTemp <= maxTemperature
    ) {
      console.log('firing on change');
      props.onChange(newTemp);
    }
  };
  return (
    <div {...props} className={combineClasses(styles.temperatureSelect, props.className)}>
      <div
        className={combineClasses(styles.arrow, {
          [styles.disabled]: isAtMaxTemperature || props.disabled,
        })}
      >
        <UpArrow onClick={() => fireChangeEvent(props.temperature + 1)} />
      </div>
      <div
        className={combineClasses(styles.temperatureText, { [styles.disabled]: props.disabled })}
      >
        {props.temperature}
      </div>
      <div
        className={combineClasses(styles.arrow, {
          [styles.disabled]: isAtMinTemperature || props.disabled,
        })}
      >
        <DownArrow onClick={() => fireChangeEvent(props.temperature - 1)} />
      </div>
    </div>
  );
};
