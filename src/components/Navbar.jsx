// src/components/Navbar.jsx içine yapıştır:

import React, { useState } from 'react';
import { Menu, X, MapPin, User } from 'lucide-react'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ... (Kalan tüm kod) ...
  // Lütfen bir önceki cevabımdaki Navbar kodunun tamamını buraya yapıştır.
  
  return (
    <nav className="bg-white shadow-md fixed w-full z-50 font-sans">
      {/* ... önceki cevaptaki Navbar kodunun devamı ... */}
    </nav>
  );
};

export default Navbar;