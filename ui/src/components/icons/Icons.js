import React from 'react';
import fa from '@fortawesome/fontawesome-free/css/all.min.css';
import combineClasses from 'classnames';

const createIconComponent = (...classes) => (props) => (
  <i {...props} className={combineClasses(...classes, props.className)} />
);
const Arrow = createIconComponent(fa.fas, fa['fa-caret-square-up']);
const Fire = createIconComponent(fa.fas, fa['fa-fire']);
const Snow = createIconComponent(fa.fas, fa['fa-snowflake']);
export { Arrow, Fire, Snow };
