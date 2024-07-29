import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

export default function Layout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <>
        <div></div>
        <div className="overflow-hidden">
          <div className="overflow-auto h-full">
            <div className="flex items-center justify-center h-full">
              <Loading />
            </div>
          </div>
        </div>
      </>
    )
  };

  return (
    <>
      <div>
        {isAuthenticated ? <Header /> : null}
      </div>
      <div className="overflow-hidden">
        <div className="overflow-auto h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
