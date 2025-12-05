import React from 'react';
import { Leaf, Smartphone } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden flex items-center">
      {/* 1. ARKA PLAN RESMİ (Senin Orijinal Fotoğrafın) */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="BeeCup Taze Yemekler" 
        />
        {/* Yazıların okunması için soldan sağa karartma efekti */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* 2. İÇERİK */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white mt-10">
        <div className="max-w-2xl">
          {/* Üst Etiket */}
          <div className="inline-flex items-center gap-2 bg-[#4F772D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-xl border border-white/10">
            <Leaf size={14} /> İstanbul'un En Taze Ağı
          </div>
          
          {/* Ana Başlık */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-serif drop-shadow-lg">
            Doğal Lezzet,<br/>
            <span className="text-[#ECF39E]">Anında Seninle.</span>
          </h1>
          
          {/* Açıklama */}
          <p className="text-xl text-gray-200 mb-10 max-w-lg font-medium drop-shadow-md leading-relaxed">
            Sıra bekleme derdi bitti. En taze bowl ve salatalar, BeeCup akıllı otomatlarıyla şehrin kalbinde.
          </p>
          
          {/* Butonlar */}
          <div className="flex gap-4">
            <button className="bg-[#4F772D] hover:bg-[#3E6024] text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 transition-all hover:scale-105 shadow-xl border border-white/20">
                <Smartphone size={20} /> Uygulamayı İndir
            </button>
            <a href="/menu" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold transition-all border border-white/30 flex items-center">
                Menüyü İncele
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;