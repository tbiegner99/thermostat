/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import combineClasses from 'classnames';
import { UpArrow, DownArrow } from '../Arrow/Arrow';

import styles from './TemperatureSelect.css';

const ifNotNumber = (number, defaultVal) =>
  typeof number === 'number' && !Number.isNaN(number) ? number : defaultVal;

const getMaxTemperature = (maxTemp) => ifNotNumber(maxTemp, Number.MAX_SAFE_INTEGER);
const getMinTemperature = (minTemp) => ifNotNumber(minTemp, Number.MIN_SAFE_INTEGER);
class TemperatureSelect extends React.Component {
  constructor(props) {
    super(props);
    this.increaseTemperature = this.increaseTemperature.bind(this);
    this.decreaseTemperature = this.decreaseTemperature.bind(this);
  }

  fireChangeEvent(newTemp) {
    const { minTemperature: minTemp, maxTemperature: maxTemp, onChange, disabled } = this.props;
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
  }

  decreaseTemperature() {
    const { temperature } = this.props;
    this.fireChangeEvent(temperature - 1);
  }

  increaseTemperature() {
    const { temperature } = this.props;
    this.fireChangeEvent(temperature + 1);
  }

  render() {
    const {
      disabled,
      className,
      temperature,
      minTemperature: minTemp,
      maxTemperature: maxTemp,
      ...otherProps
    } = this.props;
    const minTemperature = getMinTemperature(minTemp);
    const maxTemperature = getMaxTemperature(maxTemp);

    const isAtMinTemperature = temperature === minTemperature;
    const isAtMaxTemperature = temperature === maxTemperature;

    return (
      <div {...otherProps} className={combineClasses(styles.temperatureSelect, className)}>
        <div
          className={combineClasses(styles.arrow, {
            [styles.disabled]: isAtMaxTemperature || disabled,
          })}
        >
          <UpArrow onClick={this.increaseTemperature} />
        </div>
        <div className={combineClasses(styles.temperatureText, { [styles.disabled]: disabled })}>
          {temperature}
        </div>
        <div
          className={combineClasses(styles.arrow, {
            [styles.disabled]: isAtMinTemperature || disabled,
          })}
        >
          <DownArrow onClick={this.decreaseTemperature} />
        </div>
      </div>
    );
  }
}

export default TemperatureSelect;
