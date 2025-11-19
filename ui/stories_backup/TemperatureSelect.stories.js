import React from 'react';

import TemperatureSelect from '../../src/components/TemperatureSelect/TemperatureSelect';

export default {
  title: 'components/TemperatureSelect',
  component: TemperatureSelect,
};

export const Main = () => (
  <TemperatureSelect temperature={78} minTemperature={70} maxTemperature={78} />
);
