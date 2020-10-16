import React from 'react';

import Arrow, { UpArrow, DownArrow, LeftArrow, RightArrow } from '../../src/components/Arrow/Arrow';

export default {
  title: 'components/Arrow',
  component: Arrow,
};

export const Up = (args) => <UpArrow {...args} />;
export const Down = (args) => <DownArrow {...args} />;
export const Left = (args) => <LeftArrow {...args} />;
export const Right = (args) => <RightArrow {...args} />;
