import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LayoutSystem from "./components/LayoutSystem";
import "./App.css";

// security
import Protected from "./components/Protected";
import Unprotected from "./components/Unprotected";

// providers
import SettingsProvider from "./providers/SettingsProvider";
import AuthProvider from "./providers/AuthProvider";

// pages
import Login from "./pages/Login";
import Storage from "./pages/events/Storage";

import Events from "./pages/Events";
import Event from "./pages/Event";
import Dashboard from "./pages/events/Dashboard";
import Users from "./pages/events/Users";
import Publications from "./pages/events/Publications";
import Sponsors from "./pages/events/Sponsors";
import UniversitiesEvent from "./pages/events/Universities";
import Scheduling from "./pages/events/Scheduling";
import FQA from "./pages/events/FQA";
import More from "./pages/events/More";

import Universities from "./pages/storage/Universities";
import SponsorsStorage from "./pages/storage/Sponsors";

function App() {
  return (
    <SettingsProvider>
      <LayoutSystem>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
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

                <Route
                  path="/storage"
                  element={
                    <Protected>
                      <Storage />
                    </Protected>
                  }
                />

                {/* Events */}
                <Route
                  path="/events"
                  element={
                    <Protected>
                      <Events />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id"
                  element={
                    <Protected>
                      <Event />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/dashboard"
                  element={
                    <Protected>
                      <Dashboard />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/users"
                  element={
                    <Protected>
                      <Users />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/publications"
                  element={
                    <Protected>
                      <Publications />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/fqa"
                  element={
                    <Protected>
                      <FQA />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/sponsors"
                  element={
                    <Protected>
                      <Sponsors />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/universities"
                  element={
                    <Protected>
                      <UniversitiesEvent />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/scheduling"
                  element={
                    <Protected>
                      <Scheduling />
                    </Protected>
                  }
                />
                <Route
                  path="/events/:id/more"
                  element={
                    <Protected>
                      <More />
                    </Protected>
                  }
                />

                {/* Storage */}
                <Route
                  path="/storage/universities"
                  element={
                    <Protected>
                      <Universities />
                    </Protected>
                  }
                />
                <Route
                  path="/storage/sponsors"
                  element={
                    <Protected>
                      <SponsorsStorage />
                    </Protected>
                  }
                />
              </Route>

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LayoutSystem>
    </SettingsProvider >
  );
}

export default App;
