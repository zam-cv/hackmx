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
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route
              index
              path="/"
              element={
                <Unprotected>
                  <Login />
                </Unprotected>
              }
            />

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

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
