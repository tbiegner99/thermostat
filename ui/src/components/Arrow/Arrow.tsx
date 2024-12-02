/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import combineClasses from 'classnames';
import { Arrow } from '../icons/Icons';
import styles from './Arrow.module.css';

const UpArrow = (props: any) => (
  <Arrow {...props} className={combineClasses(styles.up, props.className)} />
);

const DownArrow = (props: any) => (
  <Arrow {...props} className={combineClasses(styles.down, props.className)} />
);

const LeftArrow = (props: any) => (
  <Arrow {...props} className={combineClasses(styles.left, props.className)} />
);

const RightArrow = (props: any) => (
  <Arrow {...props} className={combineClasses(styles.right, props.className)} />
);

export { UpArrow, DownArrow, LeftArrow, RightArrow };
export default Arrow;
