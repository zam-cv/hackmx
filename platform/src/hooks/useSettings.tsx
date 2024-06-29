import { useContext } from "react";
import { SettingsContext, SettingsContextType } from "../contexts/SettingsContext";

export default function useSettings(): SettingsContextType {
  return useContext(SettingsContext)
}