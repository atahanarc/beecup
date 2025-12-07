import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, QrCode, Gift, Leaf, ArrowRight, Zap, CheckCircle, MapPin } from 'lucide-react';
import HeroComposite from '../assets/beecup_hero_composite.png';
import WalletMockup from '../assets/beecup_wallet_mockup.png';

const AppPage = () => {
  return (
    <div className="bg-white">
      {/* 1. HERO SECTION (Premium Dark Green) */}
      <section className="bg-[#132A13] text-white pt-10 pb-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#1a381a] skew-x-[-12deg] transform origin-top-right mix-blend-soft-light z-0"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#4F772D]/30 rounded-full blur-3xl z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#ECF39E] text-[#132A13] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg">
              <Smartphone size={16} /> Mobil Uygulama
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
              Tazelik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECF39E] to-[#9DC88D]">Cebinde.</span>
            </h1>

            <p className="text-gray-300 text-lg md:text-xl font-light max-w-lg leading-relaxed">
              Sıra bekleme devri bitti. BeeCup uygulamasıyla ödemeni yap, ürünün <strong>hazneye düşsün</strong> ve lezzetin tadını çıkar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-white text-[#132A13] px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#ECF39E] transition-all transform hover:scale-105 shadow-xl whitespace-nowrap">
                <Smartphone size={20} /> App Store
              </button>
              <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all hover:border-white whitespace-nowrap">
                Google Play
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-400 pt-2">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-[#ECF39E]" /> Çift Yönlü QR</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-[#ECF39E]" /> Temassız Teslimat</span>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative group"
          >
            <div className="relative z-10">
              <img
                src={HeroComposite}
                alt="BeeCup App Interface"
                className="w-full max-w-[600px] mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
              />
              {/* Soft Bottom Fade Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#132A13] to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURE STRIP (Clean White) */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

          <FeatureCard
            icon={<Zap size={32} className="text-[#4F772D]" />}
            title="Saniyeler İçinde Teslim"
            desc="Otomatın yanına git, QR ile işlem yap, ürünün anında hazneye düşsün. Beklemek yok."
          />

          <FeatureCard
            icon={<Gift size={32} className="text-[#4F772D]" />}
            title="Yedikçe Kazan"
            desc="Her siparişinde Bal Puan kazan. Puanlarınla bedava bowl ve içeceklerin tadını çıkar."
          />

          <FeatureCard
            icon={<Leaf size={32} className="text-[#4F772D]" />}
            title="Her Zaman Taze"
            desc="Akıllı stok takibi sayesinde raflarda her zaman en taze ürünler seni bekliyor."
          />

        </div>
      </section>

      {/* 3. SHOWCASE SECTION (Gray/Soft Green) */}
      <section className="py-24 bg-[#F7F9F4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative">
              <img
                src={WalletMockup}
                alt="BeeCup Cüzdan ve Puanlar"
                className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl"
                style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }}
              />
              {/* Inner Glow/Shadow for Blending */}
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_40px_#F7F9F4] pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="flex-1 space-y-8">
            <div className="inline-block p-3 bg-[#e1eac6] rounded-2xl text-[#4F772D] mb-2">
              <Gift size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#132A13]">
              Sadakat Programı: <br />
              <span className="text-[#4F772D]">Bal Puan</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              BeeCup sadece karnını doyurmaz, cüzdanını da düşünür. Yaptığın her alışverişte ve iade ettiğin her cam kavanozda <strong>Bal Puan</strong> kazanırsın.
            </p>

            <ul className="space-y-4">
              <ListItem text="Her siparişte %5 Puan İadesi" />
              <ListItem text="Kavanoz İadesi ile Çevreye Katkı" />
              <ListItem text="Arkadaşını Davet Et Puan Kazan" />
            </ul>

            <button className="mt-4 text-[#4F772D] font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all">
              Cüzdanını Keşfet <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Steps) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-[#132A13] mb-4">Nasıl Çalışır?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Sadece 4 adımda şehrin en taze lezzetine ulaş.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard number="01" title="Seç ve Öde" desc="Uygulamadan dilediğin bowl veya içeceği seç, sepetine ekle." />
          <StepCard number="02" title="Çift Yönlü QR" desc="İster sen okut, ister kodu otomata göster. İkisi de çalışır." />
          <StepCard number="03" title="Hazneden Al" desc="Ödeme onaylansın, ürünün alt hazneye düşsün. Afiyet olsun!" />
          <StepCard number="04" title="İade Et & Kazan" desc="Boş kavanozu iade ünitesine bırak, anında Bal Puan kazan." />
        </div>
      </section>

      {/* 5. DOWNLOAD CTA */}
      <section className="py-20 bg-[#4F772D] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 font-serif">Tazelik Bir "Tık" Uzağında</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="bg-white text-[#132A13] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Hemen İndir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub Components ---

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex flex-col items-start p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
    <div className="mb-4 bg-white p-3 rounded-xl shadow-sm">{icon}</div>
    <h3 className="text-xl font-bold text-[#132A13] mb-2">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const ListItem = ({ text }) => (
  <li className="flex items-center gap-3 text-gray-700 font-medium">
    <div className="w-6 h-6 rounded-full bg-[#ECF39E] flex items-center justify-center text-[#4F772D]">
      <CheckCircle size={14} />
    </div>
    {text}
  </li>
);

const StepCard = ({ number, title, desc }) => (
  <div className="relative p-8 rounded-3xl bg-[#F7F9F4] border border-[#e8efe0] hover:-translate-y-2 transition-transform duration-300">
    <span className="absolute -top-6 left-8 text-6xl font-black text-white drop-shadow-md text-stroke">{number}</span>
    <div className="mt-6 relative z-10">
      <h3 className="text-xl font-bold text-[#132A13] mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AppPage;