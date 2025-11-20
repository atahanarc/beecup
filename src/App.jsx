import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Leaf, ArrowRight, Star, X, 
  MapPin, Sparkles, Plus, Minus, User, Lock, Mail, LogIn, 
  Navigation, Smartphone, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LOGO COMPONENT ---
const BeeCupLogo = ({ color = "#1B4D3E" }) => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 bg-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill={color} fillOpacity="0.2"/>
        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <span className="text-2xl font-serif font-black tracking-tight" style={{ color: color }}>BeeCup</span>
  </div>
);

// --- DATA ---
const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", distance: "120m", type: "Plaza Girişi", status: "Açık", stockLevel: "Yüksek" },
  { id: 2, name: "Levent 199", area: "Levent", distance: "400m", type: "Lobi", status: "Açık", stockLevel: "Orta" },
  { id: 3, name: "Maslak 42", area: "Maslak", distance: "2.1km", type: "Ofis Katı", status: "Açık", stockLevel: "Düşük" },
  { id: 4, name: "İTÜ Arı Teknokent", area: "Maslak", distance: "3.5km", type: "Kampüs", status: "Bakımda", stockLevel: "Kapalı" },
];

const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&fit=crop", desc: "Norveç somonu, avokado, kinoa.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop", desc: "Ev yapımı humus, ızgara tavuk.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&fit=crop", desc: "Ezine peyniri, kırma zeytin.", badge: "VEGAN" },
  { id: 4, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&fit=crop", desc: "Yeşil elma, ıspanak, limon.", badge: "DETOX" },
  { id: 5, name: "Izgara Tavuk Bowl", category: "Bowl", price: 155, cal: 420, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop", desc: "Organik tavuk, humus, yeşillik.", badge: "PROTEİN" },
  { id: 6, name: "Fit Atıştırmalık", category: "Atıştırmalık", price: 110, cal: 250, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&fit=crop", desc: "Taze havuç, salatalık, humus.", badge: "HAFİF" }
];

const CATEGORIES = ["Tümü", "Bowl", "Wrap", "Salata", "Atıştırmalık", "İçecek"];

export default function App() {
  // --- STATE ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Seçilen Otomat
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  
  const [orderSuccess, setOrderSuccess] = useState(false); // QR Ekranı
  
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- FONKSİYONLAR ---

  // Stok Simülasyonu: Her otomat için rastgele stok üretir
  const getStockForLocation = (itemId, locationId) => {
    // Basit bir hash fonksiyonu ile konuma ve ürüne göre sabit stok üretelim
    const seed = itemId * locationId * 7;
    const stock = seed % 8; // 0 ile 7 arası stok
    return stock;
  };

  const handleStartOrder = () => {
    if (selectedLocation) {
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    } else {
      setLocationModalOpen(true);
    }
  };

  const selectLocation = (loc) => {
    if (loc.status === "Bakımda") {
      alert("Bu otomat şu an bakımda, lütfen başka bir otomat seçin.");
      return;
    }
    setSelectedLocation(loc);
    setLocationModalOpen(false);
    // Menüye kaydır
    setTimeout(() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const addToCart = (item) => {
    if (!selectedLocation) {
      setLocationModalOpen(true);
      return;
    }
    
    const currentStock = getStockForLocation(item.id, selectedLocation.id);
    const cartItem = cart.find(c => c.id === item.id);
    const currentQty = cartItem ? cartItem.qty : 0;

    if (currentQty >= currentStock) {
      alert("Üzgünüz, bu otomatta bu üründen daha fazla kalmadı!");
      return;
    }

    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleCheckout = () => {
    if (!user) {
      setCartOpen(false);
      setAuthMode('login');
      setAuthOpen(true);
    } else {
      // Ödeme başarılı simülasyonu
      setCartOpen(false);
      setOrderSuccess(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ name: "Atahan Arıcı", points: 1250 });
    setAuthOpen(false);
    if (cart.length > 0) {
      setCartOpen(true);
    }
  };

  const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);
  const totalAmount = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  return (
    <div className="w-full min-h-screen font-sans text-[#1F2937] bg-[#F2F0E9] overflow-x-hidden relative">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          <div className="cursor-pointer flex items-center gap-2" onClick={() => window.scrollTo(0,0)}>
             <BeeCupLogo color={isScrolled ? "#1B4D3E" : "#1B4D3E"} /> 
             {/* Masaüstünde seçili konumu göster */}
             {selectedLocation && (
               <div className="hidden lg:flex items-center gap-2 ml-6 bg-[#1B4D3E]/10 px-3 py-1 rounded-full cursor-pointer hover:bg-[#1B4D3E]/20 transition" onClick={() => setLocationModalOpen(true)}>
                 <MapPin size={14} className="text-[#1B4D3E]"/>
                 <span className="text-xs font-bold text-[#1B4D3E]">{selectedLocation.name}</span>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               </div>
             )}
          </div>

          <div className="flex items-center gap-4">
             {/* Otomat Bul Butonu (Mobilde Görünür) */}
             <button onClick={() => setLocationModalOpen(true)} className="lg:hidden p-2 bg-white rounded-full shadow-sm text-[#1B4D3E]">
               <MapPin size={20}/>
             </button>

             {/* User & Cart */}
             {user ? (
               <div className="hidden md:flex items-center gap-2 bg-[#1B4D3E]/10 px-4 py-2 rounded-full">
                  <User size={16} className="text-[#1B4D3E]"/>
                  <span className="text-sm font-bold text-[#1B4D3E]">{user.name}</span>
               </div>
             ) : (
               <button onClick={() => { setAuthMode('login'); setAuthOpen(true); }} className="hidden md:block text-xs font-bold text-[#1B4D3E] hover:text-[#F4D03F] transition">GİRİŞ YAP</button>
             )}

             <button onClick={() => setCartOpen(true)} className="relative p-2 bg-white rounded-full shadow-sm hover:shadow-md transition text-[#1B4D3E]">
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4D03F] text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#1B4D3E]">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&fit=crop" className="w-full h-full object-cover opacity-40" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#1B4D3E]/60 via-[#1B4D3E]/40 to-[#F2F0E9]"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6 mt-10">
           <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>
             <span className="text-[#F4D03F] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">YENİ NESİL PRE-ORDER SİSTEMİ</span>
             <h1 className="text-5xl md:text-8xl font-serif font-medium text-white leading-tight mb-6">
               Seç. Öde. <br/> <span className="italic text-[#F4D03F]">Teslim Al.</span>
             </h1>
             <p className="text-xl text-gray-200 font-light mb-10 max-w-2xl mx-auto">
               Ofise varmadan siparişini ver, stok durumunu gör, QR kodunu al. 
               Otomatın başına geldiğinde bekleme yapma.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleStartOrder} className="bg-[#F4D03F] text-[#1B4D3E] px-10 py-4 rounded-full font-bold text-sm tracking-wider shadow-xl hover:bg-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                   <MapPin size={18}/> OTOMAT BUL & SİPARİŞ VER
                </button>
             </div>
           </motion.div>
        </div>
      </header>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-24 px-6 w-full bg-[#F2F0E9]">
         <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
               {selectedLocation ? (
                 <div className="inline-flex items-center gap-2 bg-[#1B4D3E] text-white px-4 py-2 rounded-full mb-6 animate-pulse">
                   <MapPin size={16}/>
                   <span className="font-bold">{selectedLocation.name} Stokları Görüntüleniyor</span>
                 </div>
               ) : (
                 <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-full mb-6">
                   <AlertCircle size={16}/>
                   <span className="font-bold">Lütfen stok görmek için otomat seçin</span>
                 </div>
               )}

               <h2 className="text-5xl font-serif text-[#1B4D3E] mb-4">Canlı Menü</h2>
               
               <div className="flex flex-wrap justify-center gap-3">
                 {CATEGORIES.map(cat => (
                   <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-[#1B4D3E] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4D3E]'}`}>{cat}</button>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredItems.map((item) => {
                  // Seçili otomat varsa stok hesapla, yoksa varsayılan göster
                  const stock = selectedLocation ? getStockForLocation(item.id, selectedLocation.id) : null;
                  const isOutOfStock = selectedLocation && stock === 0;

                  return (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                    >
                       <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-4">
                          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm transform -rotate-12 border-2 border-white">TÜKENDİ</span>
                            </div>
                          )}
                          {!isOutOfStock && <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wide">{item.badge || item.category}</div>}
                       </div>
                       <div className="px-2">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="text-lg font-serif font-bold text-[#1B4D3E] leading-tight">{item.name}</h3>
                             <span className="text-lg font-black text-[#F4D03F]">₺{item.price}</span>
                          </div>
                          
                          {/* STOK GÖSTERGESİ */}
                          <div className="flex items-center gap-2 mb-4">
                             {selectedLocation ? (
                               <>
                                 <div className={`w-2 h-2 rounded-full ${stock > 3 ? 'bg-green-500' : (stock > 0 ? 'bg-orange-500' : 'bg-red-500')}`}></div>
                                 <span className={`text-xs font-bold ${stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                   {stock > 0 ? `Stokta: ${stock} adet` : 'Tükendi'}
                                 </span>
                               </>
                             ) : (
                               <span className="text-xs text-gray-400 italic">Stok için konum seçin</span>
                             )}
                          </div>

                          <button 
                            onClick={() => addToCart(item)} 
                            disabled={isOutOfStock}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F2F0E9] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white'}`}
                          >
                             {isOutOfStock ? 'STOK YOK' : <><Plus size={16}/> SEPETE EKLE</>}
                          </button>
                       </div>
                    </motion.div>
                  );
               })}
            </div>
         </div>
      </section>

      {/* --- LOCATION SELECTOR MODAL --- */}
      <AnimatePresence>
        {locationModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setLocationModalOpen(false)}/>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 relative z-[80] shadow-2xl max-h-[90vh] overflow-y-auto">
               <button onClick={() => setLocationModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               
               <h2 className="text-3xl font-serif font-bold text-[#1B4D3E] mb-2">BeeCup Noktanı Seç</h2>
               <p className="text-gray-500 mb-8">Siparişini hazırlamamız için hangi otomatı kullanacağını seçmelisin.</p>

               <div className="grid gap-4">
                  {LOCATIONS.map((loc) => (
                    <div 
                      key={loc.id} 
                      onClick={() => selectLocation(loc)}
                      className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedLocation?.id === loc.id ? 'border-[#1B4D3E] bg-[#1B4D3E]/5' : 'border-gray-100 hover:border-[#1B4D3E]/30 hover:bg-gray-50'} ${loc.status === 'Bakımda' ? 'opacity-60' : ''}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedLocation?.id === loc.id ? 'bg-[#1B4D3E] text-white' : 'bg-[#F2F0E9] text-[#1B4D3E]'}`}>
                             <MapPin size={24}/>
                          </div>
                          <div>
                             <h4 className="font-bold text-lg text-[#1B4D3E]">{loc.name}</h4>
                             <p className="text-sm text-gray-500">{loc.area} • {loc.type} • <span className="text-[#1B4D3E] font-bold">{loc.distance}</span></p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${loc.status === 'Açık' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {loc.status}
                          </span>
                          <ChevronRight className={`text-gray-300 group-hover:text-[#1B4D3E] transition ${selectedLocation?.id === loc.id ? 'text-[#1B4D3E]' : ''}`}/>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LOGIN MODAL --- */}
      <AnimatePresence>
        {authOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAuthOpen(false)}/>
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className="bg-white w-full max-w-md rounded-[2rem] p-8 relative z-[80] shadow-2xl">
               <button onClick={() => setAuthOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X/></button>
               <div className="text-center mb-6">
                  <div className="flex justify-center mb-4"><BeeCupLogo/></div>
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
        {orderSuccess && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-[#1B4D3E]/95 backdrop-blur-md" />
             <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-[90] shadow-2xl text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                   <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#1B4D3E] mb-2">Sipariş Hazır!</h2>
                <p className="text-gray-500 text-sm mb-8">Ödemeniz alındı. Lütfen aşağıdaki kodu <br/> <span className="font-bold text-[#1B4D3E]">{selectedLocation?.name}</span> otomatına okutun.</p>
                
                <div className="bg-gray-900 p-4 rounded-3xl inline-block shadow-xl mb-6">
                   <div className="bg-white p-2 rounded-2xl">
                      {/* Fake QR Code */}
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BEECUP-${Math.random()}`} className="w-48 h-48 rounded-xl" alt="QR Code"/>
                   </div>
                </div>
                <p className="font-mono text-xl tracking-[0.2em] font-bold text-[#1B4D3E] mb-6">#8293</p>
                <button onClick={() => {setOrderSuccess(false); setCart([]); setSelectedLocation(null);}} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-3 rounded-xl font-bold">Tamamla</button>
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
              {cart.length > 0 && (
                <div className="p-6 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                   <div className="flex justify-between mb-4 text-xl font-black text-[#1B4D3E]"><span>Toplam</span><span>₺{totalAmount}</span></div>
                   <button onClick={handleCheckout} className="w-full bg-[#F4D03F] text-[#1B4D3E] py-4 rounded-xl font-bold hover:bg-[#e0c040] transition shadow-lg flex items-center justify-center gap-2">
                      SEPETİ ONAYLA <ArrowRight size={18}/>
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}