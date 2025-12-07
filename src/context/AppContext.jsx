// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
// Auth ve DB'yi santralden (firebase.js) çekiyoruz
import { auth, db } from '../firebase';

// Ayarlar
export const CONFIG = {
  adminEmail: "info@beecupco.com",
  instagramLink: "https://www.instagram.com/beecupco/#",

  // ESKİSİ: logoUrl: "/logo.jpg",
  // YENİSİ (Bunu yapıştır):
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
    // Google Redirect Dönüşünü Kontrol Et
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Google Login Başarılı:", result.user.displayName);
          // Gerekirse burada özel bir "Hoş geldin" tostu gösterilebilir
        }
      })
      .catch((error) => {
        console.error("Google Login Hatası:", error);
        alert("Giriş başarısız oldu: " + error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth Durumu:", currentUser);
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