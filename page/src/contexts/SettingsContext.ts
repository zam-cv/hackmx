import { createContext } from 'react';

export type SettingsContextType = {
  theme: string
  setTheme: (theme: string) => void
}

export const SettingsContext = createContext<SettingsContextType>({
  theme: 'light',
  setTheme: () => {}
})