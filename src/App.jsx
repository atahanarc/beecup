import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, ArrowRight, Star, Menu, X, 
  ChevronRight, MapPin, Send, Sparkles, Plus, Minus, Check, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- KONFİGÜRASYON ---
const LOGO_PATH = "/logo.png"; // Logonu 'public' klasörüne bu isimle at!

const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop", desc: "Ezine peyniri, kırma zeytin, organik domates.", badge: "VEGAN" },
  { id: 4, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", desc: "Yeşil elma, ıspanak, zencefil, limon.", badge: "DETOX" }
];

// --- KLİKLEYİNCE UÇAN ARI EFEKTİ ---
const BeeCursorEffect = () => {
  const [bees, setBees] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newBee = { id: Date.now(), x: e.clientX, y: e.clientY };
      setBees(prev => [...prev, newBee]);
      setTimeout(() => setBees(prev => prev.filter(b => b.id !== newBee.id)), 1000);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {bees.map(bee => (
          <motion.div
            key={bee.id}
            initial={{ opacity: 1, x: bee.x, y: bee.y, scale: 0.5 }}
            animate={{ opacity: 0, x: bee.x + 20, y: bee.y - 50, scale: 1.5, rotate: 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-2xl"
          >
            🐝
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ role: 'system', text: "Selam! Ben BeeCoach 🐝. Bugün moduna göre ne yemek istersin?" }]);

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

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    setMessages([...messages, { role: 'user', text: chatInput }]);
    setChatInput("");
    setTimeout(() => setMessages(prev => [...prev, { role: 'system', text: "Harika bir seçim! Bu ürün hem lezzetli hem de besleyici. 🥗" }]), 1000);
  };

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F9F8F4] overflow-x-hidden selection:bg-[#F4D03F] selection:text-black">
      
      {/* --- FONT & RESET --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        body { margin: 0; padding: 0; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <BeeCursorEffect />

      {/* --- NAVBAR --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${isScrolled ? 'py-4 bg-white/90 backdrop-blur-lg shadow-md' : 'py-8 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <motion.div whileHover={{ rotate: 20 }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
               {/* Eğer logo.png yoksa yedek ikon gösterir */}
               <img src={LOGO_PATH} onError={(e) => e.target.style.display='none'} className="w-full h-full object-contain" alt="BeeCup Logo" />
               <span className="text-2xl hidden first:block">🐝</span> 
            </motion.div>
            <span className={`text-2xl font-serif font-black tracking-tight ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>BeeCup</span>
          </div>

          {/* Menu */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em] ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
            {['MENÜ', 'TEKNOLOJİ', 'SÜRDÜRÜLEBİLİRLİK'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#F4D03F] transition-colors relative group py-2">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F4D03F] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             <motion.button 
               whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
               onClick={() => setAiOpen(true)}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all border ${isScrolled ? 'border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white' : 'bg-white/20 border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-[#1B4D3E]'}`}
             >
               <Sparkles size={14}/> BEECOACH
             </motion.button>
             
             <motion.button 
               whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
               onClick={() => setCartOpen(true)}
               className="relative p-2"
             >
                <ShoppingBag size={26} className={isScrolled ? 'text-[#1B4D3E]' : 'text-white'}/>
                {cart.length > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-[#F4D03F] text-[#1B4D3E] text-[10px] font-black flex items-center justify-center rounded-full shadow-sm">
                    {cart.length}
                  </motion.span>
                )}
             </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION (FULL SCREEN) --- */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/30 z-10"></div>
           <motion.img 
             initial={{ scale: 1.2 }}
             animate={{ scale: 1 }}
             transition={{ duration: 10, ease: "linear" }}
             src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2000&auto=format&fit=crop" 
             className="w-full h-full object-cover" 
           />
        </div>

        <div className="relative z-20 text-center text-white px-6 max-w-5xl">
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.8 }}
           >
             <span className="inline-block py-1 px-4 border border-[#F4D03F] text-[#F4D03F] rounded-full text-xs font-bold tracking-[0.2em] mb-6 bg-black/20 backdrop-blur-sm">
               YENİ NESİL OFİS BESLENMESİ
             </span>
             <h1 className="text-7xl md:text-9xl font-serif font-medium leading-tight mb-8 drop-shadow-xl">
               Doğal. <span className="text-[#F4D03F] italic">Taze.</span>
             </h1>
             <p className="text-xl md:text-2xl font-light text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed">
               Levent ve Maslak plazalarında, şeflerin hazırladığı günlük bowl ve salatalar. 
               Sıra yok. Beklemek yok.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('menu').scrollIntoView({behavior: 'smooth'})}
                  className="bg-[#F4D03F] text-[#1B4D3E] px-10 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl shadow-yellow-500/20"
                >
                   MENÜYÜ KEŞFET
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white hover:text-[#1B4D3E] transition-colors"
                >
                   UYGULAMAYI İNDİR
                </motion.button>
             </div>
           </motion.div>
        </div>
      </header>

      {/* --- MENU GRID (PREMIUM) --- */}
      <section id="menu" className="py-32 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-20">
            <span className="text-[#1B4D3E] font-bold tracking-widest text-xs uppercase block mb-4">GÜNLÜK ÜRETİM</span>
            <h2 className="text-5xl md:text-6xl font-serif text-[#1B4D3E]">Bu Ayın Favorileri</h2>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {MENU_ITEMS.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative cursor-pointer"
              >
                 <div className="h-[450px] rounded-[2.5rem] overflow-hidden relative bg-gray-100 shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    <div className="absolute top-5 left-5">
                       <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 tracking-wider">{item.badge}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                       <h3 className="text-white font-serif text-2xl mb-2 leading-tight">{item.name}</h3>
                       <p className="text-gray-300 text-xs mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.desc}</p>
                       
                       <div className="flex items-center justify-between">
                          <span className="text-[#F4D03F] font-bold text-xl">₺{item.price}</span>
                          <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => addToCart(item)}
                            className="w-10 h-10 bg-white text-[#1B4D3E] rounded-full flex items-center justify-center shadow-lg"
                          >
                             <Plus size={20}/>
                          </motion.button>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181818] text-white py-20 border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="text-4xl font-serif font-bold text-white mb-8 block">BeeCup</span>
            <div className="flex justify-center gap-8 text-sm text-gray-400 font-medium tracking-widest mb-12">
               <a href="#" className="hover:text-[#F4D03F]">INSTAGRAM</a>
               <a href="#" className="hover:text-[#F4D03F]">LINKEDIN</a>
               <a href="#" className="hover:text-[#F4D03F]">İLETİŞİM</a>
            </div>
            <p className="text-gray-600 text-xs">&copy; 2025 BeeCup Smart Vending. İstanbul.</p>
         </div>
      </footer>

      {/* --- CART DRAWER (ANIMATED) --- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center">
                 <h2 className="text-2xl font-serif font-bold text-[#1B4D3E]">Sepetim</h2>
                 <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                       <ShoppingBag size={48} className="mb-4 opacity-20"/>
                       <p>Sepetin henüz boş.</p>
                    </div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="flex gap-4 items-center">
                          <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1">
                             <h4 className="font-bold text-[#1B4D3E]">{item.name}</h4>
                             <p className="text-sm text-gray-500">₺{item.price}</p>
                          </div>
                          <div className="font-bold text-lg text-[#1B4D3E]">x{item.qty}</div>
                       </div>
                    ))
                 )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 bg-[#F9F8F4]">
                   <button className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold tracking-wide hover:bg-[#143d30] transition">
                      SİPARİŞİ ONAYLA
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- AI CHAT MODAL (ANIMATED) --- */}
      <AnimatePresence>
        {aiOpen && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="fixed bottom-8 right-8 z-[80] w-[350px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
           >
              <div className="bg-[#1B4D3E] p-4 text-white flex justify-between items-center">
                 <div className="flex items-center gap-2"><Sparkles size={18}/> <span className="font-bold">BeeCoach</span></div>
                 <button onClick={() => setAiOpen(false)}><X size={18}/></button>
              </div>
              <div className="h-[300px] bg-[#F9F8F4] p-4 overflow-y-auto space-y-3">
                 {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-xl text-sm max-w-[80%] ${m.role === 'system' ? 'bg-white text-gray-600 shadow-sm' : 'bg-[#1B4D3E] text-white ml-auto'}`}>
                       {m.text}
                    </div>
                 ))}
              </div>
              <div className="p-3 bg-white border-t flex gap-2">
                 <input 
                    className="flex-1 bg-gray-100 rounded-full px-4 text-sm outline-none" 
                    placeholder="Yaz..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 />
                 <button onClick={handleSendMessage} className="p-2 bg-[#1B4D3E] text-white rounded-full"><Send size={16}/></button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}