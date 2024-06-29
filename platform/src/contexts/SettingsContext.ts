import { createContext } from 'react';

export type SettingsContextType = {
  platform: string;
  setPlatform: (platform: string) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  platform: '...',
  setPlatform: () => {}
})