import React from 'react';
import styles from './ToggleButton.css';
import combineClasses from 'classnames';

export default (props) => {
  const text = props.on ? 'On' : 'Off';
  const fireChange = () => {
    if (!props.disabled && typeof props.onChange === 'function') {
      props.onChange(!props.on);
    }
  };
  return (
    <div
      className={combineClasses(styles.toggleButton, props.className, {
        [styles.on]: props.on,
        [styles.disabled]: props.disabled,
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
