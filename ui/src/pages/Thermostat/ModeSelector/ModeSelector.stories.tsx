import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ModeSelector, { ThermostatMode } from './ModeSelector';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof ModeSelector> = {
  title: 'Thermostat/ModeSelector',
  component: ModeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A mode selector component for thermostats with Auto, Heat, Cool, and Off modes.',
      },
    },
  },
  argTypes: {
    selectedMode: {
      control: {
        type: 'select',
        options: [
          ThermostatMode.AUTO,
          ThermostatMode.HEAT,
          ThermostatMode.COOL,
          ThermostatMode.OFF,
        ],
      },
      description: 'Currently selected thermostat mode',
    },
    onModeChange: {
      action: 'mode changed',
      description: 'Callback fired when mode is changed',
    },
  },
  args: {
    onModeChange: action('mode-changed'),
  },
};

export default meta;
type Story = StoryObj<typeof ModeSelector>;

export const Auto: Story = {
  args: {
    selectedMode: ThermostatMode.AUTO,
  },
};

export const Heat: Story = {
  args: {
    selectedMode: ThermostatMode.HEAT,
  },
};

export const Cool: Story = {
  args: {
    selectedMode: ThermostatMode.COOL,
  },
};

export const Off: Story = {
  args: {
    selectedMode: ThermostatMode.OFF,
  },
};

export const Interactive: Story = {
  args: {
    selectedMode: ThermostatMode.AUTO,
  },
  render: (args) => {
    const [selectedMode, setSelectedMode] = React.useState<ThermostatMode>(args.selectedMode);

    const handleModeChange = (mode: ThermostatMode) => {
      setSelectedMode(mode);
      args.onModeChange(mode);
    };

    return <ModeSelector {...args} selectedMode={selectedMode} onModeChange={handleModeChange} />;
  },
};

export const WithCustomStyling: Story = {
  args: {
    selectedMode: ThermostatMode.HEAT,
    className: 'custom-mode-selector',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
};
