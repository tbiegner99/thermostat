import React from 'react';
import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';

import Thermostat from '../../src/pages/Thermostat/Thermostat';

export default {
  title: 'components/Thermostat',
  decorators: [withKnobs],
};

export const Main = (args) => (
  <Thermostat
    temperature={number('temperature', 68)}
    humidity={number('humidity', 33)}
    unit={select('unit', ['F', 'C', 'K'], 'F')}
    zoneName={text('zoneName', 'Living Room')}
    zoneDescription={text('zoneDescription', 'main living area')}
  />
);
