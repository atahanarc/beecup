import React, { useState } from 'react';
import { Leaf, Smartphone, Recycle, ChevronRight, MapPin, Instagram, Linkedin, Twitter, Menu, X, ArrowDown } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-gray-800 antialiased">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 py-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-sm">
              <Leaf size={20} />
            </div>
            <span className="text-2xl font-bold text-[#15803d] tracking-wide">BeeCup</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="font-bold text-gray-600 hover:text-[#15803d] transition text-sm tracking-widest">MENÜ</a>
            <a href="#tech" className="font-bold text-gray-600 hover:text-[#15803d] transition text-sm tracking-widest">TEKNOLOJİ</a>
            <a href="#sustainability" className="font-bold text-gray-600 hover:text-[#15803d] transition text-sm tracking-widest">SÜRDÜRÜLEBİLİRLİK</a>
            <button className="bg-[#15803d] text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 transition shadow-lg transform hover:-translate-y-1">
              APP İNDİR
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 flex flex-col gap-4 shadow-xl">
            <a href="#menu" className="font-bold text-xl text-gray-800" onClick={() => setIsMenuOpen(false)}>MENÜ</a>
            <a href="#tech" className="font-bold text-xl text-gray-800" onClick={() => setIsMenuOpen(false)}>TEKNOLOJİ</a>
            <a href="#sustainability" className="font-bold text-xl text-gray-800" onClick={() => setIsMenuOpen(false)}>SÜRDÜRÜLEBİLİRLİK</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
            alt="Fresh Food" 
            className="w-full h-full object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-4 mt-10">
          <span className="uppercase tracking-[0.2em] text-yellow-400 font-bold text-sm mb-4 block animate-pulse">
            Ofisinizdeki Taze Mola
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-2xl">
            Sağlıklı Yemek <br /> Artık Çok Yakın.
          </h1>
          <p className="text-xl font-light mb-10 text-gray-100 max-w-2xl mx-auto">
            Plazanızın lobisinde, diyetisyen onaylı taze bowl ve salatalar. 
            Sıra yok, bekleme yok. Sadece gerçek lezzet.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#menu" className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition shadow-xl flex items-center justify-center gap-2">
              MENÜYÜ İNCELE <ArrowDown size={20} />
            </a>
            <button className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition">
              OTOMAT BUL
            </button>
          </div>
        </div>
      </header>

      {/* --- MENU SECTION (Veriler Rapordan) --- */}
      <section id="menu" className="py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#15803d] mb-4">Bugün Ne Yiyeceksin?</h2>
          <p className="text-lg text-gray-500 italic">Her sabah taze hazırlanır, 4°C'de korunur.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Product 1 */}
          <ProductCard 
            image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
            title="Protein Bowl"
            desc="Kinoa, ızgara tavuk, avokado, siyah fasulye"
            price="155 TL"
            cal="450 kcal"
          />
          {/* Product 2 */}
          <ProductCard 
            image="https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop"
            title="Humuslu Wrap"
            desc="Tam buğday lavaş, ev yapımı humus, havuç"
            price="140 TL"
            cal="380 kcal"
          />
          {/* Product 3 */}
          <ProductCard 
            image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
            title="Izgara Tavuk Salata"
            desc="Mevsim yeşillikleri, cherry domates, zeytinyağı sos"
            price="140 TL"
            cal="320 kcal"
          />
        </div>
      </section>

      {/* --- TECH SECTION --- */}
      <section id="tech" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-100 rounded-full z-0 opacity-50"></div>
             <img 
               src="https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=2085&auto=format&fit=crop" 
               alt="Vending Machine" 
               className="relative z-10 rounded-[2rem] shadow-2xl w-full h-[600px] object-cover"
             />
             <div className="absolute bottom-10 -right-5 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs border-l-4 border-[#15803d]">
               <div className="flex items-center gap-3 mb-2">
                 <Smartphone className="text-[#15803d]" />
                 <span className="font-bold text-lg">QR ile Öde</span>
               </div>
               <p className="text-sm text-gray-600">Cüzdanına ihtiyacın yok. Uygulamayı okut, kapağı aç ve al.</p>
             </div>
          </div>
          
          <div className="lg:w-1/2">
            <span className="text-[#15803d] font-bold tracking-widest text-sm uppercase mb-2 block">TEKNOLOJİ</span>
            <h2 className="text-5xl font-black mb-8 text-gray-900">Akıllı, Hızlı ve <br/> Temassız.</h2>
            
            <div className="space-y-8">
              <FeatureItem 
                number="01" 
                title="Seçimini Yap" 
                desc="21.5 inç dokunmatik ekrandan dilediğin bowl veya salatayı seç. İçeriğini ve kalorisini gör." 
              />
              <FeatureItem 
                number="02" 
                title="QR ile Öde & Al" 
                desc="BeeCup App veya kredi kartını okut. Kapağı aç ve yemeğini al." 
              />
              <FeatureItem 
                number="03" 
                title="Puan Kazan" 
                desc="Yediğin kabı otomata geri at, anında puan kazan ve bir sonraki yemeğinde indirim yakala." 
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SUSTAINABILITY BAR --- */}
      <section id="sustainability" className="py-20 bg-[#15803d] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6">
            <Recycle size={40} className="text-yellow-400" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Gezegeni Besle, Kendini Besle.</h2>
          <p className="text-xl max-w-2xl mx-auto text-green-100 mb-10">
            Kullandığımız kapların %100'ü geri dönüştürülebilir rPET malzemeden üretilmiştir. 
            "Kabını Getir" projemizle karbon ayak izimizi %40 azaltıyoruz.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-white transition">
            [cite_start]SÜRDÜRÜLEBİLİRLİK RAPORU [cite: 256]
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="text-yellow-400" />
              <span className="text-3xl font-bold">BeeCup</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Sağlıklı yemeğe ulaşmayı demokratize ediyoruz. 
              Plaza çalışanları için en taze, en hızlı ve en sürdürülebilir çözüm.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-6 text-yellow-400">Keşfet</h5>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition">Hikayemiz</a></li>
              <li><a href="#" className="hover:text-white transition">Lokasyonlar</a></li>
              <li><a href="#" className="hover:text-white transition">Besin Değerleri</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-6 text-yellow-400">İletişim</h5>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16}/> Levent, İstanbul</li>
              <li>info@beecupco.com</li>
              <li className="flex gap-4 mt-4">
                <Instagram className="cursor-pointer hover:text-yellow-400 transition" />
                <Linkedin className="cursor-pointer hover:text-yellow-400 transition" />
                <Twitter className="cursor-pointer hover:text-yellow-400 transition" />
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; 2025 BeeCup Smart Food Vending. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}

// Yardımcı Bileşenler
const ProductCard = ({ image, title, desc, price, cal }) => (
  <div className="group cursor-pointer bg-white p-4 rounded-3xl hover:shadow-2xl transition duration-500">
    <div className="relative h-72 rounded-2xl overflow-hidden mb-4">
      <img src={image} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" alt={title} />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
        {cal}
      </div>
    </div>
    <div className="text-left px-2 pb-2">
      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#15803d] transition">{title}</h3>
      <p className="text-gray-500 mt-1 mb-4 text-sm line-clamp-2">{desc}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-black text-[#15803d]">{price}</span>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-yellow-400 transition">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

const FeatureItem = ({ number, title, desc }) => (
  <div className="flex gap-6 group">
    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:bg-yellow-400 group-hover:text-black transition duration-300">
      {number}
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

export default App;