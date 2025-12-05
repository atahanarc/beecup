import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AppProvider, CONFIG } from './context/AppContext';
import ReactGA from "react-ga4";

// --- BİLEŞENLER ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthModal, OfficeRequestModal, LegalModal } from './components/Modals';

// --- SAYFALAR ---
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import LocationsPage from './pages/LocationsPage';
import AppPage from './pages/AppPage';
import Profile from './pages/Profile';

// 👇 DİKKAT: Süslü parantez YOK. Çünkü AdminPage.jsx "export default" kullanıyor.
import AdminPage from './pages/AdminPage'; 

const SeoAndAnalytics = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (CONFIG.gaMeasurementId) {
      ReactGA.initialize(CONFIG.gaMeasurementId);
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }
  }, [location]);

  return (
    <Helmet>
      <title>BeeCup | Şehrin En Taze Molası</title>
    </Helmet>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#132A13] font-sans">
      <Navbar />
      <SeoAndAnalytics />

      <AuthModal />
      <OfficeRequestModal />
      <LegalModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/uygulama" element={<AppPage />} />
        <Route path="/beebul" element={<LocationsPage />} />
        <Route path="/profil" element={<Profile />} />
        
        {/* Admin Rotası */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

const App = () => (
  <HelmetProvider>
    <AppProvider>
      <MainLayout />
    </AppProvider>
  </HelmetProvider>
);

export default App;