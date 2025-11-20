import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ArrowRight, Star, X, MapPin, Sparkles, 
  Plus, Minus, User, Lock, Mail, Clock, CheckCircle, Navigation
} from 'lucide-react';

// --- LOGO COMPONENT ---
const BeeCupLogo = ({ color }) => (
  <div className="flex items-center gap-2 select-none cursor-pointer">
    <div className="w-10 h-10 bg-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill={color} fillOpacity="0.2"/>
        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="text-2xl font-serif font-black tracking-tight transition-colors duration-300" style={{ color: color }}>BeeCup</span>
  </div>
);

// --- DATA ---
const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&fit=crop", desc: "Norveç somonu, avokado, kinoa.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop", desc: "Ev yapımı humus, ızgara tavuk.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", category: "Salata", price: 140, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&fit=crop", desc: "Ezine peyniri, kırma zeytin.", badge: "VEGAN" },
  { id: 4, name: "Green Detox", category: "İçecek", price: 70, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&fit=crop", desc: "Yeşil elma, ıspanak, limon.", badge: "DETOX" },
  { id: 5, name: "Izgara Tavuk Bowl", category: "Bowl", price: 155, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop", desc: "Organik tavuk, humus, yeşillik.", badge: "PROTEİN" },
  { id: 6, name: "Fit Atıştırmalık", category: "Atıştırmalık", price: 110, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&fit=crop", desc: "Taze havuç, salatalık, humus.", badge: "HAFİF" }
];

const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", distance: "120m", status: "Açık", hours: "08:00 - 22:00" },
  { id: 2, name: "Levent 199", area: "Levent", distance: "400m", status: "Açık", hours: "7/24 Açık" },
  { id: 3, name: "Maslak 42", area: "Maslak", distance: "2.1km", status: "Açık", hours: "07:30 - 19:00" },
  { id: 4, name: "İTÜ Arı Teknokent", area: "Maslak", distance: "3.5km", status: "Bakımda", hours: "Kapalı" },
];

const CATEGORIES = ["Tümü", "Bowl", "Wrap", "Salata", "Atıştırmalık", "İçecek"];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modal, setModal] = useState(null); // 'location', 'auth', 'qr', 'cart'
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item) => {
    if (!selectedLocation) { setModal('location'); return; }
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setModal('cart');
  };

  const handleCheckout = () => {
    if (!user) { setModal('auth'); } else { setModal('qr'); setCart([]); }
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);
  const totalAmount = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F2F0E9] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #1B4D3E; border-radius: 4px; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          <div onClick={() => window.scrollTo(0,0)}>
             <BeeCupLogo color={isScrolled ? "#1B4D3E" : "#FFFFFF"} />
          </div>

          {selectedLocation && (
            <div onClick={() => setModal('location')} className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full cursor-pointer transition border ${isScrolled ? 'bg-[#1B4D3E]/5 border-[#1B4D3E]/20 text-[#1B4D3E]' : 'bg-white/20 border-white/30 text-white'}`}>
              <MapPin size={14}/><span className="text-xs font-bold uppercase tracking-wide">{selectedLocation.name}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
             <button onClick={() => setModal('location')} className={`lg:hidden p-2 rounded-full ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}><MapPin/></button>
             {user ? (
               <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isScrolled ? 'bg-[#1B4D3E]/10 text-[#1B4D3E]' : 'bg-white/20 text-white'}`}><User size={16}/> {user.name}</div>
             ) : (
               <button onClick={() => setModal('auth')} className={`hidden md:block text-xs font-bold hover:text-[#F4D03F] transition ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>GİRİŞ YAP</button>
             )}
             <button onClick={() => setModal('cart')} className={`relative p-2 rounded-full transition ${isScrolled ? 'bg-[#1B4D3E] text-white' : 'bg-white text-[#1B4D3E]'}`}>
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D03F] text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header className="relative w-full h-screen flex items-center justify-center bg-[#1B4D3E] overflow-hidden">
         <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&fit=crop" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/60 via-[#1B4D3E]/30 to-[#F2F0E9]"></div>
         </div>
         <div className="relative z-10 text-center max-w-4xl px-6 mt-10">
            <span className="inline-block py-1 px-4 rounded-full border border-[#F4D03F] text-[#F4D03F] text-xs font-bold tracking-[0.2em] mb-6">PREMIUM FOOD & TECH</span>
            <h1 className="text-5xl md:text-8xl font-serif font-medium text-white mb-6 leading-tight">Doğal. Taze. <br/> <span className="text-[#F4D03F] italic">Akıllı.</span></h1>
            <button onClick={() => setModal('location')} className="bg-[#F4D03F] text-[#1B4D3E] px-8 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto">
               <MapPin size={18}/> EN YAKIN OTOMATI BUL
            </button>
         </div>
      </header>

      {/* --- MENU --- */}
      <section id="menu" className="py-24 px-6 max-w-[1400px] mx-auto">
         <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-[#1B4D3E] mb-6">Menüyü Keşfet</h2>
            <div className="flex flex-wrap justify-center gap-3">
               {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1B4D3E] text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#1B4D3E]'}`}>{cat}</button>
               ))}
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
               <div key={item.id} className="group bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-72 rounded-[2rem] overflow-hidden mb-4">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#1B4D3E] tracking-wide uppercase">{item.badge}</div>
                  </div>
                  <div className="px-2 pb-2">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-bold text-[#1B4D3E]">{item.name}</h3>
                        <span className="text-xl font-black text-[#F4D03F]">₺{item.price}</span>
                     </div>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.desc}</p>
                     <button onClick={() => addToCart(item)} className="w-full bg-[#F2F0E9] text-[#1B4D3E] py-3.5 rounded-xl font-bold text-sm hover:bg-[#1B4D3E] hover:text-white transition flex items-center justify-center gap-2"><Plus size={16}/> SEPETE EKLE</button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- MODALS (Saf CSS ile) --- */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
           
           {/* LOKASYON MODALI */}
           {modal === 'location' && (
             <div className="bg-white w-full max-w-3xl rounded-[2.5rem] p-8 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-serif font-bold text-[#1B4D3E]">Lokasyon Seç</h2><button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button></div>
                <div className="grid gap-4">
                   {LOCATIONS.map((loc) => (
                      <div key={loc.id} onClick={() => { setSelectedLocation(loc); setModal(null); }} className={`group p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${selectedLocation?.id === loc.id ? 'border-[#1B4D3E] bg-[#F2F0E9]' : 'border-gray-100 hover:border-[#1B4D3E]/30 hover:shadow-md'}`}>
                         <div>
                            <h4 className="font-bold text-xl text-[#1B4D3E]">{loc.name}</h4>
                            <p className="text-sm text-gray-500">{loc.area} • {loc.type}</p>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-2"><span className="flex items-center gap-1"><Clock size={14}/> {loc.hours}</span></div>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${loc.status === 'Açık' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{loc.status}</span>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* LOGIN MODALI */}
           {modal === 'auth' && (
             <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-8"><BeeCupLogo color="#1B4D3E"/><h2 className="text-2xl font-bold text-[#1B4D3E] mt-4">Giriş Yap</h2></div>
                <button onClick={(e) => { e.preventDefault(); setUser({ name: "Atahan" }); setModal(null); }} className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#153c30] transition shadow-lg">Giriş Yap (Demo)</button>
             </div>
           )}

           {/* SEPET MODALI */}
           {modal === 'cart' && (
             <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-[#1B4D3E]">Sepetim ({cart.length})</h2><button onClick={() => setModal(null)}><X/></button></div>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                   {cart.length === 0 ? <p className="text-gray-400 text-center">Sepet boş.</p> : cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2"><span className="font-bold text-[#1B4D3E]">{item.name}</span><span className="text-gray-500">x{item.qty}</span></div>
                   ))}
                </div>
                {cart.length > 0 && <button onClick={handleCheckout} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-4 rounded-xl font-bold mt-6 shadow-lg">ÖDEMEYE GEÇ</button>}
             </div>
           )}

           {/* QR MODALI */}
           {modal === 'qr' && (
             <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle size={48}/></div>
                <h2 className="text-3xl font-black text-[#1B4D3E] mb-2">Sipariş Hazır!</h2>
                <p className="text-gray-500 text-sm mb-6">Bu kodu <span className="font-bold text-[#1B4D3E]">{selectedLocation?.name}</span> otomatına okutun.</p>
                <div className="bg-gray-900 p-4 rounded-3xl inline-block shadow-xl mb-6"><div className="bg-white p-2 rounded-2xl"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BEECUP`} className="w-48 h-48 rounded-xl"/></div></div>
                <button onClick={() => { setModal(null); setCart([]); }} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-3 rounded-xl font-bold">Tamamla</button>
             </div>
           )}

        </div>
      )}
      
    </div>
  );
}