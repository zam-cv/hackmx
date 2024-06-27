import React, { createContext, useState} from 'react';
import { Children } from 'react';

const SettingsContext = createContext();

const SetttingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <SettingsContext.Provider value = {{isDarkMode, toggleTheme}}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SetttingsProvider, SettingsContext}