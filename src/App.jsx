import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Leaf, ArrowRight, Star, Menu, X, 
  ChevronRight, MapPin, Send, Sparkles, Plus, Minus
} from 'lucide-react';

// --- PREMİUM DATA (RAPORUNDAN) ---
const MENU_ITEMS = [
  { id: 1, name: "Somonlu Kinoa Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop", desc: "Norveç somonu, avokado, kinoa, edamame fasulyesi.", badge: "ŞEFİN SEÇİMİ" },
  { id: 2, name: "Humuslu Tavuk Wrap", category: "Wrap", price: 140, cal: 390, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1200&auto=format&fit=crop", desc: "Ev yapımı humus, ızgara tavuk, közlenmiş biber.", badge: "POPÜLER" },
  { id: 3, name: "Ege Usulü Salata", category: "Salata", price: 140, cal: 280, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop", desc: "Ezine peyniri, kırma zeytin, organik domates.", badge: "VEGAN" },
  { id: 4, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop", desc: "Yeşil elma, ıspanak, zencefil, limon.", badge: "DETOX" }
];

// --- MODERN UI COMPONENTS ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ role: 'system', text: "Merhaba! Ben BeeCoach. Bugün moduna göre ne yemek istersin?" }]);

  // Scroll Efekti
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Logic
  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);

  return (
    <div className="font-sans text-[#1a1a1a] bg-[#F9F8F4] selection:bg-[#1B4D3E] selection:text-white">
      
      {/* FONT YÜKLEME (Google Fonts) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* --- NAVBAR (Floating & Glass) --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isScrolled ? 'bg-[#1B4D3E] text-white' : 'bg-white text-[#1B4D3E]'}`}>
              <Leaf size={20} />
            </div>
            <span className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-500 ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}>BeeCup</span>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-widest transition-colors duration-500 ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
            {['HİKAYEMİZ', 'MENÜ', 'TEKNOLOJİ', 'SÜRDÜRÜLEBİLİRLİK'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#EAB308] transition-colors relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#EAB308] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
             <button onClick={() => setAiOpen(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isScrolled ? 'border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white' : 'border-white/30 text-white hover:bg-white hover:text-[#1B4D3E]'}`}>
               <Sparkles size={16}/> <span className="text-xs font-bold">AI COACH</span>
             </button>
             <button onClick={() => setCartOpen(true)} className="relative group">
                <ShoppingBag size={24} className={`transition-colors ${isScrolled ? 'text-[#1B4D3E]' : 'text-white'}`}/>
                {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#EAB308] text-[#1B4D3E] text-[10px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Cinematic) --- */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/40 z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
             className="w-full h-full object-cover scale-110 animate-[subtleZoom_20s_infinite_alternate]" 
             alt="Hero Food"
           />
        </div>
        
        <div className="relative z-20 text-center text-white max-w-4xl px-6">
           <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium tracking-[0.2em] mb-6 backdrop-blur-sm">OFİSİNİZDEKİ GURME MOLA</span>
           <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight mb-8">
             Doğal. Taze. <br/> <i className="text-[#EAB308]">Ulaşılabilir.</i>
           </h1>
           <p className="text-lg md:text-xl text-gray-200 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
             Plazanızın lobisinde, şeflerin hazırladığı günlük taze bowl ve salatalar. 
             Sıra yok. Beklemek yok. Sadece iyi yemek var.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => document.getElementById('menu').scrollIntoView()} className="bg-[#EAB308] text-[#1B4D3E] px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-yellow-500/20">
                 MENÜYÜ İNCELE
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white hover:text-[#1B4D3E] transition-all duration-300">
                 NASIL ÇALIŞIR?
              </button>
           </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full"></div>
           </div>
        </div>
      </header>

      {/* --- STORY SECTION --- */}
      <section className="py-24 px-6 bg-[#F9F8F4]">
         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200&auto=format&fit=crop" className="rounded-[40px] shadow-2xl w-full object-cover h-[600px]" />
               <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl max-w-xs hidden lg:block">
                  <p className="font-serif text-2xl text-[#1B4D3E] italic">"06:00"</p>
                  <p className="text-gray-500 text-sm mt-2">Her sabah üretim saatimiz. 24 saat içinde tüketilmezse raftan kalkar.</p>
               </div>
            </div>
            <div className="space-y-8">
               <h2 className="text-4xl md:text-5xl font-serif text-[#1B4D3E] leading-tight">
                  Teknoloji ve Toprağın <br/> Mükemmel Uyumu.
               </h2>
               <p className="text-gray-600 leading-relaxed text-lg">
                  BeeCup, sadece bir otomat değil. O, yerel üreticilerden alınan en taze malzemeleri, yapay zeka destekli stok yönetimiyle buluşturan bir ekosistem. Plastik yok, atık yok, bahane yok.
               </p>
               <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                     <h3 className="text-3xl font-serif text-[#1B4D3E] mb-2">%100</h3>
                     <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Geri Dönüştürülebilir</p>
                  </div>
                  <div>
                     <h3 className="text-3xl font-serif text-[#1B4D3E] mb-2">4°C</h3>
                     <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Sabit Tazelik Isısı</p>
                  </div>
               </div>
               <button className="text-[#1B4D3E] font-bold text-sm border-b border-[#1B4D3E] pb-1 hover:text-[#EAB308] hover:border-[#EAB308] transition-colors">HİKAYEMİZİ OKU</button>
            </div>
         </div>
      </section>

      {/* --- MENU GRID (IMPACTFUL) --- */}
      <section id="menu" className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <span className="text-[#EAB308] font-bold tracking-[0.2em] text-xs uppercase block mb-4">MEVSİMSEL LEZZETLER</span>
               <h2 className="text-5xl font-serif text-[#1B4D3E]">Bu Ayın Favorileri</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {MENU_ITEMS.map((item) => (
                  <div key={item.id} className="group relative">
                     <div className="h-[400px] rounded-[32px] overflow-hidden relative bg-gray-100 cursor-pointer">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        <div className="absolute top-4 left-4">
                           <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">{item.badge}</span>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                           <h3 className="text-white font-serif text-2xl mb-1">{item.name}</h3>
                           <div className="flex items-center gap-3 text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                              <span>{item.cal} kcal</span>
                              <span>•</span>
                              <span>{item.price} TL</span>
                           </div>
                           <button onClick={() => addToCart(item)} className="w-full bg-white text-[#1B4D3E] py-3 rounded-xl font-bold text-sm hover:bg-[#EAB308] transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 translate-y-4 group-hover:translate-y-0">
                              SEPETE EKLE
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- APP PROMO (FULL WIDTH) --- */}
      <section className="py-24 bg-[#1B4D3E] relative overflow-hidden text-white">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EAB308]/10 blur-[100px] rounded-full"></div>
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
               <h2 className="text-5xl md:text-6xl font-serif leading-tight">
                  Ofis Hayatını <br/> <span className="text-[#EAB308]">Kolaylaştır.</span>
               </h2>
               <ul className="space-y-6">
                  {[
                     { title: "QR ile Temassız Öde", desc: "Cüzdan taşımana gerek yok. Telefonunu okut ve kapağı aç." },
                     { title: "Stokları Canlı İzle", desc: "Ofise gelmeden favori yemeğin kalmış mı kontrol et." },
                     { title: "Puan Kazan", desc: "Yediğin kabı geri getir, sürdürülebilirlik puanlarını topla." }
                  ].map((feat, i) => (
                     <li key={i} className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#EAB308] font-serif text-xl italic">{i+1}</div>
                        <div>
                           <h4 className="font-bold text-lg">{feat.title}</h4>
                           <p className="text-gray-300 text-sm leading-relaxed">{feat.desc}</p>
                        </div>
                     </li>
                  ))}
               </ul>
               <div className="flex gap-4 pt-6">
                  <button className="bg-white text-[#1B4D3E] px-8 py-3 rounded-full font-bold hover:bg-[#EAB308] transition-colors">APP STORE</button>
                  <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">GOOGLE PLAY</button>
               </div>
            </div>
            <div className="relative flex justify-center">
               <div className="relative z-10 w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-4 ring-white/10 rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                  <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                     <span className="font-serif text-2xl italic">BeeCup App</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#181818] text-white pt-24 pb-12">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
               <div className="col-span-1 md:col-span-2">
                  <span className="text-3xl font-serif font-bold text-white mb-6 block">BeeCup</span>
                  <p className="text-gray-500 max-w-sm text-lg font-light">
                     Geleceğin ofis beslenme alışkanlığını tasarlıyoruz. Sağlıklı, hızlı ve gezegen dostu.
                  </p>
               </div>
               <div>
                  <h5 className="font-bold tracking-widest text-xs text-[#EAB308] mb-6">KURUMSAL</h5>
                  <ul className="space-y-4 text-gray-400 font-light">
                     <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
                     <li><a href="#" className="hover:text-white transition">Kariyer</a></li>
                     <li><a href="#" className="hover:text-white transition">Yatırımcı İlişkileri</a></li>
                  </ul>
               </div>
               <div>
                  <h5 className="font-bold tracking-widest text-xs text-[#EAB308] mb-6">İLETİŞİM</h5>
                  <ul className="space-y-4 text-gray-400 font-light">
                     <li>Levent 199, İstanbul</li>
                     <li>hello@beecup.co</li>
                     <li>+90 212 000 00 00</li>
                  </ul>
               </div>
            </div>
            <div className="text-center text-gray-600 text-sm">
               &copy; 2025 BeeCup Smart Vending Technologies. All rights reserved.
            </div>
         </div>
      </footer>

      {/* --- SIDEBARS (MODALS) --- */}

      {/* CART DRAWER */}
      <div className={`fixed inset-0 z-[60] ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
         <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setCartOpen(false)}></div>
         <div className={`absolute top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl transition-transform duration-500 ease-out transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
            <div className="p-8 flex justify-between items-center border-b border-gray-100">
               <h2 className="text-3xl font-serif text-[#1B4D3E]">Sepetim</h2>
               <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
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
                        <div className="font-bold text-lg">x{item.qty}</div>
                     </div>
                  ))
               )}
            </div>
            {cart.length > 0 && (
               <div className="p-8 bg-[#F9F8F4]">
                  <div className="flex justify-between mb-6 text-xl font-serif font-bold text-[#1B4D3E]">
                     <span>Toplam</span>
                     <span>₺{total}</span>
                  </div>
                  <button className="w-full bg-[#1B4D3E] text-white py-4 rounded-xl font-bold tracking-wide hover:bg-[#143d30] transition">ÖDEMEYE GEÇ</button>
               </div>
            )}
         </div>
      </div>

      {/* AI ASSISTANT MODAL */}
      {aiOpen && (
         <div className="fixed bottom-8 right-8 z-[60] w-[350px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-[#1B4D3E] p-4 text-white flex justify-between items-center">
               <div className="flex items-center gap-2"><Sparkles size={16}/> <span className="font-bold">BeeCoach</span></div>
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
               <input className="flex-1 bg-gray-100 rounded-full px-4 text-sm outline-none" placeholder="Yaz..." />
               <button className="p-2 bg-[#1B4D3E] text-white rounded-full"><Send size={16}/></button>
            </div>
         </div>
      )}

    </div>
  );
}