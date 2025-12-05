import React from 'react';
import { Leaf, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const IMAGES = { 
  heroBg: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000", 
};

const Hero = () => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img src={IMAGES.heroBg} className="w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#4F772D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Leaf size={14} /> İstanbul'un En Taze Ağı
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-display">
            Doğal Lezzet,<br/><span className="text-[#ECF39E]">Anında Seninle.</span>
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-lg">Otomatlarımızdan veya App üzerinden siparişini ver, sıra beklemeden lezzete ulaş.</p>
          <a href="#app-section" className="bg-[#4F772D] hover:bg-[#3E6024] text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105">
            Uygulamayı İndir <Smartphone size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;