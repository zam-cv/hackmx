import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

function ThemeSwitch() {
  const { theme, setTheme } = useContext(SettingsContext);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
    onClick={toggleTheme}
    className = "px-4 py-2 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-950 transition-colors duration-300">
      {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    </button>
  );
}

export default ThemeSwitch;