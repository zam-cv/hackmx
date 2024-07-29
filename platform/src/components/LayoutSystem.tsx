import { useContext } from "react";
import { SettingsContext } from "@/contexts/SettingsContext";
import Titlebar from "@/components/Titlebar";

export default function LayoutSystem({ children }: { children: React.ReactNode }) {
  const { platform } = useContext(SettingsContext);

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_auto_1fr] h-full">
      <div>{platform === "macos" && <Titlebar />}</div>
      {children}
    </div>
  );
}
