import { useEffect, useState } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <SettingsContext.Provider value={{ theme, setTheme }}>
    {children}
  </SettingsContext.Provider>
}