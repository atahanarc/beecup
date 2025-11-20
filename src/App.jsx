import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, ChevronRight, Star, X, Plus, Minus, 
  User, Menu, ArrowRight, Leaf, Search, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FARMER'S FRIDGE TARZI KATEGORİLER ---
const CATEGORIES_DISPLAY = [
  { id: "BOWLS", label: "Bowls", color: "bg-orange-100", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&fit=crop" },
  { id: "SALADS", label: "Salatalar", color: "bg-green-100", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop" },
  { id: "WRAPS", label: "Dürümler", color: "bg-yellow-100", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=400&fit=crop" },
  { id: "SNACKS", label: "Atıştırmalık", color: "bg-blue-100", img: "https://images.unsplash.com/photo-1599599810653-d8d080f043e9?q=80&w=400&fit=crop" },
];

// --- 25+ ÜRÜN VERİSİ ---
const MENU_ITEMS = [
  // BOWLS
  { id: 1, name: "Somonlu Kinoa", price: 155, cal: 450, cat: "BOWLS", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&fit=crop" },
  { id: 2, name: "Izgara Tavuk", price: 155, cal: 420, cat: "BOWLS", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop" },
  { id: 3, name: "Vegan Falafel", price: 155, cal: 380, cat: "BOWLS", image: "https://images.unsplash.com/photo-1606787366810-ce444e69ce73?q=80&w=800&fit=crop" },
  { id: 4, name: "Asya Usulü", price: 160, cal: 440, cat: "BOWLS", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=800&fit=crop" },
  { id: 5, name: "Köfteli Protein", price: 165, cal: 510, cat: "BOWLS", image: "https://images.unsplash.com/photo-1541544719255-c6cdcdcd07c9?q=80&w=800&fit=crop" },
  // SALADS
  { id: 6, name: "Ege Salatası", price: 140, cal: 280, cat: "SALADS", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&fit=crop" },
  { id: 7, name: "Sezar Salata", price: 145, cal: 350, cat: "SALADS", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=800&fit=crop" },
  { id: 8, name: "Hellim & Ceviz", price: 140, cal: 330, cat: "SALADS", image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e2f?q=80&w=800&fit=crop" },
  { id: 9, name: "Ton Balıklı", price: 150, cal: 310, cat: "SALADS", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&fit=crop" },
  { id: 10, name: "Buğdaylı Mercimek", price: 135, cal: 290, cat: "SALADS", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&fit=crop" },
  // WRAPS
  { id: 11, name: "Humuslu Wrap", price: 140, cal: 390, cat: "WRAPS", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&fit=crop" },
  { id: 12, name: "Acılı Tavuk", price: 140, cal: 420, cat: "WRAPS", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&fit=crop" },
  { id: 13, name: "Dana Füme", price: 150, cal: 410, cat: "WRAPS", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&fit=crop" },
  { id: 14, name: "Sebzeli Gökkuşağı", price: 135, cal: 320, cat: "WRAPS", image: "https://images.unsplash.com/photo-1584650554177-5a1b0211a2eb?q=80&w=800&fit=crop" },
  // SNACKS
  { id: 15, name: "Fit Humus", price: 110, cal: 180, cat: "SNACKS", image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&fit=crop" },
  { id: 16, name: "Granola Yoğurt", price: 90, cal: 220, cat: "SNACKS", image: "https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=800&fit=crop" },
  { id: 17, name: "Çiğ Kuruyemiş", price: 120, cal: 300, cat: "SNACKS", image: "https://images.unsplash.com/photo-1599599810653-d8d080f043e9?q=80&w=800&fit=crop" },
];

const LOCATIONS = [
  { name: "Kanyon AVM", area: "Levent", status: "Açık", stock: "Yüksek" },
  { name: "Levent 199", area: "Levent", status: "Açık", stock: "Orta" },
  { name: "Maslak 42", area: "Maslak", status: "Açık", stock: "Düşük" },
  { name: "İTÜ Arı Teknokent", area: "Maslak", status: "Bakımda", stock: "Kapalı" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item) => {
    if (!selectedLocation) { setLocationOpen(true); return; }
    setCart(prev => [...prev, item]);
    setCartOpen(true);
  };

  const filteredItems = selectedCat === "ALL" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.cat === selectedCat);
  const totalAmount = cart.reduce((a, b) => a + b.price, 0);

  return (
    <div className="min-h-screen bg-fridge-cream font-sans text-fridge-green">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-fridge-green text-white py-3' : 'bg-fridge-green text-white py-5'}`}>
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
               <div className="bg-[#6cc24a] p-1.5 rounded-full"><Leaf size={20} fill="white" className="text-white"/></div>
               <span className="text-2xl font-serif font-bold tracking-tight">BeeCup</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-bold tracking-wide">
               <a href="#menu" className="hover:text-[#6cc24a] transition">MENÜ</a>
               <button onClick={() => setLocationOpen(true)} className="hover:text-[#6cc24a] transition">LOKASYONLAR</button>
               <a href="#misyon" className="hover:text-[#6cc24a] transition">HİKAYEMİZ</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* LOCATION PICKER */}
             <div onClick={() => setLocationOpen(true)} className="hidden lg:flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <MapPin size={16}/>
                <span className="text-xs font-bold uppercase tracking-wider">
                   {selectedLocation ? selectedLocation.name : "OTOMAT BUL"}
                </span>
             </div>
             
             <button className="font-bold text-sm hover:text-[#6cc24a]">GİRİŞ YAP</button>
             
             <button onClick={() => setCartOpen(true)} className="relative bg-[#6cc24a] p-2 rounded-full text-fridge-green hover:scale-105 transition">
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <div className="relative bg-fridge-green text-white pt-32 pb-20 px-6 text-center">
         <h1 className="text-5xl md:text-7xl font-serif mb-6">Şeflerin Hazırladığı <br/> Günlük Taze Yemekler</h1>
         <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">
            Plazanızın lobisinde, 7/24 ulaşılabilir akıllı otomatlarda. Sıra yok, bekleme yok.
         </p>
         <button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})} className="bg-[#6cc24a] text-fridge-green px-8 py-3 rounded-full font-bold tracking-wider hover:bg-white transition shadow-lg">
            MENÜYÜ GÖR
         </button>
      </div>

      {/* --- CATEGORY CARDS (FARMER'S FRIDGE STYLE) --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES_DISPLAY.map((cat) => (
               <motion.div 
                 key={cat.id} 
                 whileHover={{ y: -5 }}
                 onClick={() => setSelectedCat(cat.id)}
                 className={`${cat.color} rounded-3xl p-6 text-center cursor-pointer shadow-lg border-4 border-white`}
               >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-md border-2 border-white">
                     <img src={cat.img} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-fridge-green tracking-wide uppercase text-sm">{cat.label}</h3>
               </motion.div>
            ))}
         </div>
      </div>

      {/* --- MENU GRID --- */}
      <section id="menu" className="py-20 px-6 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-serif text-fridge-green">{selectedCat === "ALL" ? "Tüm Lezzetler" : selectedCat}</h2>
            <button onClick={() => setSelectedCat("ALL")} className="text-sm font-bold underline text-[#6cc24a]">Hepsini Gör</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
               <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100">
                  <div className="relative h-60 overflow-hidden">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                     {selectedLocation && <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-[10px] font-bold text-green-700 shadow-sm flex items-center gap-1"><Check size={10}/> STOKTA</div>}
                  </div>
                  <div className="p-5">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight text-fridge-green">{item.name}</h3>
                        <span className="font-serif font-bold text-lg text-[#6cc24a]">{item.price}₺</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4">
                        <span>{item.cal} kcal</span> • <span>4°C Taze</span>
                     </div>
                     <button onClick={() => addToCart(item)} className="w-full bg-fridge-cream border border-fridge-green text-fridge-green py-2.5 rounded-xl font-bold text-xs hover:bg-fridge-green hover:text-white transition">
                        SEPETE EKLE
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- LOCATIONS DRAWER --- */}
      <AnimatePresence>
         {locationOpen && (
            <div className="fixed inset-0 z-[60] flex justify-end">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-fridge-green/60 backdrop-blur-sm" onClick={() => setLocationOpen(false)}/>
               <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="relative w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col">
                  <div className="p-6 border-b bg-fridge-green text-white flex justify-between items-center">
                     <h2 className="font-serif text-xl">Lokasyonlar</h2>
                     <button onClick={() => setLocationOpen(false)}><X/></button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto bg-fridge-cream space-y-4">
                     {LOCATIONS.map(loc => (
                        <div key={loc.name} onClick={() => { setSelectedLocation(loc); setLocationOpen(false); }} className={`p-4 bg-white border rounded-xl cursor-pointer hover:border-[#6cc24a] group ${selectedLocation?.name === loc.name ? 'border-[#6cc24a] ring-1 ring-[#6cc24a]' : 'border-gray-200'}`}>
                           <div className="flex justify-between items-start">
                              <h4 className="font-bold text-fridge-green">{loc.name}</h4>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded ${loc.status === 'Açık' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{loc.status}</span>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">{loc.area} • {loc.type}</p>
                           <div className="mt-3 text-xs font-bold text-gray-400 flex items-center gap-2 group-hover:text-[#6cc24a]">
                              <MapPin size={14}/> Seçmek için tıkla
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
         {cartOpen && (
            <div className="fixed inset-0 z-[60] flex justify-end">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-fridge-green/60 backdrop-blur-sm" onClick={() => setCartOpen(false)}/>
               <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="relative w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center">
                     <h2 className="font-serif text-xl text-fridge-green">Sepetim ({cart.length})</h2>
                     <button onClick={() => setCartOpen(false)}><X/></button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                     {cart.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                           <img src={item.image} className="w-16 h-16 rounded-lg object-cover"/>
                           <div className="flex-1">
                              <h4 className="font-bold text-sm text-fridge-green">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.price} ₺</p>
                           </div>
                        </div>
                     ))}
                     {cart.length === 0 && <p className="text-center text-gray-400 mt-10">Sepet boş.</p>}
                  </div>
                  <div className="p-6 bg-fridge-cream border-t">
                     <button className="w-full bg-fridge-green text-white py-3 rounded-full font-bold tracking-wider hover:bg-[#2a4a3e] transition">
                        ÖDEMEYE GEÇ (₺{totalAmount})
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
}