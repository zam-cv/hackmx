import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";

// security
import Protected from "./components/Protected";
import Unprotected from "./components/Unprotected";

// providers
import SettingsProvider from "./providers/SettingsProvider";
import AuthProvider from "./providers/AuthProvider";

// pages
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route
              index
              path="/"
              element={
                <Unprotected>
                  <LandingPage />
                </Unprotected>
              }
            />

            {/* Internal */}
            <Route path="/" element={<Layout />}>
              <Route
                path="/home"
                element={
                  <Protected>
                    <Home />
                  </Protected>
                }
              />
            </Route>

            {/* Login */}
            <Route
              path="/login"
              element={
                <Unprotected>
                  <Login />
                </Unprotected>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
