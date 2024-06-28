import { BrowserRouter, Routes, Route } from "react-router-dom";
import SettingsProvider from './providers/SettingsProvider'
import Layout from './components/Layout.tsx'
import './App.css'

// pages
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App
