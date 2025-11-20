import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, ChevronRight, Star, X, Plus, Minus, 
  User, Menu, ArrowRight, Check, Leaf
} from 'lucide-react';

// --- DATA ---
const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", area: "Levent", distance: "120m", type: "Plaza Girişi", status: "Açık", stock: "Yüksek" },
  { id: 2, name: "Levent 199", area: "Levent", distance: "400m", type: "Ana Lobi", status: "Açık", stock: "Orta" },
  { id: 3, name: "Maslak 42", area: "Maslak", distance: "2.1km", type: "Ofis Katı", status: "Açık", stock: "Düşük" },
  { id: 4, name: "İTÜ Arı Teknokent", area: "Maslak", distance: "3.5km", type: "Kampüs", status: "Bakımda", stock: "Kapalı" },
];

const MENU = [
  { 
    id: 1, 
    name: "Somonlu Kinoa Bowl", 
    price: 155, 
    cal: 450, 
    cat: "Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&fit=crop", 
    desc: "Norveç somonu, avokado, edamame, susam, özel asya sos." 
  },
  { 
    id: 2, 
    name: "Izgara Tavuk Bowl", 
    price: 155, 
    cal: 420, 
    cat: "Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&fit=crop", 
    desc: "Organik tavuk, siyah pirinç, humus, mevsim yeşillikleri." 
  },
  { 
    id: 3, 
    name: "Humuslu Wrap", 
    price: 140, 
    cal: 390, 
    cat: "Wrap",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1200&fit=crop", 
    desc: "Ev yapımı humus, közlenmiş biber, roka, tam buğday lavaş." 
  },
  { 
    id: 4, 
    name: "Green Detox", 
    price: 70, 
    cal: 120, 
    cat: "İçecek",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=1200&fit=crop", 
    desc: "Yeşil elma, ıspanak, kereviz sapı, limon, zencefil." 
  },
  { 
    id: 5, 
    name: "Ege Salatası", 
    price: 140, 
    cal: 280, 
    cat: "Salata",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&fit=crop", 
    desc: "Ezine peyniri, organik domates, salatalık, kırma zeytin." 
  },
  { 
    id: 6, 
    name: "Fit Atıştırmalık", 
    price: 110, 
    cal: 250, 
    cat: "Snack",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1200&fit=crop", 
    desc: "Taze havuç, salatalık dilimleri, humus ve grissini." 
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cart, setCart] = useState([]);

  // Scroll Takibi
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sepet İşlemleri
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

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="bg-[#F9F8F4] text-[#1A3C34] min-h-screen selection:bg-[#1A3C34] selection:text-[#F4D03F]">
      
      {/* --- NAVBAR (Farmer's Fridge Style) --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-1 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
             <div className="w-10 h-10 bg-[#1A3C34] rounded-full flex items-center justify-center text-[#F4D03F] group-hover:rotate-12 transition-transform">
               <Leaf size={20} fill="currentColor"/>
             </div>
             <span className="text-3xl font-serif font-bold tracking-tight text-[#1A3C34]">BeeCup</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider">
             <a href="#menu" className="hover:text-[#C5A85F] transition-colors">MENÜ</a>
             <a href="#nasil" className="hover:text-[#C5A85F] transition-colors">NASIL ÇALIŞIR?</a>
             <a href="#misyon" className="hover:text-[#C5A85F] transition-colors">MİSYON</a>
             <button onClick={() => setLocationOpen(true)} className="hover:text-[#C5A85F] transition-colors">LOKASYONLAR</button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {selectedLocation ? (
                <div onClick={() => setLocationOpen(true)} className="hidden lg:flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-[#1A3C34]/5 hover:bg-[#1A3C34]/10 transition">
                   <MapPin size={16}/>
                   <span className="text-xs font-bold">{selectedLocation.name}</span>
                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
             ) : (
                <button 
                  onClick={() => setLocationOpen(true)}
                  className="hidden lg:flex items-center gap-2 bg-[#1A3C34] text-[#F9F8F4] px-6 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-[#2a5a4e] transition"
                >
                  OTOMAT BUL
                </button>
             )}

             <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-black/5 rounded-full transition">
                <ShoppingBag size={24}/>
                {cart.length > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-[#C5A85F] text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Giant Visual) --- */}
      <header className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
         <div className="max-w-[1440px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-10 order-2 lg:order-1">
               <h1 className="text-6xl md:text-8xl font-serif leading-[0.95] text-[#1A3C34]">
                  Gerçek yemek. <br/>
                  <span className="italic text-[#C5A85F]">Anında</span> seninle.
               </h1>
               <p className="text-xl text-[#1A3C34]/70 leading-relaxed max-w-md">
                  Plaza hayatının hızına yetişen, şeflerin hazırladığı taze kaseler. 
                  Sıra bekleme, QR okut, kapağı aç ve al.
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setLocationOpen(true)} className="bg-[#1A3C34] text-white px-10 py-4 rounded-full font-bold tracking-wider hover:scale-105 transition-transform shadow-xl">
                     EN YAKIN OTOMATI BUL
                  </button>
                  <button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})} className="bg-white border-2 border-[#1A3C34]/10 text-[#1A3C34] px-10 py-4 rounded-full font-bold tracking-wider hover:border-[#1A3C34] transition-colors">
                     MENÜYÜ GÖR
                  </button>
               </div>
               <div className="flex items-center gap-8 text-sm font-bold text-[#1A3C34]/60 pt-8">
                  <span className="flex items-center gap-2"><Check size={18} className="text-[#C5A85F]"/> Günlük Taze</span>
                  <span className="flex items-center gap-2"><Check size={18} className="text-[#C5A85F]"/> 0 Atık</span>
                  <span className="flex items-center gap-2"><Check size={18} className="text-[#C5A85F]"/> 7/24 Açık</span>
               </div>
            </div>

            <div className="relative order-1 lg:order-2">
               {/* Blob Background */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C5A85F]/10 rounded-full blur-3xl -z-10"></div>
               <img 
                 src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&fit=crop" 
                 alt="Fresh Bowl" 
                 className="w-full h-auto object-cover rounded-[3rem] shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-700"
               />
               {/* Floating Badge */}
               <div className="absolute bottom-10 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="flex gap-1 mb-2">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#C5A85F] text-[#C5A85F]"/>)}
                  </div>
                  <p className="text-xs font-medium text-gray-500">"Ofiste yediğim en taze öğün!"</p>
               </div>
            </div>

         </div>
      </header>

      {/* --- MENU SECTION (Huge Cards) --- */}
      <section id="menu" className="py-32 bg-white">
         <div className="max-w-[1440px] mx-auto px-6">
            <div className="text-center mb-20">
               <span className="text-[#C5A85F] font-bold tracking-[0.2em] text-xs uppercase">06:00'DA ÜRETİLDİ</span>
               <h2 className="text-5xl md:text-6xl font-serif mt-4 mb-6 text-[#1A3C34]">Dolapta Neler Var?</h2>
               <div className="flex flex-wrap justify-center gap-4">
                  {["Tümü", "Bowl", "Salata", "Wrap", "İçecek"].map(cat => (
                     <button key={cat} className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-[#1A3C34] hover:text-white transition-colors">
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {MENU.map(item => (
                  <div key={item.id} className="group cursor-pointer">
                     <div className="relative h-[450px] w-full overflow-hidden rounded-[2.5rem] mb-6 bg-[#F9F8F4]">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {/* Overlay Button */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <button 
                             onClick={() => addToCart(item)}
                             className="bg-white text-[#1A3C34] px-8 py-4 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#C5A85F]"
                           >
                              SEPETE EKLE - {item.price}₺
                           </button>
                        </div>
                        <span className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-[#1A3C34] uppercase">
                           {item.cat}
                        </span>
                     </div>
                     <div className="text-center px-4">
                        <h3 className="text-2xl font-serif font-bold text-[#1A3C34] mb-2">{item.name}</h3>
                        <p className="text-[#1A3C34]/60 text-sm leading-relaxed">{item.desc}</p>
                        <div className="mt-4 inline-block border-b border-[#C5A85F] pb-0.5 text-xs font-bold text-[#C5A85F] tracking-widest">
                           {item.cal} KCAL
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- HOW IT WORKS (Step by Step) --- */}
      <section id="nasil" className="py-32 bg-[#1A3C34] text-[#F9F8F4] overflow-hidden">
         <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
               <div className="absolute -inset-10 bg-[#C5A85F]/20 rounded-full blur-[80px]"></div>
               <img src="https://images.unsplash.com/photo-1595853035070-59a39fe84de3?q=80&w=1000&fit=crop" className="relative z-10 rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700" />
            </div>
            <div className="space-y-12">
               <h2 className="text-5xl md:text-7xl font-serif">
                  Sıra Yok.<br/> Kasa Yok.<br/> <span className="text-[#C5A85F] italic">Sadece Lezzet.</span>
               </h2>
               <div className="space-y-8">
                  <div className="flex gap-6">
                     <span className="text-5xl font-serif text-[#C5A85F]/40">01</span>
                     <div>
                        <h4 className="text-xl font-bold mb-2">Uygulamadan Seç</h4>
                        <p className="text-white/60 leading-relaxed">Ofiste, yolda veya evde menüye göz at. Stokları canlı gör, siparişini oluştur.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <span className="text-5xl font-serif text-[#C5A85F]/40">02</span>
                     <div>
                        <h4 className="text-xl font-bold mb-2">QR Kodunu Okut</h4>
                        <p className="text-white/60 leading-relaxed">Otomatın başına gel, uygulamadaki QR kodunu okuyucuya göster.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <span className="text-5xl font-serif text-[#C5A85F]/40">03</span>
                     <div>
                        <h4 className="text-xl font-bold mb-2">Kapağı Aç ve Al</h4>
                        <p className="text-white/60 leading-relaxed">Kapak otomatik açılır. Yemeğini al, afiyet olsun. Kabı geri getirmeyi unutma!</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- LOCATIONS DRAWER (Farmer's Fridge Style Sidebar) --- */}
      {locationOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
           <div className="absolute inset-0 bg-[#1A3C34]/60 backdrop-blur-sm" onClick={() => setLocationOpen(false)}></div>
           <div className="relative w-full md:w-[500px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
              <div className="p-8 border-b flex justify-between items-center bg-[#1A3C34] text-white">
                 <h2 className="text-2xl font-serif">Lokasyonlar</h2>
                 <button onClick={() => setLocationOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-[#F9F8F4]">
                 {LOCATIONS.map(loc => (
                    <div 
                      key={loc.id} 
                      onClick={() => { setSelectedLocation(loc); setLocationOpen(false); }}
                      className={`p-6 rounded-2xl bg-white shadow-sm border-2 cursor-pointer transition-all hover:border-[#1A3C34] group ${selectedLocation?.id === loc.id ? 'border-[#1A3C34]' : 'border-transparent'}`}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg text-[#1A3C34]">{loc.name}</h4>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${loc.status === 'Açık' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{loc.status}</span>
                       </div>
                       <p className="text-sm text-gray-500 mb-4">{loc.area} • {loc.type}</p>
                       <div className="flex items-center gap-4 text-xs font-bold text-[#1A3C34]/60">
                          <span className="flex items-center gap-1"><MapPin size={14}/> {loc.distance}</span>
                          <span className="flex items-center gap-1">Stok: <span className={loc.stock === 'Yüksek' ? 'text-green-600' : 'text-orange-500'}>{loc.stock}</span></span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* --- CART DRAWER --- */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
           <div className="absolute inset-0 bg-[#1A3C34]/60 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
           <div className="relative w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
              <div className="p-8 border-b flex justify-between items-center">
                 <h2 className="text-2xl font-serif text-[#1A3C34]">Sepetim ({cart.length})</h2>
                 <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                       <ShoppingBag size={48} className="mb-4"/>
                       <p>Henüz bir şey eklemedin.</p>
                    </div>
                 ) : (
                    cart.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                          <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1">
                             <h4 className="font-bold text-[#1A3C34]">{item.name}</h4>
                             <p className="text-sm text-gray-500">₺{item.price}</p>
                          </div>
                          <span className="font-bold text-[#1A3C34]">x{item.qty}</span>
                       </div>
                    ))
                 )}
              </div>
              <div className="p-8 bg-[#F9F8F4]">
                 <div className="flex justify-between mb-6 text-xl font-bold text-[#1A3C34]">
                    <span>Toplam</span>
                    <span>₺{totalAmount}</span>
                 </div>
                 <button className="w-full bg-[#1A3C34] text-white py-4 rounded-full font-bold tracking-wider hover:bg-[#2a5a4e] transition">
                    ÖDEMEYE GEÇ
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1A3C34] text-white py-20 border-t border-white/10">
         <div className="max-w-[1440px] mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-8">
               <div className="w-8 h-8 bg-[#F4D03F] rounded-full flex items-center justify-center text-[#1A3C34]"><Leaf size={16} fill="currentColor"/></div>
               <span className="text-2xl font-serif font-bold">BeeCup</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest text-white/60 mb-12">
               <a href="#" className="hover:text-white">KURUMSAL</a>
               <a href="#" className="hover:text-white">KARİYER</a>
               <a href="#" className="hover:text-white">GİZLİLİK</a>
               <a href="#" className="hover:text-white">İLETİŞİM</a>
            </div>
            <p className="text-xs text-white/30">&copy; 2025 BeeCup Smart Vending.</p>
         </div>
      </footer>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}