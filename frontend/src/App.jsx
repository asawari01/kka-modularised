import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SideBar from './components/SideBar';
import UpperBar from './components/UpperBar';
import './css/App.css';
import HomePage from './pages/HomePage';
import WeatherPage from './pages/WeatherPage';
import GovSchemesPage from './pages/GovSchemesPage'
import CropInfoPage from './pages/CropInfoPage';
import CropPricesPage from './pages/CropPricesPage';
import '../src/css/PageStyles.css'
import '../src/css/App.css'


function App() {
  
  const [ isSidebarOpen, setSidebarOpen ] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='app-container'>
      <UpperBar onMenuClick={toggleSidebar} />
      <div className='main-content'>
        <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main className='page-view'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />}/>
            <Route path='/weather' element={<WeatherPage />}/>
            <Route path='/governmentSchemes' element={<GovSchemesPage />}/>
            <Route path='/cropInformation' element={<CropInfoPage />}/>
            <Route path='/cropPrices' element={<CropPricesPage />}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
