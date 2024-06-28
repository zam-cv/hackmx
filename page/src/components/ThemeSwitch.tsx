import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

function ThemeSwitch() {
  const { theme, setTheme } = useContext(SettingsContext);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    </button>
  );
}

export default ThemeSwitch;