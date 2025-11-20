// src/components/Hero.jsx (GÜNCELLENMİŞ KOD)

import React from 'react';

const Hero = () => {
  return (
    // Arka planı krem beyazı yapıyoruz (bg-stone-50)
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-gray-900 relative overflow-hidden pt-20">
      
      {/* İKİ TARAFLI, MODERN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* SOL: BAŞLIK VE CTA */}
        <div className="text-left py-12 lg:py-0">
          <p className="text-lg font-semibold text-green-600 mb-2">SAĞLIKLI. PRATİK. LEZZETLİ.</p>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-snug">
            BeeCup ile <br className="hidden sm:inline" />Gününü **Tazele**
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Anlık atıştırmalık ihtiyacını gidermek için en taze salatalar ve sandviçler şimdi bir tık uzağında.
          </p>
          
          {/* CTA Butonları */}
          <div className="flex space-x-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3 px-8 rounded-full transition duration-300 shadow-xl transform hover:scale-105">
              Menüyü İncele
            </button>
            <button className="bg-transparent border-2 border-green-600 text-green-600 font-semibold text-lg py-3 px-8 rounded-full transition duration-300 hover:bg-green-100">
              Nasıl Çalışır?
            </button>
          </div>
        </div>

        {/* SAĞ: GÖRSEL ALAN */}
        <div className="relative h-96 w-full lg:h-[600px] flex justify-center">
             {/* Yer Tutucu Resim - Buraya kaliteli bir yemek resmi gelecektir */}
            <img 
                src="https://placehold.co/600x600/bbf7d0/374151?text=Premium+Salad+Image" 
                alt="Taze Salata Görseli"
                className="rounded-xl shadow-2xl object-cover w-full h-full transform hover:scale-[1.02] transition duration-500"
            />
        </div>

      </div>
    </div>
  );
};

export default Hero;