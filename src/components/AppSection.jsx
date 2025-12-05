// src/components/AppSection.jsx
import React from 'react';
import { Sparkles, Smartphone } from 'lucide-react';

const IMAGES = { 
  appMockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
};

const AppSection = () => (
    <section id="app-section" className="py-24 bg-[#132A13] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a381a] skew-x-12 transform origin-top-right z-0"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 bg-[#ECF39E] text-[#132A13] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"><Sparkles size={14} /> Mobil Uygulama</div>
                <h2 className="text-5xl md:text-6xl font-bold font-serif leading-tight">Tazelik <br/><span className="text-[#ECF39E]">Cebinde.</span></h2>
                <p className="text-gray-300 text-lg max-w-lg leading-relaxed">Otomatın önünde misin? QR kodu okut, ödemeni yap ve kapağı aç. App üzerinden sipariş ver, Bal Puan kazan.</p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button className="bg-white text-[#132A13] px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#ECF39E] transition-colors">
                        <Smartphone size={24} /> <span>App Store'dan İndir</span>
                    </button>
                    <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
                        <span>Google Play</span>
                    </button>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                 {/* Mockup Görseli */}
                <div className="relative w-72 h-[500px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                    <img src={IMAGES.appMockup} className="w-full h-full object-cover opacity-80" alt="App Screen" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-2xl text-white">BeeCup App</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// İŞTE EKSİK OLAN KRİTİK SATIR BU:
export default AppSection;