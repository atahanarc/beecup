// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Menu, X, MapPin, User } from 'lucide-react'; 
import logo from '../assets/logo.png'; // !!! LOGO YOLUNU KONTROL ET !!!

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Marka renkleri (Yeşil ve Sarı vurgu) kullanıldı.
  const primaryColor = 'green-600'; // Ana renk: Yeşil
  const hoverColor = 'green-700';
  const ctaBgColor = 'yellow-400'; // CTA rengi: Sarı (Logo ile uyumlu)

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO ALANI */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center space-x-2">
                {/* Logo Görseli */}
                <img className="h-10 w-auto" src={logo} alt="BeeCup Logo" />
            </a>
          </div>

          {/* MASAÜSTÜ MENÜ */}
          <div className="hidden md:flex space-x-8 items-center">
            
            <a href="#about" className={`text-gray-700 hover:text-${primaryColor} font-medium transition duration-300`}>About Us</a>
            <a href="#gallery" className={`text-gray-700 hover:text-${primaryColor} font-medium transition duration-300`}>Gallery</a>
            <a href="#menu" className={`text-gray-700 hover:text-${primaryColor} font-medium transition duration-300`}>Menu</a>
            
            {/* 'Find the fridge' / 'Find Us' */}
            <a href="#find-us" className={`flex items-center text-gray-700 hover:text-${primaryColor} font-medium transition duration-300`}>
              <MapPin size={18} className="mr-1" /> Find Us
            </a>

            {/* JOIN NOW BUTONU (Sarı Vurgu) */}
            <button className={`bg-${ctaBgColor} text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition shadow-lg flex items-center transform hover:scale-105`}>
              <User size={18} className="mr-2" /> Join Now
            </button>
          </div>

          {/* MOBİL MENÜ BUTONU */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`text-gray-700 hover:text-${primaryColor} focus:outline-none`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL AÇILIR MENÜ */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">About Us</a>
            <a href="#gallery" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">Gallery</a>
            <a href="#menu" className="block px-3 py-2 text-gray-700 hover:text-green-600 font-medium">Menu</a>
            <button className={`mt-4 w-11/12 bg-${ctaBgColor} text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500`}>Join Now</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;