import React from 'react';
import styles from './styles.css';
import combineClasses from 'classnames';
import TemperatureConverter from '../../../util/unitConverter/TemperatureConverter';

import TemperatureSelect from '../../../components/TemperatureSelect/TemperatureSelect';
import ToggleButton from '../../../components/ToggleButton/ToggleButton';

const convertFrom = (temperature, unit, toUnit) =>
  new TemperatureConverter(temperature, unit).toUnit(toUnit);

export default (props) => {
  const minTemperature = convertFrom(props.minTemperature, props.unit, props.displayUnit);
  const maxTemperature = convertFrom(props.maxTemperature, props.unit, props.displayUnit);
  const temperature = convertFrom(props.temperature, props.unit, props.displayUnit);

  const fireChangeEventWithConvertedTemperature = (newTemp) => {
    if (typeof props.onThresholdChange === 'function') {
      const convertedTemp = convertFrom(newTemp, props.displayUnit, props.unit);
      props.onThresholdChange(convertedTemp);
    }
  };

  return (
    <section className={combineClasses(styles.controlPanel, props.className)}>
      <div className={styles.controlHeader}>{props.title}</div>
      <div>
        <TemperatureSelect
          temperature={Math.round(temperature)}
          onChange={fireChangeEventWithConvertedTemperature}
          minTemperature={Math.round(minTemperature)}
          maxTemperature={Math.round(maxTemperature)}
          disabled={props.override}
        />
      </div>
      <div>
        <ToggleButton on={props.override} onChange={props.onOverrideToggle} />
      </div>
    </section>
  );
};
