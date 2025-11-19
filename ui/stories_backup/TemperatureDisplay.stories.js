import React from 'react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';

import TemperatureDisplay from '../../src/components/TemperatureDisplay/TemperatureDisplay';

export default {
  title: 'components/TemperatureDisplay',
  decorators: [withKnobs],
};

export const Main = (args) => (
  <TemperatureDisplay
    temperature={number('temperature', 68)}
    humidity={number('humidity', 33)}
    unit={select('unit', ['F', 'C', 'K'], 'F')}
  />
);
