import React from 'react';
import combineClasses from 'classnames';
import styles from './styles.module.css';
import TemperatureConverter from '../../../util/unitConverter/TemperatureConverter';

import TemperatureSelect from '../../../components/TemperatureSelect/TemperatureSelect';
import ToggleButton from '../../../components/ToggleButton/ToggleButton';

const convertFrom = (temperature: number, unit: string, toUnit: string) =>
  new TemperatureConverter(temperature, unit).toUnit(toUnit);

interface ControlPanelProps {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  unit: string;
  className?: string;
  title: string;
  displayUnit: string;
  override: boolean;
  onOverrideToggle: (enabled: boolean) => void;
  onThresholdChange: (temperature: number) => void;
}

export const TemperatureControlPanel = (props: ControlPanelProps) => {
  const fireChangeEventWithConvertedTemperature = (newTemp: number) => {
    const { onThresholdChange, displayUnit, unit } = props;
    const convertedTemp = convertFrom(newTemp, displayUnit, unit);
    onThresholdChange(convertedTemp);
  };

  const {
    temperature: temp,
    minTemperature: minTemp,
    maxTemperature: maxTemp,
    unit,
    className,
    title,
    displayUnit,
    override,
    onOverrideToggle,
  } = props;
  const minTemperature = convertFrom(minTemp, unit, displayUnit);
  const maxTemperature = convertFrom(maxTemp, unit, displayUnit);
  const temperature = convertFrom(temp, unit, displayUnit);

  return (
    <section className={combineClasses(styles.controlPanel, className)}>
      <div className={styles.controlHeader}>{title}</div>
      <div>
        <TemperatureSelect
          temperature={Math.round(temperature)}
          onChange={fireChangeEventWithConvertedTemperature}
          minTemperature={Math.round(minTemperature)}
          maxTemperature={Math.round(maxTemperature)}
          disabled={override}
        />
      </div>
      <div>
        <ToggleButton on={override} onChange={onOverrideToggle} />
      </div>
    </section>
  );
};

export default TemperatureControlPanel;
