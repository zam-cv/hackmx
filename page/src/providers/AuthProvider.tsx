import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { NavigateFunction } from "react-router-dom";
import api from "../utils/api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInformation, setUserInformation] = useState({ username: "...", email: "..." });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.auth
        .verify()
        .then(() => {
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  function signout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  function signin(email: string, password: string, navigate: NavigateFunction) {
    setIsLoading(true);

    api.auth
      .signin(email, password)
      .then((data) => {
        setUserInformation(data.user_information);
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        setIsLoading(false);
        navigate("/home");
      })
      .catch((error) => {
        setIsLoading(false);
        setIsAuthenticated(false);
        console.error(error);
      });
  }

  return <AuthContext.Provider value={{ isLoading, isAuthenticated, signout, signin, userInformation }}>
    {children}
  </AuthContext.Provider>;
}