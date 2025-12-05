import React from 'react';
import { Smartphone } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-gray-900 relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* SOL: BAŞLIK */}
        <div className="text-left py-12 lg:py-0">
          <p className="text-lg font-semibold text-green-600 mb-2">SAĞLIKLI. PRATİK. LEZZETLİ.</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-snug">
            BeeCup ile <br className="hidden sm:inline" />Gününü <span className="text-[#4F772D]">**Tazele**</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Anlık atıştırmalık ihtiyacını gidermek için en taze salatalar ve sandviçler şimdi bir tık uzağında.
          </p>
          <div className="flex space-x-4">
            <a href="#menu" className="bg-[#4F772D] hover:bg-[#3E6024] text-white font-semibold text-lg py-3 px-8 rounded-full transition duration-300 shadow-xl transform hover:scale-105">
              Menüyü İncele
            </a>
            <button className="bg-transparent border-2 border-[#4F772D] text-[#4F772D] font-semibold text-lg py-3 px-8 rounded-full transition duration-300 hover:bg-green-50">
              Nasıl Çalışır?
            </button>
          </div>
        </div>

        {/* SAĞ: YEŞİL KUTU (Placeholder yerine güzel bir div) */}
        <div className="relative h-96 w-full lg:h-[600px] flex justify-center items-center bg-green-100 rounded-3xl overflow-hidden shadow-2xl">
             <div className="text-center">
                <span className="text-6xl">🥗</span>
                <p className="mt-4 text-green-800 font-bold text-xl">BeeCup Premium</p>
             </div>
             {/* Buraya sonradan yemek resmi koyabilirsin */}
        </div>

      </div>
    </div>
  );
};

export default Hero;