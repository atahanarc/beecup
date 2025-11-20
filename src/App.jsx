import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Leaf, ArrowRight, Star, X, 
  MapPin, Sparkles, Plus, Minus, User, Lock, Mail, 
  Clock, CheckCircle2, Navigation, Smartphone, Recycle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LOGO COMPONENT ---
const BeeCupLogo = ({ color }) => (
  <div className="flex items-center gap-2 select-none">
    <div className="w-10 h-10 bg-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill={color} fillOpacity="0.2"/>
        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="text-2xl font-serif font-black tracking-tight transition-colors duration-300" style={{ color: color }}>BeeCup</span>
  </div>
);

// --- FULL DATA (24 ÜRÜN) ---
const CATEGORIES = ["Tümü", "Bowl", "Wrap", "Salata", "Atıştırmalık", "İçecek"];

const MENU_ITEMS = [
  // BOWLS
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Izgara Tavuk Bowl", category: "Bowl", price: 155, cal: 420, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop", desc: "Organik tavuk, humus, mevsim yeşillikleri.", badge: "POPÜLER" },
  { id: 3, name: "Vegan Falafel Bowl", category: "Bowl", price: 155, cal: 380, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&fit=crop", desc: "Ev yapımı falafel, tahin sos, tabule.", badge: "VEGAN" },
  { id: 4, name: "Köfteli Protein Bowl", category: "Bowl", price: 165, cal: 510, image: "https://images.unsplash.com/photo-1511690656952-34342d5c2899?q=80&w=800&fit=crop", desc: "Izgara köfte, siyez bulguru, yoğurt sos.", badge: "PROTEİN" },
  { id: 5, name: "Asya Usulü Bowl", category: "Bowl", price: 160, cal: 440, image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=800&fit=crop", desc: "Zencefilli tavuk, soya filizi, susam.", badge: "" },
  
  // WRAPS
  { id: 6, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber.", badge: "YENİ" },
  { id: 7, name: "Dana Füme Wrap", category: "Wrap", price: 145, cal: 410, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&fit=crop", desc: "Dana füme, kaşar, hardal sos.", badge: "" },
  { id: 8, name: "Sezar Wrap", category: "Wrap", price: 140, cal: 400, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&fit=crop", desc: "Çıtır tavuk, parmesan, sezar sos.", badge: "KLASİK" },
  { id: 9, name: "Meksika Wrap", category: "Wrap", price: 140, cal: 420, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&fit=crop", desc: "Acılı kıyma, fasulye, mısır.", badge: "ACI" },
  { id: 10, name: "Sebzeli Gökkuşağı", category: "Wrap", price: 135, cal: 320, image: "https://images.unsplash.com/photo-1584650554177-5a1b0211a2eb?q=80&w=800&fit=crop", desc: "Izgara kabak, patlıcan, pesto sos.", badge: "VEGAN" },

  // SALADS
  { id: 11, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&fit=crop", desc: "Ezine peyniri, kırma zeytin, organik domates.", badge: "HAFİF" },
  { id: 12, name: "Ton Balıklı Salata", category: "Salata", price: 145, cal: 350, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&fit=crop", desc: "Ton balığı, mısır, dereotu.", badge: "" },
  { id: 13, name: "Izgara Hellim Salata", category: "Salata", price: 140, cal: 330, image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&fit=crop", desc: "Kıbrıs hellimi, ceviz, nar ekşisi.", badge: "" },
  { id: 14, name: "Buğdaylı Mercimek", category: "Salata", price: 135, cal: 310, image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&fit=crop", desc: "Yeşil mercimek, buğday, taze nane.", badge: "TOK TUTAR" },
  
  // SNACKS
  { id: 15, name: "Fit Humus & Havuç", category: "Atıştırmalık", price: 110, cal: 180, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&fit=crop", desc: "Taze havuç dilimleri ve klasik humus.", badge: "VEGAN" },
  { id: 16, name: "Granola Yoğurt", category: "Atıştırmalık", price: 90, cal: 220, image: "https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=800&fit=crop", desc: "Süzme yoğurt, ev yapımı granola, meyve.", badge: "" },
  { id: 17, name: "Çiğ Kuruyemiş", category: "Atıştırmalık", price: 120, cal: 300, image: "https://images.unsplash.com/photo-1599599810653-d8d080f043e9?q=80&w=800&fit=crop", desc: "Badem, kaju, ceviz karışımı.", badge: "ENERJİ" },
  { id: 18, name: "Zeytinyağlı Yaprak", category: "Atıştırmalık", price: 115, cal: 250, image: "https://images.unsplash.com/photo-1621669532736-392f12586a75?q=80&w=800&fit=crop", desc: "Limonlu ev tipi sarma.", badge: "" },

  // DRINKS
  { id: 19, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&fit=crop", desc: "Yeşil elma, ıspanak, zencefil, limon.", badge: "DETOX" },
  { id: 20, name: "Taze Portakal", category: "İçecek", price: 70, cal: 140, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&fit=crop", desc: "%100 sıkma portakal suyu.", badge: "C VİTAMİNİ" },
  { id: 21, name: "Zencefilli Shot", category: "İçecek", price: 50, cal: 40, image: "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?q=80&w=800&fit=crop", desc: "Zencefil, zerdeçal, limon.", badge: "BAĞIŞIKLIK" },
  { id: 22, name: "Soğuk Kahve", category: "İçecek", price: 60, cal: 80, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&fit=crop", desc: "Cold brew, şekersiz.", badge: "" },
  { id: 23, name: "Doğal Kaynak Suyu", category: "İçecek", price: 15, cal: 0, image: "https://images.unsplash.com/photo-1564414291-276d22a50a60?q=80&w=800&fit=crop", desc: "330ml cam şişe.", badge: "" },
  { id: 24, name: "Kombucha", category: "İçecek", price: 80, cal: 60, image: "https://images.unsplash.com/photo-1618415322010-34a9db332892?q=80&w=800&fit=crop", desc: "Probiyotik fermente çay.", badge: "TREND" },
];

const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", distance: "120m", type: "Plaza Girişi", status: "Açık", hours: "08:00 - 22:00" },
  { id: 2, name: "Levent 199", area: "Levent", distance: "400m", type: "Ana Lobi", status: "Açık", hours: "24 Saat" },
  { id: 3, name: "Maslak 42", area: "Maslak", distance: "2.1km", type: "Ofis Katı", status: "Açık", hours: "07:30 - 19:00" },
  { id: 4, name: "İTÜ Arı Teknokent", area: "Maslak", distance: "3.5km", type: "ARI 3 Binası", status: "Bakımda", hours: "Kapalı" },
];

export default function App() {
  // --- STATE ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalOpen, setModalOpen] = useState(null); // 'location', 'auth', 'qr'
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [notification, setNotification] = useState(null);

  // --- HANDLERS ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      showNotification("Bu özellik yakında eklenecek!");
    }
  };

  const addToCart = (item) => {
    if (!selectedLocation) {
      setModalOpen('location');
      return;
    }
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
    showNotification(`${item.name} eklendi!`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));

  const handleLocationSelect = (loc) => {
    if (loc.status === 'Bakımda') {
      showNotification("⚠️ Bu otomat şu an hizmet dışı.");
      return;
    }
    setSelectedLocation(loc);
    setModalOpen(null);
    showNotification(`📍 ${loc.name} seçildi. Menü güncelleniyor.`);
    setTimeout(() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }), 500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Atahan", points: 1250 });
    setModalOpen(null);
    showNotification("👋 Hoş geldin Atahan!");
  };

  const handleAppDownload = () => {
    showNotification("📲 Uygulama mağazasına yönlendiriliyorsunuz...");
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);
  const totalAmount = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F2F0E9] overflow-x-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          <div className="cursor-pointer flex items-center gap-4" onClick={() => window.scrollTo(0,0)}>
             <BeeCupLogo color={isScrolled ? "#1B4D3E" : "#FFFFFF"} />
             {selectedLocation && (
               <div 
                 onClick={() => setModalOpen('location')}
                 className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer transition border ${isScrolled ? 'bg-[#1B4D3E]/5 border-[#1B4D3E]/20 text-[#1B4D3E]' : 'bg-white/20 border-white/30 text-white'}`}
               >
                 <MapPin size={14}/>
                 <span className="text-xs font-bold uppercase tracking-wide">{selectedLocation.name}</span>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
               </div>
             )}
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['MENÜ', 'TEKNOLOJİ', 'SÜRDÜRÜLEBİLİRLİK'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-xs font-bold tracking-widest hover:text-[#F4D03F] transition-colors ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}
              >
                {item}
              </button>
            ))}
            <button onClick={() => setModalOpen('location')} className={`text-xs font-bold tracking-widest hover:text-[#F4D03F] transition-colors ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>
               LOKASYONLAR
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setModalOpen('location')} className={`lg:hidden p-2 rounded-full ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>
               <MapPin/>
             </button>

             {user ? (
               <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isScrolled ? 'bg-[#1B4D3E]/10 text-[#1B4D3E]' : 'bg-white/20 text-white'}`}>
                  <User size={16}/> {user.name}
               </div>
             ) : (
               <button 
                 onClick={() => { setAuthMode('login'); setModalOpen('auth'); }}
                 className={`hidden md:block text-xs font-bold hover:text-[#F4D03F] transition ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}
               >
                 GİRİŞ YAP
               </button>
             )}

             <button onClick={() => setCartOpen(true)} className={`relative p-2 rounded-full transition ${isScrolled ? 'bg-[#1B4D3E] text-white' : 'bg-white text-[#1B4D3E]'}`}>
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D03F] text-[#1B4D3E] text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-screen flex items-center justify-center bg-[#1B4D3E] overflow-hidden">
         <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&fit=crop" className="w-full h-full object-cover opacity-40" alt="Hero Background"/>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/60 via-[#1B4D3E]/30 to-[#F2F0E9]"></div>
         </div>
         
         <div className="relative z-10 text-center px-6 max-w-4xl mt-10">
            <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>
              <span className="inline-block py-1 px-4 rounded-full border border-[#F4D03F] text-[#F4D03F] text-xs font-bold tracking-[0.2em] mb-6">PREMIUM FOOD & TECH</span>
              <h1 className="text-5xl md:text-8xl font-serif font-medium text-white mb-6 leading-tight">
                Doğal. Taze. <br/> <span className="text-[#F4D03F] italic">Akıllı.</span>
              </h1>
              <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Ofisinizdeki en sağlıklı mola. Sıra bekleme, <span className="font-bold text-white">BeeCup App</span> üzerinden ön sipariş ver, QR ile saniyeler içinde teslim al.
              </p>
              
              <div className="flex justify-center gap-4">
                 <button 
                   onClick={() => setModalOpen('location')}
                   className="bg-[#F4D03F] text-[#1B4D3E] px-8 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center gap-2"
                 >
                    <MapPin size={18}/> EN YAKIN OTOMATI BUL
                 </button>
              </div>
            </motion.div>
         </div>
      </header>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-24 px-6 max-w-[1400px] mx-auto">
         <div className="text-center mb-16">
            {selectedLocation ? (
               <div className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-6 py-2 rounded-full mb-8 animate-fade-in shadow-lg">
                  <CheckCircle2 size={16} className="text-[#F4D03F]"/>
                  <span className="font-bold">{selectedLocation.name} Stokları</span>
                  <button onClick={() => setModalOpen('location')} className="ml-2 text-xs underline opacity-80 hover:opacity-100">Değiştir</button>
               </div>
            ) : (
               <div 
                 onClick={() => setModalOpen('location')}
                 className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 px-6 py-2 rounded-full mb-8 cursor-pointer hover:bg-gray-300 transition shadow-sm"
               >
                  <MapPin size={16}/>
                  <span className="font-bold">Stokları görmek için otomat seçin</span>
               </div>
            )}
            
            <h2 className="text-5xl font-serif text-[#1B4D3E] mb-6">Menüyü Keşfet</h2>
            
            <div className="flex flex-wrap justify-center gap-3">
               {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1B4D3E] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1B4D3E]'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
               <motion.div 
                 key={item.id}
                 initial={{opacity:0, y:20}}
                 whileInView={{opacity:1, y:0}}
                 viewport={{once:true}}
                 className="group bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
               >
                  <div className="relative h-72 rounded-[2rem] overflow-hidden mb-4">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1B4D3E] tracking-wide uppercase">
                        {item.badge}
                     </div>
                  </div>
                  <div className="px-2 pb-2">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-bold text-[#1B4D3E]">{item.name}</h3>
                        <span className="text-xl font-black text-[#F4D03F]">₺{item.price}</span>
                     </div>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.desc}</p>
                     <button 
                       onClick={() => addToCart(item)}
                       className="w-full bg-[#F2F0E9] text-[#1B4D3E] py-3.5 rounded-xl font-bold text-sm hover:bg-[#1B4D3E] hover:text-white transition flex items-center justify-center gap-2"
                     >
                        <Plus size={16}/> SEPETE EKLE
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* --- TEKNOLOJİ BÖLÜMÜ --- */}
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
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#F4D03F]"><Smartphone size={20}/></div>
                        <div><h4 className="font-bold text-lg">{item.t}</h4><p className="text-gray-400 text-sm">{item.d}</p></div>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=1000&fit=crop" className="rounded-[3rem] shadow-2xl border-4 border-[#F4D03F]/20 w-full object-cover" alt="Tech" />
            </div>
         </div>
      </section>

      {/* --- SÜRDÜRÜLEBİLİRLİK BÖLÜMÜ --- */}
      <section id="sürdürülebilirlik" className="py-24 bg-[#F2F0E9]">
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

      {/* --- LOKASYON MODALI (POP-UP) --- */}
      <AnimatePresence>
        {modalOpen === 'location' && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-[#1B4D3E]/90 backdrop-blur-sm" onClick={() => setModalOpen(null)}/>
            <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white w-full max-w-3xl rounded-[2.5rem] p-8 relative z-[90] shadow-2xl max-h-[85vh] overflow-y-auto">
               
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-[#1B4D3E]">Lokasyon Seçimi</h2>
                    <p className="text-gray-500 text-sm mt-1">Size en yakın BeeCup noktasını seçerek stokları görüntüleyin.</p>
                  </div>
                  <button onClick={() => setModalOpen(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X/></button>
               </div>

               <div className="grid gap-4">
                  {LOCATIONS.map((loc) => (
                    <div 
                      key={loc.id} 
                      onClick={() => handleLocationSelect(loc)}
                      className={`group p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${selectedLocation?.id === loc.id ? 'border-[#1B4D3E] bg-[#F2F0E9]' : 'border-gray-100 hover:border-[#1B4D3E]/30 hover:shadow-md'} ${loc.status === 'Bakımda' ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
                    >
                       <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${selectedLocation?.id === loc.id ? 'bg-[#1B4D3E] text-white' : 'bg-[#F2F0E9] text-[#1B4D3E]'}`}>
                             <MapPin size={24}/>
                          </div>
                          <div>
                             <h4 className="font-bold text-xl text-[#1B4D3E]">{loc.name}</h4>
                             <p className="text-sm text-gray-500 font-medium">{loc.area} • {loc.type}</p>
                             
                             <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center gap-1 text-xs text-gray-500">
                                 <Clock size={14}/> <span className="font-bold">{loc.hours}</span>
                               </div>
                               <div className="flex items-center gap-1 text-xs text-gray-500">
                                 <Navigation size={14}/> {loc.distance}
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${loc.status === 'Açık' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             <div className={`w-2 h-2 rounded-full ${loc.status === 'Açık' ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                             {loc.status}
                          </div>
                          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition ${selectedLocation?.id === loc.id ? 'bg-[#1B4D3E] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#1B4D3E] group-hover:text-white'}`}>
                             <ChevronRight size={20}/>
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LOGIN MODALI --- */}
      <AnimatePresence>
        {modalOpen === 'auth' && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(null)}/>
            <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} exit={{y:50, opacity:0}} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-[90] shadow-2xl">
               <button onClick={() => setModalOpen(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <div className="text-center mb-8">
                  <div className="flex justify-center mb-4"><BeeCupLogo color="#1B4D3E"/></div>
                  <h2 className="text-2xl font-bold text-[#1B4D3E]">{authMode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</h2>
               </div>
               <form onSubmit={handleLogin} className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="bg-[#F2F0E9] px-4 py-3 rounded-xl flex items-center gap-3"><User size={18} className="text-gray-400"/><input placeholder="Ad Soyad" className="bg-transparent w-full outline-none text-sm" required/></div>
                  )}
                  <div className="bg-[#F2F0E9] px-4 py-3 rounded-xl flex items-center gap-3"><Mail size={18} className="text-gray-400"/><input type="email" placeholder="E-posta" className="bg-transparent w-full outline-none text-sm" required/></div>
                  <div className="bg-[#F2F0E9] px-4 py-3 rounded-xl flex items-center gap-3"><Lock size={18} className="text-gray-400"/><input type="password" placeholder="Şifre" className="bg-transparent w-full outline-none text-sm" required/></div>
                  <button className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#153c30] transition shadow-lg">{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</button>
               </form>
               <div className="mt-6 text-center text-xs text-gray-500">
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-[#F4D03F] font-bold hover:underline">
                     {authMode === 'login' ? 'Hesap Oluştur' : 'Giriş Yap'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUCCESS QR MODAL --- */}
      <AnimatePresence>
         {modalOpen === 'qr' && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-[#1B4D3E]/95 backdrop-blur-md"/>
               <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-[100] shadow-2xl text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle2 size={48}/></div>
                  <h2 className="text-3xl font-black text-[#1B4D3E] mb-2">Sipariş Hazır!</h2>
                  <p className="text-gray-500 text-sm mb-6">Bu kodu <span className="font-bold text-[#1B4D3E]">{selectedLocation?.name}</span> otomatına okutun.</p>
                  <div className="bg-gray-900 p-4 rounded-3xl inline-block shadow-xl mb-6">
                     <div className="bg-white p-2 rounded-2xl">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BEECUP-${Math.random()}`} className="w-48 h-48 rounded-xl" alt="QR"/>
                     </div>
                  </div>
                  <button onClick={() => { setModalOpen(null); setCart([]); }} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-3 rounded-xl font-bold">Tamamla</button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

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
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50"><ShoppingBag size={64} className="mb-4"/><p>Sepetin henüz boş.</p></div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="bg-white p-4 rounded-2xl flex gap-4 items-center shadow-sm">
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                          <div className="flex-1">
                             <h4 className="font-bold text-[#1B4D3E]">{item.name}</h4>
                             <p className="text-sm text-gray-500">₺{item.price}</p>
                          </div>
                          <span className="font-bold bg-[#1B4D3E] text-white px-3 py-1 rounded-lg">x{item.qty}</span>
                       </div>
                    ))
                 )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                   <div className="flex justify-between mb-4 text-xl font-black text-[#1B4D3E]"><span>Toplam</span><span>₺{cart.reduce((a,b)=>a+(b.price*b.qty),0)}</span></div>
                   <button onClick={() => { setCartOpen(false); user ? setModalOpen('qr') : setModalOpen('auth'); }} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-4 rounded-xl font-bold hover:bg-[#e0c040] transition shadow-lg flex items-center justify-center gap-2">
                      ÖDEMEYE GEÇ <ArrowRight size={20}/>
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- BİLDİRİM TOAST --- */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{y: -50, opacity: 0}} animate={{y: 20, opacity: 1}} exit={{y: -50, opacity: 0}} className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <div className="bg-[#1B4D3E] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-bold text-sm">
              <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 size={16}/></div>
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#1B4D3E] text-white py-12 text-center mt-20">
        <div className="flex justify-center mb-6 opacity-80"><BeeCupLogo color="white"/></div>
        <div className="flex justify-center gap-8 text-xs font-bold tracking-widest text-white/50 mb-8">
          <button onClick={handleAppDownload} className="hover:text-white">KURUMSAL</button>
          <button onClick={handleAppDownload} className="hover:text-white">GİZLİLİK</button>
          <button onClick={handleAppDownload} className="hover:text-white">İLETİŞİM</button>
        </div>
        <p className="text-xs text-white/30">&copy; 2025 BeeCup Smart Vending. İstanbul.</p>
      </footer>

    </div>
  );
}