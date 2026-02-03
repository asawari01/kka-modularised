import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import UpperBar from "./components/UpperBar";
// IMPORT THE PROVIDER
import { LanguageProvider } from "./context/LanguageContext";

import "./css/App.css";
import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";
import GovSchemesPage from "./pages/GovSchemesPage";
import CropPricesPage from "./pages/CropPricesPage";
import "../src/css/PageStyles.css";
import "../src/css/App.css";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // WRAP EVERYTHING IN LanguageProvider
  return (
    <LanguageProvider>
      <div className="app-container">
        <UpperBar onMenuClick={toggleSidebar} />
        <div className="main-content">
          <SideBar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
          />
          <main className="page-view">
            <Routes>
              <Route
                path="/"
                element={<HomePage />}
              />
              <Route
                path="/home"
                element={<HomePage />}
              />
              <Route
                path="/weather"
                element={<WeatherPage />}
              />
              <Route
                path="/governmentSchemes"
                element={<GovSchemesPage />}
              />
              <Route
                path="/cropPrices"
                element={<CropPricesPage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
