import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TemperatureSliderPanel from '../src/pages/Thermostat/TemperatureSliderPanel/TemperatureSliderPanel';

export default {
  title: 'Thermostat/TemperatureSliderPanel',
  component: TemperatureSliderPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A circular dual slider control for thermostat temperature thresholds, similar to Home Assistant's interface.",
      },
    },
  },
  argTypes: {
    currentTemperature: {
      control: { type: 'range', min: 0, max: 40, step: 0.5 },
      description: 'Current room temperature',
    },
    heatingThreshold: {
      control: { type: 'range', min: 10, max: 30, step: 0.5 },
      description: 'Temperature at which heating turns on',
    },
    coolingThreshold: {
      control: { type: 'range', min: 20, max: 35, step: 0.5 },
      description: 'Temperature at which cooling turns on',
    },
    minTemperature: {
      control: { type: 'range', min: 5, max: 15, step: 1 },
      description: 'Minimum selectable temperature',
    },
    maxTemperature: {
      control: { type: 'range', min: 30, max: 40, step: 1 },
      description: 'Maximum selectable temperature',
    },
    unit: {
      control: { type: 'select', options: ['C', 'F'] },
      description: 'Internal temperature unit',
    },
    displayUnit: {
      control: { type: 'select', options: ['C', 'F'] },
      description: 'Display temperature unit',
    },
    onHeatingThresholdChange: { action: 'heating threshold changed' },
    onCoolingThresholdChange: { action: 'cooling threshold changed' },
  },
} as Meta<typeof TemperatureSliderPanel>;

const Template: StoryFn = (args: any) => <TemperatureSliderPanel {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentTemperature: 22.5,
  heatingThreshold: 20,
  coolingThreshold: 24,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};

export const WarmRoom = Template.bind({});
WarmRoom.args = {
  currentTemperature: 28,
  heatingThreshold: 20,
  coolingThreshold: 25,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};
WarmRoom.parameters = {
  docs: {
    description: {
      story:
        'Shows how the control looks when the current temperature is above the cooling threshold.',
    },
  },
};

export const ColdRoom = Template.bind({});
ColdRoom.args = {
  currentTemperature: 16,
  heatingThreshold: 20,
  coolingThreshold: 24,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};
ColdRoom.parameters = {
  docs: {
    description: {
      story:
        'Shows how the control looks when the current temperature is below the heating threshold.',
    },
  },
};

export const ComfortZone = Template.bind({});
ComfortZone.args = {
  currentTemperature: 22,
  heatingThreshold: 20,
  coolingThreshold: 24,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};
ComfortZone.parameters = {
  docs: {
    description: {
      story:
        'Shows how the control looks when the current temperature is in the comfort zone between thresholds.',
    },
  },
};

export const Fahrenheit = Template.bind({});
Fahrenheit.args = {
  currentTemperature: 72,
  heatingThreshold: 68,
  coolingThreshold: 75,
  minTemperature: 50,
  maxTemperature: 95,
  unit: 'F',
  displayUnit: 'F',
};
Fahrenheit.parameters = {
  docs: {
    description: {
      story: 'Example using Fahrenheit units instead of Celsius.',
    },
  },
};

export const WideRange = Template.bind({});
WideRange.args = {
  currentTemperature: 22,
  heatingThreshold: 15,
  coolingThreshold: 30,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};
WideRange.parameters = {
  docs: {
    description: {
      story: 'Example with a wide comfort zone between heating and cooling thresholds.',
    },
  },
};

export const NarrowRange = Template.bind({});
NarrowRange.args = {
  currentTemperature: 22,
  heatingThreshold: 21,
  coolingThreshold: 23,
  minTemperature: 10,
  maxTemperature: 35,
  unit: 'C',
  displayUnit: 'C',
};
NarrowRange.parameters = {
  docs: {
    description: {
      story: 'Example with a narrow comfort zone for precise temperature control.',
    },
  },
};
