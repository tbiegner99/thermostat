import React, { useEffect } from 'react';
import ModeSelector, { ThermostatMode } from './ModeSelector';
import ThermostatDatasource from '../../../datasource/Thermostat';
export const ModeSelectorController = ({ mode }: { mode: ThermostatMode }) => {
  const [currentMode, setCurrentMode] = React.useState<ThermostatMode>(mode);
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);
  const onModeChanged = async (newMode: ThermostatMode) => {
    const lastMode = currentMode;
    try {
      setCurrentMode(newMode);
      await ThermostatDatasource.setMode(newMode);
    } catch (error) {
      console.error('Error setting mode:', error);
      setCurrentMode(lastMode);
    }
  };
  return <ModeSelector selectedMode={mode} onModeChange={onModeChanged} />;
};
