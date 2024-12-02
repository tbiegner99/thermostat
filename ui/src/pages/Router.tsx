import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Thermostat from './Thermostat/ThermostatController';

export default () => (
  <Router>
    <main>
      <Routes>
        <Route path="/thermostat" element={<Thermostat />} />
        <Route path="*" element={<Navigate to="/thermostat" />} />
      </Routes>
    </main>
  </Router>
);
