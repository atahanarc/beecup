import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, Star, X, Plus, Minus, 
  User, ArrowRight, Check, Leaf, Smartphone, Play, 
  MessageSquare, Clock, Navigation, CheckCircle2, Menu
} from 'lucide-react';

// --- CANLI DATA (GÖRSELLER DÜZELTİLDİ) ---
const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Izgara Tavuk Bowl", category: "Bowl", price: 155, cal: 420, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", desc: "Organik tavuk, siyah pirinç, humus.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop", desc: "Ezine peyniri, organik domates, salatalık.", badge: "VEGAN" },
  { id: 4, name: "Humuslu Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, köz biber.", badge: "YENİ" },
  { id: 5, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop", desc: "Yeşil elma, ıspanak, kereviz sapı.", badge: "DETOX" },
  { id: 6, name: "Fit Atıştırmalık", category: "Atıştırmalık", price: 110, cal: 250, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&auto=format&fit=crop", desc: "Taze havuç, salatalık, humus.", badge: "HAFİF" },
  { id: 7, name: "Sezar Salata", category: "Salata", price: 145, cal: 350, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&auto=format&fit=crop", desc: "Izgara tavuk, parmesan, kruton.", badge: "" },
  { id: 8, name: "Taze Portakal", category: "İçecek", price: 70, cal: 140, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop", desc: "%100 sıkma portakal suyu.", badge: "C VİTAMİNİ" }
];

const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", status: "Açık", hours: "08:00 - 22:00" },
  { id: 2, name: "Levent 199", area: "Levent", status: "Açık", hours: "7/24 Açık" },
  { id: 3, name: "Maslak 42", area: "Maslak", status: "Açık", hours: "07:30 - 19:00" },
];

// --- UÇAN ARI BİLEŞENİ (MOUSE TAKİP EDEN) ---
const BeeCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999] text-3xl transition-transform duration-100 ease-out"
      style={{ left: position.x + 10, top: position.y + 10 }}
    >
      🐝
    </div>
  );
};

export default function App() {
  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
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
    setUser({ name: "Atahan", points: 1250 });
    setLoginOpen(false);
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);
  const totalAmount = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  return (
    <div className="bg-white text-[#1A3C34] min-h-screen font-sans selection:bg-[#6cc24a] selection:text-white">
      
      {/* CSS RESET & FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        
        /* Animasyonlar */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideInRight 0.3s ease-out forwards; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <BeeCursor />

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
             <div className="w-10 h-10 bg-[#F4D03F] rounded-full flex items-center justify-center shadow-lg"><Leaf className="text-[#1A3C34]"/></div>
             <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled ? 'text-[#1A3C34]' : 'text-white'}`}>BeeCup</span>
          </div>

          {/* Menu */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-bold tracking-widest ${isScrolled ? 'text-[#1A3C34]' : 'text-white/90'}`}>
             <button onClick={() => setLocationOpen(true)} className="hover:text-[#F4D03F] transition">DOLAP SEÇ</button>
             <a href="#menu" className="hover:text-[#F4D03F] transition">MENÜ</a>
             <a href="#nasil" className="hover:text-[#F4D03F] transition">NASIL ÇALIŞIR?</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {user ? (
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${isScrolled ? 'bg-[#1A3C34]/10 text-[#1A3C34]' : 'bg-white/20 text-white'}`}>{user.name}</div>
             ) : (
                <button onClick={() => setLoginOpen(true)} className={`text-xs font-bold hover:text-[#F4D03F] transition ${isScrolled ? 'text-[#1A3C34]' : 'text-white'}`}>GİRİŞ YAP</button>
             )}
             <button onClick={() => setCartOpen(true)} className={`relative p-2 rounded-full hover:scale-110 transition ${isScrolled ? 'bg-[#1A3C34] text-white' : 'bg-white text-[#1A3C34]'}`}>
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F4D03F] text-[#1A3C34] text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (VIDEO BACKGROUND) --- */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-black">
            {/* GARANTİ ÇALIŞAN VİDEO LİNKİ */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
               <source src="https://videos.pexels.com/video-files/3196267/3196267-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C34]/80 via-transparent to-[#FFFFFF]"></div>
         </div>
         
         <div className="relative z-10 text-center px-6 max-w-4xl mt-20 animate-fade">
            <span className="inline-block py-1 px-4 border border-[#F4D03F] text-[#F4D03F] rounded-full text-xs font-bold tracking-[0.3em] mb-6">DOĞAL. TAZE. AKILLI.</span>
            <h1 className="text-6xl md:text-9xl font-serif text-white leading-none mb-8 drop-shadow-lg">
               Ye. İyi <span className="text-[#F4D03F] italic">Hisset.</span>
            </h1>
            <p className="text-xl text-gray-100 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
               Ofisindeki en taze mola. Sıra bekleme, QR kodunu okut, <br/> asansör sistemi yemeğini nazikçe sunsun.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})} className="bg-[#F4D03F] text-[#1A3C34] px-10 py-4 rounded-full font-bold tracking-wider hover:bg-white transition shadow-xl hover:scale-105 transform">
                  MENÜYÜ KEŞFET
               </button>
               <button onClick={() => setLocationOpen(true)} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-bold tracking-wider hover:bg-white hover:text-[#1A3C34] transition">
                  OTOMAT BUL
               </button>
            </div>
         </div>
      </header>

      {/* --- MENU SECTION (CANLI RENKLER) --- */}
      <section id="menu" className="py-24 px-6 max-w-[1440px] mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-5xl font-serif text-[#1A3C34] mb-8">Dolapta Neler Var?</h2>
            <div className="flex flex-wrap justify-center gap-3">
               {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1A3C34] text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-500 hover:bg-[#6cc24a] hover:text-white'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
               <div key={item.id} className="group bg-white rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 overflow-hidden">
                  <div className="relative h-72 overflow-hidden">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name} />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1A3C34] tracking-wide uppercase shadow-sm">{item.badge || item.category}</div>
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end">
                        <button onClick={() => addToCart(item)} className="bg-[#F4D03F] text-[#1A3C34] p-3 rounded-full shadow-lg hover:scale-110 transition">
                           <Plus size={24}/>
                        </button>
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-bold text-[#1A3C34] leading-tight">{item.name}</h3>
                        <span className="text-xl font-black text-[#6cc24a]">₺{item.price}</span>
                     </div>
                     <p className="text-xs text-gray-500 line-clamp-2 mb-4">{item.desc}</p>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <span>{item.cal} kcal</span> • <span className="text-green-600">Stokta</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- FOOTER (CLEAN) --- */}
      <footer className="bg-[#1A3C34] text-white py-20">
         <div className="max-w-[1440px] mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-8">
               <Leaf className="text-[#F4D03F]" size={32}/> <span className="text-4xl font-serif font-bold">BeeCup</span>
            </div>
            <div className="flex justify-center gap-8 text-xs font-bold tracking-widest text-white/60 mb-12">
               <a href="#" className="hover:text-white transition">HİKAYEMİZ</a>
               <a href="#" className="hover:text-white transition">KARİYER</a>
               <a href="#" className="hover:text-white transition">İLETİŞİM</a>
            </div>
            <p className="text-xs text-white/30">&copy; 2025 BeeCup Smart Vending.</p>
         </div>
      </footer>

      {/* --- MODALS --- */}
      
      {/* LOCATIONS DRAWER */}
      {locationOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
           <div className="absolute inset-0 bg-[#1A3C34]/60 backdrop-blur-sm" onClick={() => setLocationOpen(false)}></div>
           <div className="relative w-full md:w-[500px] bg-white h-full shadow-2xl p-8 flex flex-col animate-slide-in">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-serif text-[#1A3C34]">Lokasyonlar</h2>
                 <button onClick={() => setLocationOpen(false)}><X/></button>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1">
                 {LOCATIONS.map(loc => (
                    <div key={loc.id} className="p-6 rounded-2xl border-2 border-gray-100 hover:border-[#6cc24a] cursor-pointer transition group">
                       <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xl text-[#1A3C34]">{loc.name}</h4>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{loc.status}</span>
                       </div>
                       <p className="text-gray-500 text-sm mt-1">{loc.area}</p>
                       <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400 group-hover:text-[#6cc24a]">
                          <span className="flex items-center gap-1"><Clock size={14}/> {loc.hours}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
           <div className="absolute inset-0 bg-[#1A3C34]/60 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
           <div className="relative w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
              <div className="p-6 border-b flex justify-between items-center">
                 <h2 className="font-serif text-2xl text-[#1A3C34]">Sepetim ({cart.length})</h2>
                 <button onClick={() => setCartOpen(false)}><X/></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                 {cart.length === 0 && <p className="text-center text-gray-400 mt-10">Sepet boş.</p>}
                 {cart.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm">
                       <img src={item.image} className="w-16 h-16 rounded-lg object-cover"/>
                       <div className="flex-1">
                          <h4 className="font-bold text-[#1A3C34] text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">{item.price} ₺</p>
                       </div>
                       <span className="font-bold text-[#1A3C34]">x{item.qty}</span>
                    </div>
                 ))}
              </div>
              {cart.length > 0 && <div className="p-6 bg-white border-t"><button className="w-full bg-[#1A3C34] text-white py-4 rounded-xl font-bold">ÖDEMEYE GEÇ</button></div>}
           </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-[2rem] p-8 relative animate-fade">
              <button onClick={() => setLoginOpen(false)} className="absolute top-6 right-6"><X/></button>
              <h2 className="text-3xl font-serif font-bold text-[#1A3C34] mb-6 text-center">Giriş Yap</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                 <input className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none" placeholder="E-posta" required/>
                 <input className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none" placeholder="Şifre" type="password" required/>
                 <button className="w-full bg-[#1A3C34] text-white py-3 rounded-xl font-bold">GİRİŞ YAP</button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}