import React from 'react';
import combineClasses from 'classnames';
import styles from './ToggleButton.module.css';

interface ToggleButtonProps {
  on: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (on: boolean) => void;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const fireChange = () => {
    const { disabled, onChange, on } = props;
    if (!disabled && typeof onChange === 'function') {
      onChange(!on);
    }
  };

  const { disabled, className, on } = props;
  const text = on ? 'On' : 'Off';

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={combineClasses(styles.toggleButton, className, {
        [styles.on]: on,
        [styles.disabled]: disabled,
      })}
      onClick={fireChange}
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
};

export default ToggleButton;
