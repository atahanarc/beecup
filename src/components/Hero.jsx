// src/components/Hero.jsx

import React from 'react';

const Hero = () => {
  return (
    // Bu kısma resim ekleyene kadar koyu renk arka plan kullanacağız.
    // Tailwind'de 'min-h-screen' ile tüm ekran yüksekliğini kaplar.
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      
      {/* Arka Plan Efekti (Referans sitedeki gibi modern bir dokunuş için) */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" 
           style={{ backgroundImage: "url('https://placehold.co/1920x1080/000000/FFFFFF?text=Premium+Food+Image+Placeholder')" }}>
           {/* Not: Bu kısma kendi yüksek kaliteli yemek fotoğrafını ekleyeceksin. */}
      </div>

      {/* İçerik Katmanı */}
      <div className="relative z-10 text-center px-4">
        
        {/* Ana Başlık */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-4 leading-tight">
          Tazelik, Lezzetle Buluştu
        </h1>
        
        {/* Alt Başlık/Motto */}
        <p className="text-xl sm:text-2xl text-amber-300 font-light mb-10">
          En taze salatalar ve eşsiz sandviçler. Her anın için mükemmel seçim.
        </p>
        
        {/* CTA Butonu (Call to Action) */}
        <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg py-3 px-8 rounded-full transition duration-300 shadow-xl transform hover:scale-105">
          Menüyü İncele
        </button>
      </div>

    </div>
  );
};

export default Hero;