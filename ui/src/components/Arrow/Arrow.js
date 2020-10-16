import React from 'react';
import fa from '@fortawesome/fontawesome-free/css/all.css';
import combineClasses from 'classnames';
import styles from './Arrow.css';
const Arrow = (props) => (
  <div
    {...props}
    className={combineClasses(fa.fas, fa['fa-caret-square-up'], props.className)}
  ></div>
);

const UpArrow = (props) => (
  <Arrow {...props} className={combineClasses(styles.up, props.className)} />
);

const DownArrow = (props) => (
  <Arrow {...props} className={combineClasses(styles.down, props.className)} />
);

const LeftArrow = (props) => (
  <Arrow {...props} className={combineClasses(styles.left, props.className)} />
);

const RightArrow = (props) => (
  <Arrow {...props} className={combineClasses(styles.right, props.className)} />
);

export { UpArrow, DownArrow, LeftArrow, RightArrow };
export default Arrow;
