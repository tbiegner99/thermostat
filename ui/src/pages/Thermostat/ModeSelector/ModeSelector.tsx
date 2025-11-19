import React from 'react';
import { Chip, Box } from '@mui/material';
import { AutoAwesome, LocalFireDepartment, AcUnit, PowerSettingsNew } from '@mui/icons-material';
import styles from './ModeSelector.module.css';

export enum ThermostatMode {
  AUTO = 'auto',
  HEAT = 'heat',
  COOL = 'cool',
  OFF = 'off',
}

interface ModeSelectorProps {
  selectedMode: ThermostatMode;
  onModeChange: (mode: ThermostatMode) => void;
  className?: string;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange, className }) => {
  const modes: Array<{
    value: ThermostatMode;
    label: string;
    icon: React.ReactElement;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  }> = [
    {
      value: ThermostatMode.AUTO,
      label: 'Auto',
      icon: <AutoAwesome />,
      color: 'primary',
    },
    {
      value: ThermostatMode.HEAT,
      label: 'Heat',
      icon: <LocalFireDepartment />,
      color: 'error',
    },
    {
      value: ThermostatMode.COOL,
      label: 'Cool',
      icon: <AcUnit />,
      color: 'info',
    },
    {
      value: ThermostatMode.OFF,
      label: 'Off',
      icon: <PowerSettingsNew />,
      color: 'default',
    },
  ];

  return (
    <Box>
      <div className={styles.modeChips}>
        {modes.map((mode) => (
          <Chip
            key={mode.value}
            label={mode.label}
            icon={mode.icon}
            variant={selectedMode === mode.value ? 'filled' : 'outlined'}
            color={selectedMode === mode.value ? mode.color : 'default'}
            onClick={() => onModeChange(mode.value)}
            clickable
            className={`${styles.modeChip} ${
              selectedMode === mode.value ? styles.selectedChip : ''
            }`}
            size="medium"
          />
        ))}
      </div>
    </Box>
  );
};

export default ModeSelector;
