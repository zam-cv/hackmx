import { useState } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState("...");

  return <SettingsContext.Provider value={{ platform, setPlatform }}>
    {children}
  </SettingsContext.Provider>
}