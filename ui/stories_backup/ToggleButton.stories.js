import React from 'react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import ToggleButton from '../../src/components/ToggleButton/ToggleButton';

export default {
  title: 'components/ToggleButton',
  decorators: [withKnobs],
};

export const Main = (args) => (
  <ToggleButton on={boolean('on', false)} disabled={boolean('disabled', false)} />
);
