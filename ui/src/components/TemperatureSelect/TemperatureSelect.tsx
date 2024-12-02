/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import combineClasses from 'classnames';
import { UpArrow, DownArrow } from '../Arrow/Arrow';

import styles from './TemperatureSelect.module.css';
import { Fab } from '@mui/material';

const ifNotNumber = (number: any, defaultVal: number) =>
  typeof number === 'number' && !Number.isNaN(number) ? number : defaultVal;

const getMaxTemperature = (maxTemp: number) => ifNotNumber(maxTemp, Number.MAX_SAFE_INTEGER);
const getMinTemperature = (minTemp: number) => ifNotNumber(minTemp, Number.MIN_SAFE_INTEGER);
const TemperatureSelect = (props: any) => {
  const fireChangeEvent = (newTemp: number) => {
    const { minTemperature: minTemp, maxTemperature: maxTemp, onChange, disabled } = props;
    const minTemperature = getMinTemperature(minTemp);
    const maxTemperature = getMaxTemperature(maxTemp);

    if (
      typeof onChange === 'function' &&
      !disabled &&
      newTemp >= minTemperature &&
      newTemp <= maxTemperature
    ) {
      console.log('firing on change');
      onChange(newTemp);
    }
  };

  const decreaseTemperature = () => {
    fireChangeEvent(props.temperature - 1);
  };

  const increaseTemperature = () => {
    fireChangeEvent(props.temperature + 1);
  };

  const {
    disabled,
    className,
    temperature,
    minTemperature: minTemp,
    maxTemperature: maxTemp,
    ...otherProps
  } = props;
  const minTemperature = getMinTemperature(minTemp);
  const maxTemperature = getMaxTemperature(maxTemp);

  const isAtMinTemperature = temperature === minTemperature;
  const isAtMaxTemperature = temperature === maxTemperature;

  return (
    <div {...otherProps} className={combineClasses(styles.temperatureSelect, className)}>
      <Fab size="small" disabled={isAtMaxTemperature || disabled} onClick={increaseTemperature}>
        <UpArrow />
      </Fab>
      <div className={combineClasses(styles.temperatureText, { [styles.disabled]: disabled })}>
        {temperature}
      </div>

      <Fab size="small" disabled={isAtMinTemperature || disabled} onClick={decreaseTemperature}>
        <DownArrow />
      </Fab>
    </div>
  );
};

export default TemperatureSelect;
