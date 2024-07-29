import { useState, useEffect } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { platform } from "@tauri-apps/plugin-os";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [platformName, setPlatform] = useState("browser");

  useEffect(() => {
    (async () => {
      try {
        const platformName = await platform();
        setPlatform(platformName);
      }
      catch (_) { }
    })();
  }, [platform]);

  return <SettingsContext.Provider value={{ platform: platformName, setPlatform }}>
    {children}
  </SettingsContext.Provider>
}