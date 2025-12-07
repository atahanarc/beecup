// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
// Auth ve DB'yi santralden (firebase.js) çekiyoruz
import { auth, db } from '../firebase';

// Ayarlar
export const CONFIG = {
  adminEmail: "info@beecupco.com",
  instagramLink: "https://www.instagram.com/beecupco/#",

  // ESKİSİ: logoUrl: "/logo.jpg",
  // YENİSİ:
  logoUrl: "/logo.png",

  emailJs: {
    serviceId: "service_5nludkm",
    templateWelcome: "template_7fj3mce",
    templateFeedback: "template_g29anfl",
    publicKey: "_m2hMVBLwxednDRNg"
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authModalType, setAuthModalType] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null);

  useEffect(() => {
    // Sadece Auth Durumunu Dinle
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      authModalType, setAuthModalType,
      currentView, setCurrentView,
      isOfficeModalOpen, setIsOfficeModalOpen,
      isFeedbackModalOpen, setIsFeedbackModalOpen,
      legalModalType, setLegalModalType
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

// Dışa aktarımlar
export { auth, db };