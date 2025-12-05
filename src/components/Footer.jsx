import React from 'react';
import { Instagram } from 'lucide-react';
import { useAppContext, CONFIG } from '../context/AppContext';

const Footer = () => {
  const { setLegalModalType } = useAppContext();
  return (
    <footer className="text-white py-16 bg-[#132A13]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6"><span className="font-bold text-2xl">BeeCup.</span></div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">Doğal, sürdürülebilir ve teknolojik beslenme deneyimi.</p>
              <a href={CONFIG.instagramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-[#90A955] hover:text-white transition-colors font-bold"><Instagram size={20}/> Instagram'da Takip Et</a>
          </div>
          <div>
              <h4 className="font-bold mb-6 text-[#90A955]">İletişim</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                  <li>Maslak, İstanbul</li>
                  <li>info@beecupco.com</li>
              </ul>
          </div>
          <div>
              <h4 className="font-bold mb-6 text-[#90A955]">Yasal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                  <li><button onClick={()=>setLegalModalType('kvkk')} className="hover:text-white text-left">KVKK Aydınlatma Metni</button></li>
                  <li><button onClick={()=>setLegalModalType('privacy')} className="hover:text-white text-left">Gizlilik Politikası</button></li>
                  <li><button onClick={()=>setLegalModalType('terms')} className="hover:text-white text-left">Kullanım Koşulları</button></li>
              </ul>
          </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">© 2025 BeeCup Inc. Tüm hakları saklıdır.</div>
    </footer>
  );
};

export default Footer;