import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, ChevronRight, Star, X, Plus, Minus, 
  User, Menu, ArrowRight, Check, Leaf, Play, MessageSquare, LogIn, Smartphone, Mail, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- VERİLER (25+ Ürün - Görseller Güncellendi) ---
const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

const MENU = [
  // BOWLS
  { id: 1, name: "Somonlu Kinoa Bowl", price: 155, cal: 450, cat: "Bowl", image: "https://images.unsplash.com/photo-1550942461-9c6f2a52702c?q=80&w=800&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame, susam." },
  { id: 2, name: "Izgara Tavuk Bowl", price: 155, cal: 420, cat: "Bowl", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", desc: "Organik tavuk, siyah pirinç, humus, mevsim yeşillikleri." },
  { id: 3, name: "Vegan Falafel Bowl", price: 155, cal: 380, cat: "Bowl", image: "https://images.unsplash.com/photo-1606787366810-ce444e69ce73?q=80&w=800&auto=format&fit=crop", desc: "Fırın falafel, tahin sos, tabule, nar taneleri." },
  { id: 4, name: "Asya Usulü Bowl", price: 160, cal: 440, cat: "Bowl", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=800&auto=format&fit=crop", desc: "Zencefilli tavuk, soya filizi, yer fıstığı sosu." },
  { id: 5, name: "Köfteli Protein Bowl", price: 165, cal: 510, cat: "Bowl", image: "https://images.unsplash.com/photo-1541544719255-c6cdcdcd07c9?q=80&w=800&auto=format&fit=crop", desc: "Izgara köfte, siyez bulguru, süzme yoğurt." },
  
  // SALADS
  { id: 6, name: "Ege Salatası", price: 140, cal: 280, cat: "Salata", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", desc: "Ezine peyniri, organik domates, salatalık, zeytin." },
  { id: 7, name: "Sezar Salata", price: 145, cal: 350, cat: "Salata", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop", desc: "Izgara tavuk, parmesan, kruton, hafif sezar sos." },
  { id: 8, name: "Hellim & Ceviz", price: 140, cal: 330, cat: "Salata", image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&auto=format&fit=crop", desc: "Kıbrıs hellimi, ceviz içi, akdeniz yeşillikleri." },
  { id: 9, name: "Ton Balıklı Salata", price: 150, cal: 310, cat: "Salata", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop", desc: "Ton balığı, mısır, dereotu, limon sos." },
  { id: 10, name: "Buğdaylı Mercimek", price: 135, cal: 290, cat: "Salata", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop", desc: "Yeşil mercimek, buğday, nane, nar ekşisi." },

  // WRAPS
  { id: 11, name: "Humuslu Wrap", price: 140, cal: 390, cat: "Wrap", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber, roka." },
  { id: 12, name: "Acılı Tavuk Wrap", price: 140, cal: 420, cat: "Wrap", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop", desc: "Meksika fasulyesi, tavuk, cheddar." },
  { id: 13, name: "Dana Füme Wrap", price: 150, cal: 410, cat: "Wrap", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&auto=format&fit=crop", desc: "Dana füme, kaşar peyniri, hardal sos." },
  { id: 14, name: "Sebzeli Gökkuşağı", price: 135, cal: 320, cat: "Wrap", image: "https://images.unsplash.com/photo-1584650554177-5a1b0211a2eb?q=80&w=800&auto=format&fit=crop", desc: "Izgara kabak, patlıcan, pesto sos." },
  { id: 15, name: "Hindi Füme Sandviç", price: 130, cal: 300, cat: "Wrap", image: "https://images.unsplash.com/photo-1553909489-cd47e3b44043?q=80&w=800&auto=format&fit=crop", desc: "Tam tahıllı ekmek, hindi füme, krem peynir." },

  // SNACKS
  { id: 16, name: "Fit Humus & Havuç", price: 110, cal: 180, cat: "Atıştırmalık", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&auto=format&fit=crop", desc: "Taze havuç dilimleri ve klasik humus." },
  { id: 17, name: "Granola Yoğurt", price: 90, cal: 220, cat: "Atıştırmalık", image: "https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=800&auto=format&fit=crop", desc: "Süzme yoğurt, ev yapımı granola, meyve." },
  { id: 18, name: "Çiğ Kuruyemiş", price: 120, cal: 300, cat: "Atıştırmalık", image: "https://images.unsplash.com/photo-1599599810653-d8d080f043e9?q=80&w=800&auto=format&fit=crop", desc: "Badem, kaju, ceviz karışımı." },
  { id: 19, name: "Zeytinyağlı Yaprak", price: 115, cal: 250, cat: "Atıştırmalık", image: "https://images.unsplash.com/photo-1621669532736-392f12586a75?q=80&w=800&auto=format&fit=crop", desc: "Limonlu ev tipi sarma." },
  { id: 20, name: "Meyve Salatası", price: 100, cal: 120, cat: "Atıştırmalık", image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800&auto=format&fit=crop", desc: "Mevsim meyveleri." },

  // DRINKS
  { id: 21, name: "Green Detox", price: 70, cal: 120, cat: "İçecek", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop", desc: "Yeşil elma, ıspanak, kereviz sapı." },
  { id: 22, name: "Taze Portakal", price: 70, cal: 140, cat: "İçecek", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop", desc: "%100 sıkma portakal suyu." },
  { id: 23, name: "Zencefilli Shot", price: 50, cal: 40, cat: "İçecek", image: "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?q=80&w=800&auto=format&fit=crop", desc: "Zencefil, zerdeçal, limon." },
  { id: 24, name: "Soğuk Kahve", price: 60, cal: 80, cat: "İçecek", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop", desc: "Cold brew, şekersiz." },
  { id: 25, name: "Doğal Kaynak Suyu", price: 15, cal: 0, cat: "İçecek", image: "https://images.unsplash.com/photo-1564414291-276d22a50a60?q=80&w=800&auto=format&fit=crop", desc: "330ml cam şişe." },
];

export default function App() {
  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="bg-[#F9F8F4] text-[#1A3C34] min-h-screen">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
             <div className="w-10 h-10 bg-[#1A3C34] rounded-full flex items-center justify-center text-[#F4D03F] group-hover:rotate-12 transition-transform"><Leaf size={20} fill="currentColor"/></div>
             <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-[#1A3C34]' : 'text-white'}`}>BeeCup</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-xs font-bold tracking-widest ${isScrolled ? 'text-[#1A3C34]' : 'text-white/80'}`}>
             <a href="#misyon" className="hover:text-[#C5A85F] transition-colors">MİSYON</a>
             <a href="#menu" className="hover:text-[#C5A85F] transition-colors">MENÜ</a>
             <a href="#nasil" className="hover:text-[#C5A85F] transition-colors">TEKNOLOJİ</a>
          </div>

          <div className="flex items-center gap-4">
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
            <source src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-person-preparing-a-salad-18970-large.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 video-overlay"></div>
         
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

      {/* --- MİSYON --- */}
      <section id="misyon" className="py-24 px-6 max-w-[1440px] mx-auto">
         <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
               <span className="text-[#C5A85F] font-bold tracking-widest text-xs uppercase block mb-4">MİSYONUMUZ</span>
               <h2 className="text-4xl md:text-5xl font-serif text-[#1A3C34] mb-6 leading-tight">Hızlı Yaşamda <br/>Sağlıklı Mola.</h2>
               <p className="text-[#1A3C34]/70 text-lg leading-relaxed mb-6">
                  BeeCup, yoğun şehir hayatında sağlıklı ve taze gıdaya erişimi demokratize etmek için doğdu. 
                  Geleneksel otomatların aksine, biz sadece "gerçek yemek" sunuyoruz.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Sürdürülebilir & Yerel Malzemeler</li>
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Sıfır Plastik Atık Politikası</li>
                  <li className="flex items-center gap-3 text-[#1A3C34] font-bold"><Check className="text-[#C5A85F]"/> Akıllı Stok Yönetimi</li>
               </ul>
            </div>
            <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop" className="rounded-[3rem] shadow-2xl w-full object-cover" alt="Misyon" />
         </div>
      </section>

      {/* --- TEKNOLOJİ (ASANSÖR) --- */}
      <section id="nasil" className="py-24 bg-[#1A3C34] text-[#F9F8F4] overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-6 text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">Teknoloji ile Tanışın</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Ürünleriniz düşerek değil, hassas robotik asansör sistemiyle size ulaşır.</p>
         </div>
         <div className="max-w-[1440px] mx-auto px-6 grid md:grid-cols-3 gap-10">
            {[
               { title: "Seç & Öde", desc: "App üzerinden veya ekrandan seç, QR ile temassız öde.", icon: <Smartphone size={32}/> },
               { title: "Asansör Sistemi", desc: "Robotik asansör rafa gider, ürünü nazikçe alır ve hazneye indirir.", icon: <ArrowRight size={32}/> },
               { title: "Afiyet Olsun", desc: "Hazneden taze yemeğini al. Kabı geri getir, puan kazan!", icon: <Leaf size={32}/> }
            ].map((step, i) => (
               <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition text-center">
                  <div className="w-16 h-16 bg-[#C5A85F] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A3C34]">{step.icon}</div>
                  <h3 className="text-2xl font-serif mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* --- MENU GRID (25+) --- */}
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
            {MENU.filter(i => selectedCategory === "Tümü" || i.cat === selectedCategory).map((item) => (
               <div key={item.id} className="group bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-64 rounded-[2rem] overflow-hidden mb-4">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1A3C34] tracking-wide uppercase">{item.cat}</div>
                  </div>
                  <div className="px-2 pb-2">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif font-bold text-[#1A3C34]">{item.name}</h3>
                        <span className="text-lg font-black text-[#C5A85F]">₺{item.price}</span>
                     </div>
                     <p className="text-xs text-gray-500 mb-4 line-clamp-2 h-8">{item.desc}</p>
                     <button onClick={() => addToCart(item)} className="w-full bg-[#F9F8F4] text-[#1A3C34] py-3 rounded-xl font-bold text-xs hover:bg-[#1A3C34] hover:text-white transition flex items-center justify-center gap-2">SEPETE EKLE</button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1A3C34] text-white pt-24 pb-12">
         <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center border-b border-white/10 pb-16 mb-12">
               <div>
                  <h2 className="text-4xl font-serif mb-4">BeeCup App</h2>
                  <p className="text-white/60 mb-8 max-w-md">Sipariş ver, puan kazan, sürprizleri kaçırma.</p>
                  <div className="flex gap-4">
                     <button className="bg-white text-[#1A3C34] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#C5A85F] transition">APP STORE</button>
                     <button className="bg-transparent border border-white/30 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition">GOOGLE PLAY</button>
                  </div>
               </div>
               <div className="flex justify-end">
                   <button onClick={() => setFeedbackOpen(true)} className="flex items-center gap-2 text-[#C5A85F] font-bold border-b border-[#C5A85F] pb-1 hover:text-white hover:border-white transition">
                      <MessageSquare size={20}/> Görüş ve Önerilerinizi Yazın
                   </button>
               </div>
            </div>
            <div className="text-center text-white/30 text-xs">
               &copy; 2025 BeeCup Smart Vending. Tüm hakları saklıdır.
            </div>
         </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setLoginOpen(false)}/>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative z-[70]">
               <button onClick={() => setLoginOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-3xl font-serif font-bold text-[#1A3C34] mb-2">Giriş Yap</h2>
               <form onSubmit={handleLogin} className="space-y-4 mt-6">
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="E-posta" type="email" required/>
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Şifre" type="password" required/>
                  <button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold mt-4">GİRİŞ YAP</button>
               </form>
               <div className="mt-4 text-center text-xs text-gray-400">Hesabın yok mu? <span onClick={() => { setLoginOpen(false); setRegisterOpen(true); }} className="text-[#1A3C34] font-bold cursor-pointer hover:underline">Kayıt Ol</span></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Modal */}
      <AnimatePresence>
        {registerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setRegisterOpen(false)}/>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative z-[70]">
               <button onClick={() => setRegisterOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-3xl font-serif font-bold text-[#1A3C34] mb-2">Kayıt Ol</h2>
               <form onSubmit={handleRegister} className="space-y-4 mt-6">
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Ad Soyad" required/>
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="E-posta" type="email" required/>
                  <input className="w-full bg-[#F9F8F4] px-4 py-3 rounded-xl text-sm outline-none" placeholder="Şifre" type="password" required/>
                  <button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold mt-4">KAYIT OL</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}/>
            <motion.div initial={{y:50}} animate={{y:0}} exit={{y:50}} className="bg-white w-full max-w-lg rounded-[2rem] p-8 relative z-[70]">
               <button onClick={() => setFeedbackOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <h2 className="text-2xl font-serif font-bold text-[#1A3C34] mb-4">Bize Yazın</h2>
               <textarea className="w-full h-32 bg-[#F9F8F4] rounded-xl p-4 text-sm outline-none resize-none" placeholder="Görüş, öneri veya şikayetiniz..."></textarea>
               <button onClick={() => setFeedbackOpen(false)} className="w-full bg-[#1A3C34] text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"><Send size={16}/> GÖNDER</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setCartOpen(false)}/>
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col">
               <div className="p-6 border-b flex justify-between items-center bg-[#1A3C34] text-white">
                  <span className="font-serif text-xl">Sepetim ({cart.length})</span>
                  <button onClick={() => setCartOpen(false)}><X/></button>
               </div>
               <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F9F8F4]">
                  {cart.length === 0 && <div className="text-center text-gray-400 mt-20">Sepetiniz boş.</div>}
                  {cart.map((item, idx) => (
                     <div key={idx} className="bg-white p-3 rounded-2xl flex gap-4 items-center shadow-sm">
                        <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                           <h4 className="font-bold text-[#1A3C34] text-sm">{item.name}</h4>
                           <p className="text-xs text-gray-500">₺{item.price}</p>
                        </div>
                        <span className="font-bold text-[#1A3C34]">x{item.qty}</span>
                     </div>
                  ))}
               </div>
               <div className="p-6 bg-white border-t">
                  <div className="flex justify-between mb-4 text-xl font-bold text-[#1A3C34]">
                     <span>Toplam</span>
                     <span>₺{cart.reduce((acc, item) => acc + (item.price * item.qty), 0)}</span>
                  </div>
                  <button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold hover:bg-[#2a5a4e] transition">ÖDEMEYE GEÇ</button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}