// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Menu, X, User, LogOut, Building2 } from 'lucide-react'; 
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; // Yönlendirme kancaları
import { useAppContext, CONFIG, auth } from '../context/AppContext';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user, setAuthModalType, setIsOfficeModalOpen } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigate = useNavigate(); // Sayfa değiştirmek için
  const location = useLocation(); // Hangi sayfadayız kontrolü için

  // Çıkış Yapma Fonksiyonu
  const handleLogout = async () => { 
    if (auth) await signOut(auth); 
    navigate('/'); // Çıkış yapınca ana sayfaya at
    setIsMenuOpen(false);
  };

  // Linklere Tıklayınca Çalışan Fonksiyon
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Mobilde menüyü kapat
    window.scrollTo(0, 0); // Sayfanın tepesine git
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO (Tıklayınca Ana Sayfaya Gider) */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img src={CONFIG.logoUrl} alt="BeeCup" className="h-10 w-auto object-contain" />
            <span className="font-bold text-2xl tracking-tight text-[#4F772D] font-serif">BeeCup</span>
          </div>

          {/* MASAÜSTÜ MENÜ */}
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-600 items-center">
             <button 
                onClick={() => handleNavigation('/menu')} 
                className={`hover:text-[#4F772D] transition-colors uppercase ${location.pathname === '/menu' ? 'text-[#4F772D]' : ''}`}
             >
                Menü
             </button>
             
             <button 
                onClick={() => handleNavigation('/uygulama')} 
                className={`hover:text-[#4F772D] transition-colors uppercase ${location.pathname === '/uygulama' ? 'text-[#4F772D]' : ''}`}
             >
                Uygulama
             </button>
             
             <button 
                onClick={() => handleNavigation('/beebul')} 
                className={`hover:text-[#4F772D] transition-colors uppercase ${location.pathname === '/beebul' ? 'text-[#4F772D]' : ''}`}
             >
                BeeBul
             </button>
             
             {/* Kurumsal (Sayfa değil, Modal açar) */}
             <button 
                onClick={() => setIsOfficeModalOpen(true)} 
                className="flex items-center gap-1 text-[#132A13] hover:text-[#4F772D] transition-colors bg-green-50 px-3 py-1.5 rounded-full uppercase"
             >
                <Building2 size={16}/> Kurumsal
            </button>
          </div>
        </div>

        {/* SAĞ TARAF (Giriş / Profil) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigation('/profil')} 
                className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full transition-all ${location.pathname === '/profil' ? 'bg-[#ECF39E] text-[#4F772D]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <User size={18} /> {user.displayName || "Hesabım"}
              </button>
              
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Çıkış Yap">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setAuthModalType('login')} className="text-gray-600 hover:text-[#4F772D] font-medium text-sm px-3">Giriş</button>
              <button 
                onClick={() => setAuthModalType('register')} 
                className="bg-[#4F772D] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#3E6024] shadow-md hover:shadow-lg transition-all"
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
        
        {/* MOBİL MENÜ BUTONU */}
        <button className="md:hidden text-gray-700 p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBİL MENÜ İÇERİĞİ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="absolute top-full left-0 w-full bg-white border-t shadow-lg z-40 overflow-hidden"
          >
             <div className="flex flex-col p-6 gap-6 font-medium text-gray-600 text-lg">
                <button onClick={() => handleNavigation('/menu')} className="text-left hover:text-[#4F772D]">Menü</button>
                <button onClick={() => handleNavigation('/uygulama')} className="text-left hover:text-[#4F772D]">Uygulama</button>
                <button onClick={() => handleNavigation('/beebul')} className="text-left hover:text-[#4F772D]">Neredeyiz?</button>
                
                <button onClick={() => { setIsOfficeModalOpen(true); setIsMenuOpen(false); }} className="text-left flex items-center gap-2 font-bold text-[#132A13]">
                    <Building2 size={18}/> Kurumsal Başvuru
                </button>
                
                <div className="border-t pt-6 mt-2">
                    {user ? (
                        <>
                            <button 
                                onClick={() => handleNavigation('/profil')} 
                                className="text-[#4F772D] text-left font-bold w-full flex items-center gap-2 mb-4 p-2 bg-green-50 rounded-lg"
                            >
                                <User size={20}/> Hesabım ({user.displayName})
                            </button>
                            <button onClick={handleLogout} className="text-red-500 text-left font-bold w-full flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg">
                                <LogOut size={20}/> Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                             <button onClick={() => {setAuthModalType('login'); setIsMenuOpen(false);}} className="text-gray-700 font-bold text-left border border-gray-200 py-3 rounded-xl text-center hover:bg-gray-50">Giriş Yap</button>
                             <button onClick={() => {setAuthModalType('register'); setIsMenuOpen(false);}} className="bg-[#4F772D] text-white py-3 rounded-xl font-bold text-center shadow-lg hover:bg-[#3E6024]">Hemen Kayıt Ol</button>
                        </div>
                    )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;