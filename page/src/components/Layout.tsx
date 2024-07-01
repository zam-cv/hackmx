import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";
import ThemeSwitch from "./ThemeSwitch";

export default function Layout() {
  const { isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <div className="h-full grid grid-rows-[auto_1fr] overflow-hidden">
      <div><Header /></div>
      <div className="overflow-auto bg-background">
        <Outlet />
      </div>
      <div><ThemeSwitch /></div>
    </div>
    
  );
}
