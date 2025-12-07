// src/components/AppSection.jsx
import React from 'react';
import { Sparkles, Smartphone } from 'lucide-react';

import HeroComposite from '../assets/beecup_hero_composite.png';

const AppSection = () => (
    <section id="app-section" className="py-4 bg-[#132A13] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a381a] skew-x-12 transform origin-top-right z-0"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
            <div className="flex-1 space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#ECF39E] text-[#132A13] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"><Sparkles size={14} /> Mobil Uygulama</div>
                <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight">Tazelik <br /><span className="text-[#ECF39E]">Cebinde.</span></h2>
                <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed">Otomatın önünde misin? QR kodu okut, ödemeni yap ve ürün <strong>hazneye düşsün</strong>. App üzerinden sipariş ver, Bal Puan kazan.</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button className="bg-white text-[#132A13] px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#ECF39E] transition-colors whitespace-nowrap shadow-lg">
                        <Smartphone size={22} /> <span>App Store</span>
                    </button>
                    <button className="bg-transparent border border-white/30 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors whitespace-nowrap">
                        <span>Google Play</span>
                    </button>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                {/* Mockup Görseli */}
                <img
                    src={HeroComposite}
                    className="w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    alt="App Screen"
                />
            </div>
        </div>
    </section>
);

// İŞTE EKSİK OLAN KRİTİK SATIR BU:
export default AppSection;