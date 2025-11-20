import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, Star, X, Plus, Minus, 
  User, ArrowRight, Check, Leaf, Smartphone, Mail, 
  Phone, Send, MessageSquare, Clock, Navigation, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- VERİLER ---
const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

const MENU = [
  // BOWLS
  { id: 1, name: "Somonlu Kinoa Bowl", price: 155, cal: 450, cat: "Bowl", image: "https://images.unsplash.com/photo-1550942461-9c6f2a52702c?q=80&w=800&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Izgara Tavuk Bowl", price: 155, cal: 420, cat: "Bowl", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", desc: "Organik tavuk, siyah pirinç, humus.", badge: "POPÜLER" },
  // SALADS
  { id: 6, name: "Ege Salatası", price: 140, cal: 280, cat: "Salata", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", desc: "Ezine peyniri, organik domates, salatalık.", badge: "VEGAN" },
  // WRAPS
  { id: 11, name: "Humuslu Wrap", price: 140, cal: 390, cat: "Wrap", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber.", badge: "YENİ" },
  // DRINKS
  { id: 21, name: "Green Detox", price: 70, cal: 120, cat: "İçecek", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&fit=crop", desc: "Yeşil elma, ıspanak, kereviz sapı.", badge: "DETOX" },
];

const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", distance: "120m", type: "Plaza Girişi", status: "Açık", hours: "08:00 - 22:00" },
  { id: 2, name: "Levent 199", area: "Levent", distance: "400m", type: "Ana Lobi", status: "Açık", hours: "7/24 Açık" },
  { id: 3, name: "Maslak 42", area: "Maslak", distance: "2.1km", type: "Ofis Katı", status: "Açık", hours: "07:30 - 19:00" },
];

export default function App() {
  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Functions
  const addToCart = (item) => {
    if (!selectedLocation) {
      setLocationOpen(true);
      return;
    }
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Atahan Arıcı", points: 1250 });
    setLoginOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const selectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationOpen(false);
    setTimeout(() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }), 500);
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU : MENU.filter(i => i.cat === selectedCategory);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="bg-[#FFFFFF] text-[#1A3C34] min-h-screen font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
             <div className="w-10 h-10 bg-[#1A3C34] rounded-full flex items-center justify-center text-[#F4D03F] group-hover:rotate-12 transition-transform"><Leaf size={20} fill="currentColor"/></div>
             <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-[#1A3C34]' : 'text-white'}`}>BeeCup</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-xs font-bold tracking-widest ${isScrolled ? 'text-[#1A3C34]' : 'text-white/90'}`}>
             <button onClick={() => setLocationOpen(true)} className="hover:text-[#C5A85F] transition-colors">DOLAP SEÇ</button>
             <a href="#menu" className="hover:text-[#C5A85F] transition-colors">MENÜ</a>
             <a href="#nasil" className="hover:text-[#C5A85F] transition-colors">TEKNOLOJİ</a>
          </div>

          <div className="flex items-center gap-4">
             {selectedLocation && (
               <div onClick={() => setLocationOpen(true)} className={`hidden lg:flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full border ${isScrolled ? 'border-[#1A3C34] text-[#1A3C34]' : 'border-white/30 text-white'}`}>
                 <MapPin size={14}/> <span className="text-xs font-bold">{selectedLocation.name}</span>
               </div>
             )}

             {user ? (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isScrolled ? 'bg-[#1A3C34]/10 text-[#1A3C34]' : 'bg-white/20 text-white'}`}>
                   <User size={16}/> {user.name}
                </div>
             ) : (
                <button onClick={() => setLoginOpen(true)} className={`text-xs font-bold tracking-wider hover:text-[#C5A85F] transition ${isScrolled ? 'text-[#1A3C34]' : 'text-white'}`}>GİRİŞ YAP</button>
             )}
             <button onClick={() => setCartOpen(true)} className={`relative p-2 rounded-full ${isScrolled ? 'text-[#1A3C34] hover:bg-black/5' : 'text-white hover:bg-white/10'}`}>
                <ShoppingBag size={24}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A85F] text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (VIDEO) --- */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
         <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="https://videos.pexels.com/video-files/3196267/3196267-uhd_2560_1440_25fps.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C34]/80 via-[#1A3C34]/40 to-[#FFFFFF]"></div>
         
         <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1}}>
               <span className="inline-block py-1 px-4 border border-[#C5A85F] text-[#C5A85F] rounded-full text-xs font-bold tracking-[0.3em] mb-8">PREMIUM SMART VENDING</span>
               <h1 className="text-6xl md:text-9xl font-serif leading-none mb-8">Doğal. <span className="text-[#C5A85F] italic">Akıllı.</span></h1>
               <p className="text-xl text-gray-200 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                  Teknoloji ve gastronomiyi birleştiren yeni nesil otomat deneyimi. 
                  Uygulamadan seç, QR ile öde, asansör sistemi taze yemeğini sunsun.
               </p>
               <div className="flex justify-center gap-4">
                  <a href="#menu" className="bg-[#C5A85F] text-[#1A3C34] px-10 py-4 rounded-full font-bold tracking-wider hover:bg-white transition-all shadow-xl">MENÜYÜ KEŞFET</a>
                  <button onClick={() => setRegisterOpen(true)} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold tracking-wider hover:bg-white hover:text-[#1A3C34] transition-all">HESAP OLUŞTUR</button>
               </div>
            </motion.div>
         </div>
      </header>

      {/* --- MİSYON SECTION --- */}
      <section id="misyon" className="py-24 px-6 max-w-[1440px] mx-auto">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <span className="text-[#C5A85F] font-bold tracking-widest text-xs uppercase block mb-4">MİSYONUMUZ</span>
               <h2 className="text-4xl md:text-5xl font-serif text-[#1A3C34] mb-6 leading-tight">Hızlı Yaşamda <br/>Sağlıklı Mola.</h2>
               <p className="text-[#1A3C34]/70 text-lg leading-relaxed mb-6">
                  [cite_start]BeeCup, yoğun şehir hayatında sağlıklı ve taze gıdaya erişimi demokratize etmek için doğdu [cite: 20-22, 25]. 
                  Geleneksel otomatların aksine, biz sadece "gerçek yemek" sunuyoruz.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Sürdürülebilir & Yerel Malzemeler</li>
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Sıfır Plastik Atık Politikası</li>
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Akıllı Stok Yönetimi</li>
               </ul>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl w-full object-cover" alt="Misyon" />
            </div>
         </div>
      </section>

      {/* --- NASIL ÇALIŞIR (ASANSÖR DETAYI) --- */}
      <section id="nasil" className="py-24 bg-[#1A3C34] text-white overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-6 text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">Teknoloji ile Tanışın</h2>
            [cite_start]<p className="text-white/60 max-w-2xl mx-auto">BeeCup otomatları, ürünlerinizi düşürmeden, hassas asansör sistemiyle size ulaştırır[cite: 62].</p>
         </div>
         <div className="max-w-[1440px] mx-auto px-6 grid md:grid-cols-3 gap-10">
            {[
               { title: "Seç & Öde", desc: "App üzerinden veya 21.5\" dokunmatik ekrandan ürününü seç, QR veya kartla öde.", icon: <Smartphone size={32}/> },
               { title: "Asansör Sistemi", desc: "Robotik asansör ilgili rafa gider, ürününü nazikçe alır ve alt hazneye indirir.", icon: <ArrowRight size={32}/> },
               { title: "Afiyet Olsun", desc: "Hazneden ürününü al. Kabı geri getirmeyi unutma, puan kazan!", icon: <Leaf size={32}/> }
            ].map((step, i) => (
               <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition text-center">
                  <div className="w-16 h-16 bg-[#C5A85F] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A3C34]">{step.icon}</div>
                  <h3 className="text-2xl font-serif mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* --- MENU (25+ ITEMS) --- */}
      <section id="menu" className="py-24 px-6 max-w-[1440px] mx-auto">
         <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-[#1A3C34] mb-8">Dolapta Neler Var?</h2>
            <div className="flex flex-wrap justify-center gap-3">
               {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1A3C34] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1A3C34]'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
               <div key={item.id} className="group bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-64 rounded-[2rem] overflow-hidden mb-4">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1A3C34] tracking-wide uppercase">{item.badge || item.cat}</div>
                  </div>
                  <div className="px-2 pb-2">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif font-bold text-[#1A3C34]">{item.name}</h3>
                        <span className="text-lg font-black text-[#C5A85F]">₺{item.price}</span>
                     </div>
                     <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8">{item.desc}</p>
                     <button onClick={() => addToCart(item)} className="w-full bg-[#F9F8F4] text-[#1A3C34] py-3 rounded-xl font-bold text-xs hover:bg-[#1A3C34] hover:text-white transition flex items-center justify-center gap-2"><Plus size={14}/> SEPETE EKLE</button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- APP DOWNLOAD & QR --- */}
      <section id="app-indir" className="py-24 bg-[#1A3C34] text-white">
         <div className="max-w-[1440px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <span className="text-[#C5A85F] font-bold tracking-widest text-xs uppercase mb-4 block">MOBİL DENEYİM</span>
               <h2 className="text-5xl font-serif mb-6">BeeCup Cebinde.</h2>
               <p className="text-white/60 mb-8 text-lg leading-relaxed">
                  Sıra beklemeden sipariş ver, puan kazan ve sana özel fırsatları kaçırma. 
                  Hemen QR kodu okut ve indirmeye başla.
               </p>
               <div className="flex gap-4 mb-8">
                  <button className="bg-white text-[#1A3C34] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#C5A85F] transition">APP STORE</button>
                  <button className="bg-transparent border border-white/30 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition">GOOGLE PLAY</button>
               </div>
            </div>
            <div className="flex justify-center">
               {/* QR Kodu: api.qrserver.com ile gerçek QR oluşturuluyor */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-xs">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://beecup.co/app" className="w-48 h-48 mx-auto mb-4 rounded-lg" alt="App QR"/>
                  <p className="text-[#1A3C34] font-bold">İndirmek için okutun</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#122A24] text-white pt-24 pb-12 border-t border-white/5">
         <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center border-b border-white/10 pb-16 mb-12">
               <div>
                  <h2 className="text-2xl font-serif mb-2">İletişim</h2>
                  <p className="text-white/60 text-sm">hello@beecup.co • Levent 199</p>
               </div>
               <div className="flex justify-end">
                   <button onClick={() => setFeedbackOpen(true)} className="flex items-center gap-2 text-[#C5A85F] font-bold border-b border-[#C5A85F] pb-1 hover:text-white hover:border-white transition">
                      <MessageSquare size={20}/> Görüş ve Önerilerinizi Yazın
                   </button>
               </div>
            </div>
            <div className="text-center text-white/30 text-xs">
               &copy; 2025 BeeCup Smart Vending.
            </div>
         </div>
      </footer>

      {/* --- MODALS --- */}
      
      {/* LOGIN MODAL */}
      <AnimatePresence>
        {loginOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setLoginOpen(false)}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative" onClick={e => e.stopPropagation()}>
               <button onClick={() => setLoginOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-3xl font-serif font-bold text-[#1A3C34] mb-6 text-center">Giriş Yap</h2>
               <form onSubmit={handleLogin} className="space-y-4">
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="E-posta" type="email" required/>
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Şifre" type="password" required/>
                  <button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#143d30] transition">GİRİŞ YAP</button>
               </form>
               <div className="mt-4 text-center text-xs text-gray-400">Hesabın yok mu? <span onClick={() => { setLoginOpen(false); setRegisterOpen(true); }} className="text-[#1A3C34] font-bold cursor-pointer hover:underline">Kayıt Ol</span></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER MODAL (TELEFON EKLENDİ) */}
      <AnimatePresence>
        {registerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setRegisterOpen(false)}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative" onClick={e => e.stopPropagation()}>
               <button onClick={() => setRegisterOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-3xl font-serif font-bold text-[#1A3C34] mb-2 text-center">Kayıt Ol</h2>
               <p className="text-center text-gray-500 text-sm mb-6">BeeCup ailesine katılın.</p>
               <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex gap-2"><input className="w-1/2 bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Ad" required/><input className="w-1/2 bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Soyad" required/></div>
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="E-posta" type="email" required/>
                  
                  {/* TELEFON NUMARASI ALANI */}
                  <div className="relative">
                     <Phone size={18} className="absolute left-4 top-3.5 text-gray-400"/>
                     <input className="w-full bg-[#F9F8F4] pl-12 pr-4 py-3 rounded-xl text-sm outline-none" placeholder="05XX XXX XX XX" type="tel" required/>
                  </div>
                  
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Şifre" type="password" required/>
                  <button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#143d30] transition">KAYIT OL</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOCATION MODAL */}
      <AnimatePresence>
        {locationOpen && (
           <div className="fixed inset-0 z-[70] flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => setLocationOpen(false)}>
              <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="w-full md:w-[500px] bg-white h-full shadow-2xl p-8 flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif text-[#1A3C34]">Lokasyon Seç</h2>
                    <button onClick={() => setLocationOpen(false)}><X/></button>
                 </div>
                 <div className="space-y-4 overflow-y-auto flex-1">
                    {LOCATIONS.map(loc => (
                       <div key={loc.id} onClick={() => selectLocation(loc)} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-[#1A3C34] cursor-pointer transition group">
                          <div className="flex justify-between items-start">
                             <h4 className="text-xl font-bold text-[#1A3C34]">{loc.name}</h4>
                             <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{loc.status}</span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">{loc.area} • {loc.type}</p>
                          <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400 group-hover:text-[#1A3C34]">
                             <span className="flex items-center gap-1"><MapPin size={14}/> {loc.distance}</span>
                             <span className="flex items-center gap-1"><Clock size={14}/> {loc.hours}</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {feedbackOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}>
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} className="bg-white w-full max-w-lg rounded-[2rem] p-8 relative">
               <button onClick={() => setFeedbackOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-2xl font-serif font-bold text-[#1A3C34] mb-4">Bize Yazın</h2>
               <textarea className="w-full h-32 bg-[#F9F8F4] rounded-xl p-4 text-sm outline-none resize-none" placeholder="Görüş, öneri veya şikayetiniz..."></textarea>
               <button onClick={() => setFeedbackOpen(false)} className="w-full bg-[#1A3C34] text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"><Send size={16}/> GÖNDER</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
             <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b bg-[#1A3C34] text-white flex justify-between items-center">
                   <h2 className="font-serif text-xl">Sepetim ({cart.length})</h2>
                   <button onClick={() => setCartOpen(false)}><X/></button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-[#F9F8F4]">
                   {cart.length === 0 ? (
                      <div className="text-center text-gray-400 mt-20"><ShoppingBag size={48} className="mx-auto mb-4 opacity-50"/><p>Sepetin henüz boş.</p></div>
                   ) : (
                      cart.map((item, i) => (
                         <div key={i} className="bg-white p-4 rounded-2xl flex gap-4 items-center shadow-sm mb-4">
                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover"/>
                            <div className="flex-1">
                               <h4 className="font-bold text-[#1A3C34] text-sm">{item.name}</h4>
                               <p className="text-xs text-gray-500">₺{item.price}</p>
                            </div>
                            <span className="font-bold bg-[#1A3C34] text-white px-3 py-1 rounded-lg">x{item.qty}</span>
                         </div>
                      ))
                   )}
                </div>
                {cart.length > 0 && <div className="p-6 bg-white border-t"><button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold">ÖDEMEYE GEÇ</button></div>}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}