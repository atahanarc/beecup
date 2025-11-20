import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Leaf, ArrowRight, Star, Menu, X, 
  ChevronRight, MapPin, Send, Sparkles, Plus, Minus, 
  Smartphone, Recycle, Zap, Search, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LOGO COMPONENT ---
const BeeCupLogo = ({ color = "#1B4D3E" }) => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 bg-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill={color} fillOpacity="0.2"/>
        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="text-2xl font-serif font-black tracking-tight" style={{ color: color }}>BeeCup</span>
  </div>
);

// --- FULL DATA (24 Ürün) ---
const CATEGORIES = ["Tümü", "Bowl", "Wrap", "Salata", "Atıştırmalık", "İçecek"];

const MENU_ITEMS = [
  // BOWLS (Referans: Rapor sf. 3 - Bowl 155 TL)
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Izgara Tavuk Bowl", category: "Bowl", price: 155, cal: 420, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop", desc: "Organik tavuk, humus, mevsim yeşillikleri.", badge: "POPÜLER" },
  { id: 3, name: "Vegan Falafel Bowl", category: "Bowl", price: 155, cal: 380, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&fit=crop", desc: "Ev yapımı falafel, tahin sos, tabule.", badge: "VEGAN" },
  { id: 4, name: "Köfteli Protein Bowl", category: "Bowl", price: 165, cal: 510, image: "https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=800&fit=crop", desc: "Izgara köfte, siyez bulguru, yoğurt sos.", badge: "PROTEİN" },
  { id: 5, name: "Asya Usulü Bowl", category: "Bowl", price: 160, cal: 440, image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=800&fit=crop", desc: "Zencefilli tavuk, soya filizi, susam.", badge: "" },
  
  // WRAPS (Referans: Rapor sf. 3 - Wrap 140 TL)
  { id: 6, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber.", badge: "YENİ" },
  { id: 7, name: "Dana Füme Wrap", category: "Wrap", price: 145, cal: 410, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&fit=crop", desc: "Dana füme, kaşar, hardal sos.", badge: "" },
  { id: 8, name: "Sezar Wrap", category: "Wrap", price: 140, cal: 400, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&fit=crop", desc: "Çıtır tavuk, parmesan, sezar sos.", badge: "KLASİK" },
  { id: 9, name: "Meksika Wrap", category: "Wrap", price: 140, cal: 420, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&fit=crop", desc: "Acılı kıyma, fasulye, mısır.", badge: "ACI" },
  { id: 10, name: "Sebzeli Gökkuşağı", category: "Wrap", price: 135, cal: 320, image: "https://images.unsplash.com/photo-1584650554177-5a1b0211a2eb?q=80&w=800&fit=crop", desc: "Izgara kabak, patlıcan, pesto sos.", badge: "VEGAN" },

  // SALADS (Referans: Rapor sf. 3 - Salata 140 TL)
  { id: 11, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&fit=crop", desc: "Ezine peyniri, kırma zeytin, organik domates.", badge: "HAFİF" },
  { id: 12, name: "Ton Balıklı Salata", category: "Salata", price: 145, cal: 350, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&fit=crop", desc: "Ton balığı, mısır, dereotu.", badge: "" },
  { id: 13, name: "Izgara Hellim Salata", category: "Salata", price: 140, cal: 330, image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&fit=crop", desc: "Kıbrıs hellimi, ceviz, nar ekşisi.", badge: "" },
  { id: 14, name: "Buğdaylı Mercimek", category: "Salata", price: 135, cal: 310, image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&fit=crop", desc: "Yeşil mercimek, buğday, taze nane.", badge: "TOK TUTAR" },
  
  // SNACKS (Referans: Rapor sf. 3 - Atıştırmalık 110 TL)
  { id: 15, name: "Fit Humus & Havuç", category: "Atıştırmalık", price: 110, cal: 180, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&fit=crop", desc: "Taze havuç dilimleri ve klasik humus.", badge: "VEGAN" },
  { id: 16, name: "Granola Yoğurt", category: "Atıştırmalık", price: 90, cal: 220, image: "https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=800&fit=crop", desc: "Süzme yoğurt, ev yapımı granola, meyve.", badge: "" },
  { id: 17, name: "Çiğ Kuruyemiş", category: "Atıştırmalık", price: 120, cal: 300, image: "https://images.unsplash.com/photo-1599599810653-d8d080f043e9?q=80&w=800&fit=crop", desc: "Badem, kaju, ceviz karışımı.", badge: "ENERJİ" },
  { id: 18, name: "Zeytinyağlı Yaprak", category: "Atıştırmalık", price: 115, cal: 250, image: "https://images.unsplash.com/photo-1621669532736-392f12586a75?q=80&w=800&fit=crop", desc: "Limonlu ev tipi sarma.", badge: "" },

  // DRINKS (Referans: Rapor sf. 3 - İçecek 70 TL)
  { id: 19, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&fit=crop", desc: "Yeşil elma, ıspanak, zencefil, limon.", badge: "DETOX" },
  { id: 20, name: "Taze Portakal", category: "İçecek", price: 70, cal: 140, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&fit=crop", desc: "%100 sıkma portakal suyu.", badge: "C VİTAMİNİ" },
  { id: 21, name: "Zencefilli Shot", category: "İçecek", price: 50, cal: 40, image: "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?q=80&w=800&fit=crop", desc: "Zencefil, zerdeçal, limon.", badge: "BAĞIŞIKLIK" },
  { id: 22, name: "Soğuk Kahve", category: "İçecek", price: 60, cal: 80, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&fit=crop", desc: "Cold brew, şekersiz.", badge: "" },
  { id: 23, name: "Doğal Kaynak Suyu", category: "İçecek", price: 15, cal: 0, image: "https://images.unsplash.com/photo-1564414291-276d22a50a60?q=80&w=800&fit=crop", desc: "330ml cam şişe.", badge: "" },
  { id: 24, name: "Kombucha", category: "İçecek", price: 80, cal: 60, image: "https://images.unsplash.com/photo-1618415322010-34a9db332892?q=80&w=800&fit=crop", desc: "Probiyotik fermente çay.", badge: "TREND" },
];

const LOCATIONS = [
  { name: "Kanyon AVM", area: "Levent", type: "Plaza Girişi", status: "Açık" },
  { name: "Levent 199", area: "Levent", type: "Lobi", status: "Açık" },
  { name: "Maslak 42", area: "Maslak", type: "Ofis Katı", status: "Açık" },
  { name: "İTÜ Arı Teknokent", area: "Maslak", type: "Kampüs", status: "Yoğun" },
  { name: "Zorlu Center", area: "Zincirlikuyu", type: "Food Court", status: "Bakımda" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

  // Scroll & Style Reset
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F2F0E9] overflow-x-hidden relative">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => window.scrollTo(0,0)}>
             <BeeCupLogo color={isScrolled ? "#1B4D3E" : "#FFFFFF"} /> 
          </div>

          <div className={`hidden md:flex items-center gap-8`}>
            {['MENÜ', 'LOKASYONLAR', 'TEKNOLOJİ', 'SÜRDÜRÜLEBİLİRLİK'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`text-xs font-bold tracking-widest hover:text-[#F4D03F] transition-colors relative group ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4D03F] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <button onClick={() => setCartOpen(true)} className={`relative p-2 rounded-full shadow-sm hover:shadow-md transition ${isScrolled ? 'bg-[#1B4D3E] text-white' : 'bg-white text-[#1B4D3E]'}`}>
            <ShoppingBag size={20}/>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D03F] text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#1B4D3E]">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 scale-110 animate-[pulse_20s_infinite]" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/60 via-[#1B4D3E]/40 to-[#F2F0E9]"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6 mt-10">
           <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>
             <span className="text-[#F4D03F] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">YENİ NESİL OFİS BESLENMESİ</span>
             <h1 className="text-6xl md:text-9xl font-serif font-medium text-white leading-tight mb-8">
               Doğal. Taze. <br/> <span className="italic text-[#F4D03F]">Ulaşılabilir.</span>
             </h1>
             <p className="text-xl text-gray-200 font-light mb-10 max-w-2xl mx-auto">
               Plazanızın lobisinde, şeflerin hazırladığı günlük taze bowl ve salatalar. 
               Sıra bekleme, <span className="font-bold text-white">BeeCup App</span> ile QR okut ve al.
             </p>
             <button onClick={() => document.getElementById('menu').scrollIntoView()} className="bg-[#F4D03F] text-[#1B4D3E] px-10 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl hover:bg-white transition-all transform hover:-translate-y-1">
                MENÜYÜ KEŞFET
             </button>
           </motion.div>
        </div>
      </header>

      {/* --- MENU SECTION (Working Categories) --- */}
      <section id="menu" className="py-24 px-6 w-full bg-[#F2F0E9]">
         <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-5xl font-serif text-[#1B4D3E] mb-4">Bugün Ne Yiyeceksin?</h2>
               <p className="text-gray-500 mb-8">Her sabah 06:00'da taze üretilir, gün boyu 4°C'de korunur.</p>
               
               {/* Categories */}
               <div className="flex flex-wrap justify-center gap-3">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1B4D3E] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4D3E]'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {filteredItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
                  >
                     <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-4">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wide">
                           {item.badge || item.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          {item.cal} kcal
                        </div>
                     </div>
                     <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-serif font-bold text-[#1B4D3E] leading-tight">{item.name}</h3>
                           <span className="text-lg font-black text-[#F4D03F]">₺{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8">{item.desc}</p>
                        <button onClick={() => addToCart(item)} className="w-full py-3 rounded-xl bg-[#F2F0E9] text-[#1B4D3E] font-bold text-sm hover:bg-[#1B4D3E] hover:text-white transition flex items-center justify-center gap-2">
                           <Plus size={16}/> SEPETE EKLE
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- LOKASYONLAR (Interactive Map Style) --- */}
      <section id="lokasyonlar" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
           <div>
              <span className="text-[#F4D03F] font-bold tracking-[0.2em] text-xs uppercase block mb-4">SİZE EN YAKIN BEECUP</span>
              <h2 className="text-5xl font-serif text-[#1B4D3E] mb-8">Neredeyiz?</h2>
              <div className="space-y-4">
                 {LOCATIONS.map((loc, i) => (
                    <div key={i} onClick={() => setActiveLocation(loc)} className={`p-6 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${activeLocation.name === loc.name ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' : 'bg-white border-gray-100 hover:border-[#1B4D3E]'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeLocation.name === loc.name ? 'bg-white/20 text-white' : 'bg-[#F2F0E9] text-[#1B4D3E]'}`}>
                             <MapPin size={20}/>
                          </div>
                          <div>
                             <h4 className="font-bold text-lg">{loc.name}</h4>
                             <p className={`text-sm ${activeLocation.name === loc.name ? 'text-gray-300' : 'text-gray-500'}`}>{loc.area} • {loc.type}</p>
                          </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold ${loc.status === 'Açık' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {loc.status}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="h-[600px] bg-[#F2F0E9] rounded-[3rem] overflow-hidden relative shadow-2xl">
              {/* Temsili Harita Görseli */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&fit=crop" className="w-full h-full object-cover grayscale opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white p-6 rounded-2xl shadow-xl animate-bounce">
                    <MapPin size={40} className="text-[#1B4D3E] mx-auto mb-2"/>
                    <p className="font-bold text-[#1B4D3E]">{activeLocation.name}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- TEKNOLOJİ & SÜRDÜRÜLEBİLİRLİK --- */}
      <section id="teknoloji" className="py-24 bg-[#1B4D3E] text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F4D03F]/5 rounded-full blur-[120px]"></div>
         <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-8">
               <div className="inline-flex items-center gap-2 border border-[#F4D03F] text-[#F4D03F] px-4 py-1 rounded-full text-xs font-bold uppercase">
                  <Sparkles size={14}/> WZ-60C Teknolojisi
               </div>
               <h2 className="text-5xl md:text-6xl font-serif leading-tight">Akıllı Otomat. <br/> <span className="text-[#F4D03F]">Sıfır Hata.</span></h2>
               <ul className="space-y-6">
                  {[
                     { t: "21.5\" Dokunmatik Ekran", d: "Menüyü HD kalitede inceleyin, içeriği okuyun." },
                     { t: "QR ile Temassız Öde", d: "Cüzdana gerek yok. App'i okut, kapağı aç." },
                     { t: "Canlı Stok Takibi", d: "Yapay zeka ile hangi rafta ne var anlık takip." }
                  ].map((item, i) => (
                     <li key={i} className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#F4D03F]"><CheckCircle2 size={20}/></div>
                        <div><h4 className="font-bold text-lg">{item.t}</h4><p className="text-gray-400 text-sm">{item.d}</p></div>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=1000&fit=crop" className="rounded-[3rem] shadow-2xl border-4 border-[#F4D03F]/20" />
            </div>
         </div>
      </section>

      <section id="surdurulebilirlik" className="py-24 bg-[#F2F0E9]">
         <div className="max-w-4xl mx-auto text-center px-6">
            <Recycle size={64} className="text-[#1B4D3E] mx-auto mb-6"/>
            <h2 className="text-5xl font-serif text-[#1B4D3E] mb-8">Gezegeni Besle.</h2>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed">
               BeeCup kapları %100 rPET geri dönüştürülmüş malzemeden üretilir. 
               Yediğin kabı otomata geri at, hem doğayı koru hem de <span className="text-[#1B4D3E] font-bold">50 BeePuan</span> kazan.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-3xl shadow-sm"><div className="text-4xl font-black text-[#1B4D3E] mb-2">0</div><div className="text-xs font-bold tracking-widest text-gray-400">ATIK</div></div>
               <div className="bg-white p-8 rounded-3xl shadow-sm"><div className="text-4xl font-black text-[#1B4D3E] mb-2">%100</div><div className="text-xs font-bold tracking-widest text-gray-400">GERİ DÖNÜŞÜM</div></div>
               <div className="bg-white p-8 rounded-3xl shadow-sm"><div className="text-4xl font-black text-[#1B4D3E] mb-2">4°C</div><div className="text-xs font-bold tracking-widest text-gray-400">TAZELİK</div></div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181818] text-white py-20 border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#F4D03F] rounded-lg flex items-center justify-center"><Leaf className="text-black"/></div>
               <span className="text-2xl font-serif font-bold">BeeCup</span>
            </div>
            <div className="text-gray-500 text-sm">&copy; 2025 BeeCup Smart Vending. İstanbul.</div>
            <div className="flex gap-6">
               <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4D03F] hover:text-black transition">Ig</button>
               <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F4D03F] hover:text-black transition">In</button>
            </div>
         </div>
      </footer>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setCartOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-[#1B4D3E] text-white">
                 <div className="flex items-center gap-2"><ShoppingBag/> <h2 className="font-bold text-lg">Sepetim ({cart.length})</h2></div>
                 <button onClick={() => setCartOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F2F0E9]">
                 {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60"><ShoppingBag size={64} className="mb-4"/><p>Sepetin henüz boş.</p></div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="bg-white p-3 rounded-2xl flex gap-4 items-center shadow-sm">
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1"><h4 className="font-bold text-[#1B4D3E] text-sm">{item.name}</h4><p className="text-xs text-gray-500">₺{item.price}</p></div>
                          <span className="font-bold text-[#1B4D3E] bg-gray-100 px-3 py-1 rounded-lg">x{item.qty}</span>
                       </div>
                    ))
                 )}
              </div>
              {cart.length > 0 && <div className="p-6 bg-white border-t"><button className="w-full bg-[#F4D03F] text-[#1B4D3E] py-4 rounded-xl font-bold hover:bg-[#e0c040] transition shadow-lg">ÖDEMEYE GEÇ</button></div>}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}