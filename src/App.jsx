import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ArrowRight, Star, Menu, X, 
  ChevronRight, MapPin, Send, Sparkles, Plus, Minus, User, Lock, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LOGO COMPONENT (Dosya gerektirmez, kodla çizilir) ---
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

// --- DATA ---
const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Humuslu Tavuk Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop", desc: "Ev yapımı humus, ızgara tavuk.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop", desc: "Ezine peyniri, kırma zeytin.", badge: "VEGAN" },
  { id: 4, name: "Green Detox", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", desc: "Yeşil elma, ıspanak, limon.", badge: "DETOX" }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false); // Login Modal State
  const [isLoginMode, setIsLoginMode] = useState(true); // Login vs Signup
  const [cart, setCart] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Functions
  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F2F0E9] overflow-x-hidden relative">
      
      {/* FONT IMPORT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <div className="cursor-pointer hover:scale-105 transition-transform">
             <BeeCupLogo color={isScrolled ? "#1B4D3E" : "#1B4D3E"} /> 
             {/* Hero beyaz/gri olduğu için logo hep yeşil kalsın istedim */}
          </div>

          {/* MENU */}
          <div className="hidden md:flex items-center gap-8">
            {['MENÜ', 'TEKNOLOJİ', 'SÜRDÜRÜLEBİLİRLİK'].map((item) => (
              <a key={item} href={`#${item}`} className="text-xs font-bold tracking-widest text-[#1B4D3E] hover:text-[#F4D03F] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F4D03F] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
             {/* LOGIN BUTTON */}
             <button onClick={() => setLoginOpen(true)} className="hidden md:flex items-center gap-2 text-xs font-bold text-[#1B4D3E] hover:text-[#F4D03F] transition-colors">
                <User size={18}/> GİRİŞ YAP
             </button>

             <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

             <button onClick={() => setCartOpen(true)} className="relative p-2 bg-white rounded-full shadow-sm hover:shadow-md transition text-[#1B4D3E]">
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D03F] text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (TAM EKRAN & YEŞİL TEMA) --- */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#1B4D3E]">
        {/* Arka Plan Görseli ve Overlay */}
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/80 via-[#1B4D3E]/40 to-[#F2F0E9]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 mt-10">
           <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>
             <span className="text-[#F4D03F] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">YENİ NESİL OFİS BESLENMESİ</span>
             <h1 className="text-6xl md:text-8xl font-serif font-medium text-white leading-tight mb-6">
               Doğal. Taze. <br/> <span className="italic text-[#F4D03F]">Akıllı.</span>
             </h1>
             <p className="text-xl text-gray-200 font-light mb-10 max-w-2xl mx-auto">
               Plaza çalışanları için özel olarak üretilen günlük taze bowl ve salatalar. 
               Sıra bekleme, <span className="font-bold text-white">BeeCup App</span> ile QR okut ve al.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})} className="bg-[#F4D03F] text-[#1B4D3E] px-8 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl hover:bg-white transition-all transform hover:-translate-y-1">
                   MENÜYÜ KEŞFET
                </button>
                <button onClick={() => setLoginOpen(true)} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white hover:text-[#1B4D3E] transition-all">
                   HESAP OLUŞTUR
                </button>
             </div>
           </motion.div>
        </div>
      </header>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-24 px-6 w-full bg-[#F2F0E9]">
         <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-serif text-[#1B4D3E] mb-4">Favori Lezzetler</h2>
               <p className="text-gray-500">Her sabah 06:00'da taze üretilir, 4°C'de korunur.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {MENU_ITEMS.map((item) => (
                  <div key={item.id} className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                     <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-4">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wide">
                           {item.badge}
                        </div>
                     </div>
                     <div className="px-2">
                        <h3 className="text-xl font-serif font-bold text-[#1B4D3E] mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center justify-between">
                           <span className="text-lg font-black text-[#1B4D3E]">₺{item.price}</span>
                           <button onClick={() => addToCart(item)} className="w-10 h-10 rounded-full bg-[#F2F0E9] flex items-center justify-center text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white transition">
                              <Plus size={20}/>
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- LOGIN / SIGNUP MODAL --- */}
      <AnimatePresence>
        {loginOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setLoginOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 z-[70] overflow-hidden"
            >
               <button onClick={() => setLoginOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
               
               <div className="text-center mb-8">
                  <div className="flex justify-center mb-4"><BeeCupLogo /></div>
                  <h2 className="text-2xl font-bold text-[#1B4D3E]">{isLoginMode ? 'Hoş Geldin!' : 'Aramıza Katıl'}</h2>
                  <p className="text-sm text-gray-500">Devam etmek için lütfen bilgilerinizi girin.</p>
               </div>

               <div className="space-y-4">
                  {!isLoginMode && (
                    <div className="bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-gray-100">
                       <User size={18} className="text-gray-400"/>
                       <input placeholder="Ad Soyad" className="bg-transparent w-full outline-none text-sm"/>
                    </div>
                  )}
                  <div className="bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-gray-100">
                     <Mail size={18} className="text-gray-400"/>
                     <input placeholder="E-posta Adresi" className="bg-transparent w-full outline-none text-sm"/>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3 border border-gray-100">
                     <Lock size={18} className="text-gray-400"/>
                     <input type="password" placeholder="Şifre" className="bg-transparent w-full outline-none text-sm"/>
                  </div>
               </div>

               <button className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold mt-6 hover:bg-[#153c30] transition shadow-lg">
                  {isLoginMode ? 'Giriş Yap' : 'Hesap Oluştur'}
               </button>

               <p className="text-center text-xs text-gray-500 mt-6">
                  {isLoginMode ? 'Hesabın yok mu? ' : 'Zaten üye misin? '}
                  <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-[#F4D03F] font-bold hover:underline">
                     {isLoginMode ? 'Kayıt Ol' : 'Giriş Yap'}
                  </button>
               </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CART DRAWER (Sağdan Kayan Sepet) --- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-[#1B4D3E] text-white">
                 <div className="flex items-center gap-2"><ShoppingBag/> <h2 className="font-bold text-lg">Sepetim ({cart.length})</h2></div>
                 <button onClick={() => setCartOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F2F0E9]">
                 {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                       <ShoppingBag size={64} className="mb-4"/>
                       <p>Henüz bir şey eklemedin.</p>
                    </div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="bg-white p-3 rounded-2xl flex gap-4 items-center shadow-sm">
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                             <h4 className="font-bold text-[#1B4D3E] text-sm">{item.name}</h4>
                             <p className="text-xs text-gray-500">₺{item.price}</p>
                          </div>
                          <span className="font-bold text-[#1B4D3E] bg-gray-100 px-3 py-1 rounded-lg">x{item.qty}</span>
                       </div>
                    ))
                 )}
              </div>
              
              <div className="p-6 bg-white border-t">
                 <button className="w-full bg-[#F4D03F] text-[#1B4D3E] py-4 rounded-xl font-bold hover:bg-[#e0c040] transition shadow-lg">
                    SEPETİ ONAYLA
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- AI FLOATING BUTTON --- */}
      <div className="fixed bottom-8 right-8 z-40">
         <button onClick={() => setAiOpen(!aiOpen)} className="w-16 h-16 bg-[#1B4D3E] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition border-4 border-[#F2F0E9]">
            <Sparkles size={28}/>
         </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B4D3E] text-white py-12 text-center">
        <div className="opacity-50 mb-4"><BeeCupLogo color="white"/></div>
        <p className="text-xs text-gray-300">&copy; 2025 BeeCup. Tüm hakları saklıdır.</p>
      </footer>

    </div>
  );
}