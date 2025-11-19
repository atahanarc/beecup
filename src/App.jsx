import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Leaf, Plus, Minus, ArrowRight, Recycle, 
  X, Sparkles, Send, MapPin, ChevronRight, User, 
  LogOut, Star, Menu, Search
} from 'lucide-react';

// --- API AYARLARI ---
const apiKey = ""; // API Key buraya

// --- DATA ---
const VENDING_MACHINES = [
  { id: 1, name: "Kanyon AVM", type: "Plaza", status: "Open" },
  { id: 2, name: "Levent 199", type: "Plaza", status: "Open" },
  { id: 3, name: "Maslak 42", type: "Plaza", status: "Open" },
];

const MENU_ITEMS = [
  { id: 1, name: "Superfood Bowl", category: "Bowl", price: 155, cal: 450, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", description: "Kinoa, avokado, haşlanmış nohut ve özel sos.", tags: ["Popüler"] },
  { id: 2, name: "Izgara Tavuklu Bowl", category: "Bowl", price: 155, cal: 520, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", description: "Izgara tavuk göğsü, siyah pirinç.", tags: ["Doyurucu"] },
  { id: 3, name: "Akdeniz Salata", category: "Salata", price: 140, cal: 320, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80", description: "Ezine peyniri, zeytin, çeri domates.", tags: ["Hafif"] },
  { id: 4, name: "Spicy Chicken Wrap", category: "Wrap", price: 140, cal: 480, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80", description: "Acılı tavuk, meksika fasulyesi, cheddar.", tags: ["Sıcak"] },
  { id: 5, name: "Fit Atıştırmalık", category: "Atıştırmalık", price: 110, cal: 250, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=800&q=80", description: "Havuç, salatalık ve humus.", tags: ["Vegan"] },
  { id: 6, name: "Green Detox", category: "İçecek", price: 70, cal: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", description: "Yeşil elma, ıspanak, limon.", tags: ["Detox"] },
];

const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

// --- GEMINI AI FONKSİYONU ---
async function generateGeminiResponse(prompt) {
  try {
    // Mock Response (API Key yoksa hata vermesin diye)
    if (!apiKey) return new Promise(r => setTimeout(() => r("Harika bir seçim! Bu ürün hem lezzetli hem de besleyici. Sepetine eklememi ister misin? 🥗"), 1000));
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Bağlantı hatası.";
  } catch (error) { return "Şu an cevap veremiyorum."; }
}

// --- ANA UYGULAMA ---
export default function App() {
  // State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [userPoints, setUserPoints] = useState(1250);
  const [notification, setNotification] = useState(null);
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Selam! Ben BeeCoach 🐝. Bugün ne yemek istersin?' }]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Effects
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isAIOpen]);

  // Helpers
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
    showNotification(`${item.name} eklendi!`);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);
    const response = await generateGeminiResponse(userMsg);
    setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-gray-800 selection:bg-[#F4D03F] selection:text-black relative overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
             <div className="w-10 h-10 bg-[#F4D03F] rounded-xl flex items-center justify-center text-white shadow-sm hover:rotate-12 transition">
               <Leaf className="text-black" size={20} />
             </div>
             <span className="text-2xl font-black text-[#3A7D44] tracking-tight">BeeCup</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
             {['MENÜ', 'LOKASYONLAR', 'SÜRDÜRÜLEBİLİRLİK'].map(item => (
               <a key={item} href="#" className="text-xs font-bold text-gray-500 hover:text-[#3A7D44] tracking-widest transition">{item}</a>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-[#F2F0E9] px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition" onClick={() => setIsProfileOpen(true)}>
                <Leaf size={16} className="text-[#3A7D44]"/>
                <span className="font-bold text-sm text-[#3A7D44]">{userPoints} P</span>
             </div>
             <button className="relative p-2 hover:bg-gray-100 rounded-full transition" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={24} className="text-gray-700"/>
                {cart.length > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-[#3A7D44] text-white text-xs flex items-center justify-center rounded-full font-bold border-2 border-white">{cart.length}</span>}
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-16 px-6 bg-white">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
               <div className="inline-flex items-center gap-2 bg-[#F2F0E9] text-[#3A7D44] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  <Sparkles size={14}/> Levent & Maslak'ta Yayında
               </div>
               <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#1F2937]">
                  Akıllı Otomat.<br/><span className="text-[#3A7D44]">Gerçek Lezzet.</span>
               </h1>
               <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                  Sıra bekleme, QR okut ve al. Şeflerin hazırladığı günlük taze bowl ve salatalar şimdi ofisinde.
               </p>
               <div className="flex gap-4 pt-2">
                  <button onClick={() => document.getElementById('menu').scrollIntoView({behavior:'smooth'})} className="bg-[#3A7D44] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition shadow-xl shadow-green-900/20 flex items-center gap-2">
                     Siparişe Başla <ArrowRight size={20}/>
                  </button>
               </div>
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
               <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Hero"/>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                  <div className="text-white">
                     <p className="font-bold text-2xl">Somonlu Kinoa Bowl</p>
                     <div className="flex items-center gap-2 mt-2 text-sm opacity-90"><Star size={16} className="fill-yellow-400 text-yellow-400"/> 4.9 (120+ Değerlendirme)</div>
                  </div>
               </div>
            </div>
         </div>
      </header>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-20 max-w-7xl mx-auto px-6">
         <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
               <h2 className="text-4xl font-black text-[#1F2937] mb-4">Menüyü Keşfet</h2>
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {CATEGORIES.map(cat => (
                     <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-[#3A7D44] text-white shadow-lg shadow-green-900/20' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#3A7D44]'}`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_ITEMS.filter(i => selectedCategory === "Tümü" || i.category === selectedCategory).map(item => (
               <div key={item.id} className="group bg-white p-4 rounded-[2rem] border border-gray-100 hover:border-[#3A7D44]/30 hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100">
                     <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={item.name}/>
                     <button onClick={() => addToCart(item)} className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#3A7D44] hover:text-white transition group-hover:scale-110">
                        <Plus size={20}/>
                     </button>
                     {item.tags[0] && <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">{item.tags[0]}</span>}
                  </div>
                  <div className="px-2">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[#1F2937]">{item.name}</h3>
                        <span className="text-lg font-black text-[#3A7D44]">₺{item.price}</span>
                     </div>
                     <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{item.description}</p>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <span className="bg-[#F2F0E9] text-[#3A7D44] px-2 py-1 rounded-md">{item.cal} kcal</span>
                        <span>• Günlük Taze</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- SIDEBARS & MODALS --- */}

      {/* 1. CART DRAWER (Sağdan Kayan Sepet) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
         <div className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
               <h2 className="text-2xl font-black text-[#1F2937]">Sepetim ({cart.length})</h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                     <ShoppingBag size={64} className="opacity-20"/>
                     <p className="font-medium">Sepetin henüz boş.</p>
                     <button onClick={() => setIsCartOpen(false)} className="text-[#3A7D44] font-bold hover:underline">Menüye Dön</button>
                  </div>
               ) : (
                  cart.map(item => (
                     <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-gray-100" alt={item.name}/>
                        <div className="flex-1">
                           <h4 className="font-bold text-[#1F2937]">{item.name}</h4>
                           <p className="text-[#3A7D44] font-bold text-sm">₺{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-[#F2F0E9] rounded-lg p-1">
                           <button onClick={() => item.quantity > 1 ? updateQty(item.id, -1) : removeFromCart(item.id)} className="p-1 hover:bg-white rounded-md shadow-sm transition"><Minus size={14}/></button>
                           <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                           <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded-md shadow-sm transition"><Plus size={14}/></button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {cart.length > 0 && (
               <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between mb-4 text-lg font-bold text-[#1F2937]">
                     <span>Toplam</span>
                     <span>₺{totalAmount}</span>
                  </div>
                  <button className="w-full bg-[#3A7D44] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg flex items-center justify-center gap-2">
                     Ödemeye Geç <ChevronRight/>
                  </button>
               </div>
            )}
         </div>
      </div>

      {/* 2. AI CHAT WIDGET (Sağ Alt Floating) */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
         {isAIOpen && (
            <div className="bg-white w-[350px] h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right">
               <div className="p-4 bg-[#3A7D44] text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Sparkles size={16}/></div>
                     <span className="font-bold">BeeCoach AI</span>
                  </div>
                  <button onClick={() => setIsAIOpen(false)} className="hover:bg-white/20 p-1 rounded"><X size={18}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F2F0E9]">
                  {chatMessages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#3A7D44] text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                           {msg.text}
                        </div>
                     </div>
                  ))}
                  {isChatLoading && <div className="text-xs text-gray-400 ml-2">BeeCoach yazıyor...</div>}
                  <div ref={chatEndRef}></div>
               </div>
               <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                  <input 
                     className="flex-1 bg-gray-100 rounded-full px-4 text-sm outline-none focus:ring-2 focus:ring-[#3A7D44]/50"
                     placeholder="Örn: Düşük kalorili ne var?"
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="w-10 h-10 bg-[#3A7D44] rounded-full flex items-center justify-center text-white hover:scale-105 transition"><Send size={18}/></button>
               </div>
            </div>
         )}
         <button onClick={() => setIsAIOpen(!isAIOpen)} className="w-16 h-16 bg-[#1F2937] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition hover:bg-[#3A7D44] group">
            {isAIOpen ? <X size={32}/> : <Sparkles size={32} className="group-hover:rotate-12 transition"/>}
         </button>
      </div>

      {/* 3. PROFILE MODAL (Basit Pop-up) */}
      {isProfileOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}>
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover"/></div>
                     <div><h3 className="text-xl font-bold text-[#1F2937]">Ali Yılmaz</h3><p className="text-gray-500 text-sm">Maslak 42</p></div>
                  </div>
                  <button onClick={() => setIsProfileOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
               </div>
               
               <div className="bg-gradient-to-r from-[#3A7D44] to-green-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden shadow-lg">
                  <Leaf className="absolute bottom-0 right-0 opacity-20 w-32 h-32 -mr-6 -mb-6"/>
                  <p className="text-green-100 text-sm font-bold uppercase tracking-wider">BeePuan Bakiyesi</p>
                  <h2 className="text-5xl font-black mt-2">{userPoints}</h2>
                  <div className="mt-4 bg-white/20 rounded-full h-2 w-full"><div className="bg-[#F4D03F] h-full rounded-full w-[70%]"></div></div>
                  <p className="text-xs mt-2 font-medium">Bedava kahveye 250 puan kaldı!</p>
               </div>

               <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-[#F2F0E9] rounded-xl font-bold text-[#3A7D44] hover:bg-[#e6e2d6] transition">
                     <span className="flex items-center gap-3"><Recycle size={20}/> Kap İade Et</span>
                     <ChevronRight size={20}/>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">
                     <span>Sipariş Geçmişi</span>
                     <ChevronRight size={20}/>
                  </button>
               </div>

               <button className="w-full mt-8 text-red-500 font-bold text-sm flex items-center justify-center gap-2"><LogOut size={16}/> Çıkış Yap</button>
            </div>
         </div>
      )}

      {/* Bildirim Toast */}
      {notification && (
         <div className="fixed top-24 right-6 z-[60] bg-[#1F2937] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in">
            <div className="bg-[#3A7D44] p-1 rounded-full"><Leaf size={12}/></div>
            <span className="font-bold text-sm">{notification}</span>
         </div>
      )}

      <footer className="bg-[#1F2937] text-white py-16 mt-20">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-6 text-[#F4D03F]"><Leaf size={24}/><span className="text-2xl font-black text-white">BeeCup</span></div>
               <p className="text-gray-400 max-w-sm">Teknoloji ve tazeliği birleştiren yeni nesil ofis beslenme çözümü.</p>
            </div>
            <div>
               <h5 className="font-bold mb-4 text-[#F4D03F]">Kurumsal</h5>
               <ul className="space-y-2 text-gray-400 text-sm"><li>Hakkımızda</li><li>Kariyer</li><li>İletişim</li></ul>
            </div>
            <div>
               <h5 className="font-bold mb-4 text-[#F4D03F]">Yasal</h5>
               <ul className="space-y-2 text-gray-400 text-sm"><li>Gizlilik</li><li>Kullanım Koşulları</li><li>KVKK</li></ul>
            </div>
         </div>
      </footer>
    </div>
  );
}