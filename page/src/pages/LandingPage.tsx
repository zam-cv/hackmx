import React, {useContext} from 'react';
import Timer from '../components/Timer';
import {SettingsContext} from '../contexts/SettingsContext';
import ThemeSwitch from '../components/ThemeSwitch';
import "../App.css";

export default function LandingPage() {
  const {theme} = useContext(SettingsContext);
  return (
    <div className={theme}>
      <h1>Landing Page</h1>
      
      <Timer targetDate="2024-10-15T00:00:00" />

      <ThemeSwitch />

      <footer>Tecnologico de Monterrey 2024</footer>
    </div>
  );
}