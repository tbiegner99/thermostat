import React from 'react';
import combineClasses from 'classnames';
import styles from './ToggleButton.css';

class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.fireChange = this.fireChange.bind(this);
  }

  fireChange() {
    const { disabled, onChange, on } = this.props;
    if (!disabled && typeof onChange === 'function') {
      onChange(!on);
    }
  }

  render() {
    const { disabled, className, on } = this.props;
    const text = on ? 'On' : 'Off';

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={combineClasses(styles.toggleButton, className, {
          [styles.on]: on,
          [styles.disabled]: disabled,
        })}
        onClick={this.fireChange}
      >
        <div className={styles.bar}>
          <span className={styles.leftEnd} />
          <span className={styles.middle}>
            <div>{text}</div>
          </span>
          <span className={styles.rightEnd} />
        </div>
        <div className={styles.toggle} />
      </div>
    );
  }
}
export default ToggleButton;
