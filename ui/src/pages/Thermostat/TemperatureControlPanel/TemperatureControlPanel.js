import React from 'react';
import combineClasses from 'classnames';
import styles from './styles.css';
import TemperatureConverter from '../../../util/unitConverter/TemperatureConverter';

import TemperatureSelect from '../../../components/TemperatureSelect/TemperatureSelect';
import ToggleButton from '../../../components/ToggleButton/ToggleButton';

const assertPropDiffers = (props, newProps, field) => {
  if (props[field] !== newProps[field]) {
    throw new Error('field doesnt match');
  }
};

const convertFrom = (temperature, unit, toUnit) =>
  new TemperatureConverter(temperature, unit).toUnit(toUnit);

class TemperatureControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.fireChangeEventWithConvertedTemperature = this.fireChangeEventWithConvertedTemperature.bind(
      this
    );
  }

  fireChangeEventWithConvertedTemperature(newTemp) {
    const { onThresholdChange, displayUnit, unit } = this.props;
    if (typeof onThresholdChange === 'function') {
      const convertedTemp = convertFrom(newTemp, displayUnit, unit);
      onThresholdChange(convertedTemp);
    }
  }

  shouldComponentUpdate(newProps) {
    try {
      assertPropDiffers(this.props, newProps, 'temperature');
      assertPropDiffers(this.props, newProps, 'minTemperature');
      assertPropDiffers(this.props, newProps, 'maxTemperature');
      assertPropDiffers(this.props, newProps, 'override');
      assertPropDiffers(this.props, newProps, 'unit');
      assertPropDiffers(this.props, newProps, 'displayUnit');
    } catch (err) {
      return true;
    }
    return false;
  }

  render() {
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
    } = this.props;
    const minTemperature = convertFrom(minTemp, unit, displayUnit);
    const maxTemperature = convertFrom(maxTemp, unit, displayUnit);
    const temperature = convertFrom(temp, unit, displayUnit);

    return (
      <section className={combineClasses(styles.controlPanel, className)}>
        <div className={styles.controlHeader}>{title}</div>
        <div>
          <TemperatureSelect
            temperature={Math.round(temperature)}
            onChange={this.fireChangeEventWithConvertedTemperature}
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
  }
}
export default TemperatureControlPanel;
