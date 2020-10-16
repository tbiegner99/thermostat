import React from 'react';
import fa from '@fortawesome/fontawesome-free/css/all.css';
import combineClasses from 'classnames';

const createIconComponent = (...classes) => (props) => (
  <i {...props} className={combineClasses(...classes, props.className)} />
);
let Arrow = createIconComponent(fa.fas, fa['fa-caret-square-up']);
let Fire = createIconComponent(fa.fas, fa['fa-fire']);
let Snow = createIconComponent(fa.fas, fa['fa-snowflake']);
export { Arrow, Fire, Snow };
