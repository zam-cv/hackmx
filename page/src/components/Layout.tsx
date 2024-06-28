// import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import ThemeSwitch from './ThemeSwitch';
export default function Layout() {
  // const { isAuthenticated, isLoading } = useAuth();
  const isAuthenticated = true;
  const isLoading = false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full grid grid-rows-[auto_1fr] overflow-hidden">
      <div>{isAuthenticated ? <Header /> : <div></div>}</div>
      <div className="overflow-auto bg-background">
        <Outlet />
      </div>
      <div className="fixed bottom-4 right-4">
        <ThemeSwitch />
      </div>

    </div>
  );
}
