import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Home, User, QrCode, Leaf, Plus, Minus, 
  ArrowRight, Recycle, X, Sparkles, Send, MessageSquare, 
  MapPin, ChevronRight, LogOut
} from 'lucide-react';

// --- API AYARLARI ---
const apiKey = ""; 

// --- SABİT VERİLER ---
const VENDING_MACHINES = [
  { id: 1, name: "Kanyon AVM - Kat 1", type: "Plaza", distance: "120m", status: "Open" },
  { id: 2, name: "Levent 199 - Giriş", type: "Plaza", distance: "350m", status: "Open" },
  { id: 3, name: "MacFit - Maslak", type: "Gym", distance: "1.2km", status: "Open" },
  { id: 4, name: "İTÜ Arı Teknokent", type: "Kampüs", distance: "2.4km", status: "Busy" },
];

const MENU_ITEMS = [
  { id: 1, name: "Superfood Bowl", category: "Bowl", price: 155, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80", description: "Kinoa, avokado, haşlanmış nohut.", tags: ["Popüler"] },
  { id: 2, name: "Izgara Tavuklu Bowl", category: "Bowl", price: 155, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80", description: "Izgara tavuk göğsü, siyah pirinç.", tags: ["Doyurucu"] },
  { id: 3, name: "Akdeniz Salata", category: "Salata", price: 140, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80", description: "Ezine peyniri, zeytin, çeri domates.", tags: ["Hafif"] },
  { id: 4, name: "Spicy Chicken Wrap", category: "Wrap", price: 140, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80", description: "Acılı tavuk parçaları, cheddar.", tags: ["Sıcak"] },
  { id: 5, name: "Fit Atıştırmalık", category: "Atıştırmalık", price: 110, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80", description: "Havuç, salatalık dilimleri ve humus.", tags: ["Vegan"] },
  { id: 6, name: "Green Detox", category: "İçecek", price: 70, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", description: "Yeşil elma, ıspanak, limon.", tags: ["Detox"] },
  { id: 7, name: "Doğal Kaynak Suyu", category: "İçecek", price: 15, image: "https://images.unsplash.com/photo-1564414291-276d22a50a60?q=80&w=600&auto=format&fit=crop", description: "330ml cam şişe.", tags: [] }
];

const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

// --- YARDIMCI BİLEŞENLER ---

const AICoachScreen = ({ chatMessages, isChatLoading, chatInput, setChatInput, handleSendMessage, chatEndRef }) => (
  <div className="h-full flex flex-col bg-lime-50">
    <div className="p-4 bg-lime-100/80 backdrop-blur-md shadow-sm border-b border-lime-200 flex items-center gap-3 sticky top-0 z-10">
      <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-md"><Sparkles size={20}/></div>
      <div><h2 className="font-bold text-lime-900">BeeCoach AI</h2><p className="text-[10px] text-lime-700 font-bold bg-lime-200 px-2 py-0.5 rounded-full inline-block">Çevrimiçi</p></div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
      {chatMessages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-lime-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-lime-200 rounded-tl-none'}`}>{msg.text}</div>
        </div>
      ))}
      {isChatLoading && <div className="text-gray-400 text-xs ml-4">Yazıyor...</div>}
      <div ref={chatEndRef} />
    </div>
    <div className="absolute bottom-[85px] w-full px-4 z-20">
      <div className="flex gap-2 bg-white p-2 rounded-full shadow-lg border border-lime-200">
        <input className="flex-1 bg-lime-50 rounded-full px-4 py-2 text-sm outline-none" placeholder="Ne yemeliyim?" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
        <button onClick={handleSendMessage} disabled={isChatLoading} className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-white"><Send size={18}/></button>
      </div>
    </div>
  </div>
);

const ProfileScreen = ({ userPoints, handleRecycle }) => (
  <div className="p-4 space-y-6 bg-lime-50 h-full overflow-y-auto pb-24">
    <h2 className="text-xl font-bold text-lime-900">Profilim</h2>
    <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <p className="opacity-90 text-sm font-medium text-lime-100">Toplam BeePuan</p>
        <h3 className="text-5xl font-bold mt-1">{userPoints}</h3>
        <p className="text-xs text-lime-100 mt-2">Ücretsiz öğün için 250 puan kaldı!</p>
      </div>
    </div>
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-lime-200">
      <h4 className="font-bold text-lime-900 mb-2">Geri Dönüşüm</h4>
      <p className="text-sm text-gray-600 mb-4">Boş kabı iade et, 50 puan kazan.</p>
      <button onClick={handleRecycle} className="w-full bg-lime-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"><QrCode size={18}/> İade Başlat</button>
    </div>
    <button className="w-full text-gray-400 text-sm font-medium flex items-center justify-center gap-2 py-4"><LogOut size={16}/> Çıkış Yap</button>
  </div>
);

// --- ANA UYGULAMA ---
export default function App() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false); 
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [userPoints, setUserPoints] = useState(1250); 
  const [showQR, setShowQR] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // AI
  const [aiTip, setAiTip] = useState(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Selam! Ben BeeCoach 🐝. Bugün ne yemek istersin?' }]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, activeTab]);

  // Functions
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    showNotification(`${item.name} eklendi!`);
  };

  const decreaseQuantity = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0));
  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const handleRecycle = () => { showNotification(`İade haznesi açılıyor...`); setTimeout(() => { setUserPoints(prev => prev + 50); showNotification(`50 Puan kazanıldı! 🐝`); }, 2000); };
  const handleCloseQR = () => { setShowQR(false); setCart([]); setActiveTab('home'); };
  const handleMachineSelect = (machine) => { setSelectedMachine(machine); setShowLocationModal(false); showNotification(`Konum: ${machine.name}`); };

  // AI Logic (Mock + API)
  const handleGetAITip = async () => {
    setIsTipLoading(true);
    // API Key yoksa mock cevap dön
    setTimeout(() => {
      setAiTip("Bugün enerjik hissetmek için 'Superfood Bowl' harika bir seçim! 🥑");
      setIsTipLoading(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);
    
    // Basit Mock Cevap (API Key olmadığı için)
    setTimeout(() => {
       setChatMessages(prev => [...prev, { role: 'assistant', text: "Harika bir tercih! Bu ürün hem lezzetli hem de besleyici. Sepetine eklememi ister misin? 😊" }]);
       setIsChatLoading(false);
    }, 1000);
  };

  // Renderers
  const renderHome = () => {
    const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);
    return (
      <div className="p-4 pb-24 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3" onClick={() => setShowLocationModal(true)}>
             <div className="flex flex-col cursor-pointer">
               <p className="text-[10px] text-lime-600 font-bold uppercase tracking-wide">Konum</p>
               <div className="flex items-center gap-1 text-lime-900 font-bold text-sm">
                 <MapPin size={14} className={!selectedMachine ? "text-red-500 animate-bounce" : ""} />
                 <span className="truncate max-w-[150px]">{selectedMachine ? selectedMachine.name : 'Konum Seç'}</span>
                 <ChevronRight size={14} className="text-lime-400"/>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-10"><Leaf size={120} /></div>
          {!aiTip ? (
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Aç mısın?</h2>
              <p className="text-lime-50 text-sm mb-5 font-medium">Sana özel en taze seçimi yapalım.</p>
              <button onClick={handleGetAITip} disabled={isTipLoading} className="bg-white text-lime-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-lime-50 transition flex items-center gap-2">
                {isTipLoading ? "Düşünüyor..." : <><Sparkles size={18} className="text-yellow-500" /> Bana Öner</>}
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex justify-between mb-2"><span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold border border-white/20">Öneri</span><button onClick={() => setAiTip(null)}><X size={16}/></button></div>
              <p className="font-medium text-lg leading-tight">"{aiTip}"</p>
            </div>
          )}
        </div>

        <div className="sticky top-0 bg-lime-50 z-20 py-2 -mx-4 px-4 backdrop-blur-sm bg-opacity-95">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-lime-600 text-white shadow-md' : 'bg-white text-lime-700 border border-lime-200'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-lime-100 flex gap-3 group">
              <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={item.name}/>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start"><h3 className="font-bold text-lime-900 text-sm">{item.name}</h3><span className="font-bold text-lime-600 bg-lime-50 px-2 py-0.5 rounded-lg text-sm">{item.price}₺</span></div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <button onClick={() => addToCart(item)} className="self-end bg-lime-100 text-lime-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-lime-200 transition"><Plus size={12} /> Ekle</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCart = () => (
    <div className="h-full flex flex-col bg-lime-50 p-4 pb-24">
      <h2 className="text-xl font-bold text-lime-900 mb-4">Sepetim</h2>
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-lime-300 border-2 border-dashed border-lime-200"><ShoppingBag size={40}/></div>
          <p className="font-medium text-lime-800">Sepetin boş.</p>
          <button onClick={() => setActiveTab('home')} className="bg-lime-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md">Menüye Git</button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-2xl border border-lime-100 flex items-center gap-3 shadow-sm">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-gray-100" alt={item.name}/>
                <div className="flex-1"><h4 className="font-bold text-lime-900 text-sm">{item.name}</h4><p className="text-lime-600 font-bold text-sm">{item.price} ₺</p></div>
                <div className="flex items-center gap-3 bg-lime-50 p-1.5 rounded-xl border border-lime-200">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg hover:text-red-500"><Minus size={12}/></button>
                  <span className="text-sm font-bold w-4 text-center text-lime-900">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg hover:text-lime-600"><Plus size={12}/></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white p-5 rounded-2xl shadow-lg border border-lime-100">
            <div className="flex justify-between mb-4 text-xl font-bold text-lime-900"><span>Toplam</span><span>{totalAmount} ₺</span></div>
            <button onClick={() => setShowQR(true)} className="w-full bg-lime-600 text-white py-3.5 rounded-xl font-bold shadow-md flex items-center justify-center gap-2">Siparişi Onayla <ArrowRight size={18}/></button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F2F0E9] flex items-center justify-center relative">
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/5 to-[#F4D03F]/5"></div>
         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-20">
            <div className="text-[#3A7D44] opacity-10"><Leaf size={400} /></div>
            <div className="text-right max-w-md text-[#1F2937]">
               <h1 className="text-6xl font-black mb-4 leading-tight">Ofis <br/>Yemeği <br/><span className="text-[#3A7D44]">Yenilendi.</span></h1>
               <p className="text-xl text-gray-500">BeeCup Web App ile siparişini ver, QR ile teslim al.</p>
            </div>
         </div>
      </div>

      {/* UYGULAMA KONTEYNERİ */}
      <div className="w-full h-full sm:h-[850px] sm:max-w-[430px] bg-lime-50 sm:rounded-[2.5rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-900 relative overflow-hidden flex flex-col z-10">
        
        {/* --- HEADER (EKSİK OLAN KISIM EKLENDİ) --- */}
        <header className="px-6 py-4 flex justify-between items-center bg-lime-50/90 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#3A7D44]"><Leaf size={18}/></div>
             <h1 className="text-lg font-black tracking-tight text-gray-800">Bee<span className="text-[#3A7D44]">Cup</span></h1>
          </div>
          <div className="bg-white border border-lime-200 rounded-full px-3 py-1 flex items-center gap-2 shadow-sm">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold text-gray-700">₺450.00</span>
          </div>
        </header>

        {notification && (
          <div className="absolute top-20 left-4 right-4 z-[80] bg-lime-700 text-white px-4 py-3 rounded-2xl shadow-xl text-sm flex items-center justify-center font-bold animate-bounce-in gap-2">
            <span className="bg-white/20 p-1 rounded-full"><Leaf size={12}/></span> {notification}
          </div>
        )}

        <main className="flex-1 overflow-y-auto scrollbar-hide bg-lime-50 relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'cart' && renderCart()}
          {activeTab === 'ai' && <AICoachScreen chatMessages={chatMessages} isChatLoading={isChatLoading} chatInput={chatInput} setChatInput={setChatInput} handleSendMessage={handleSendMessage} chatEndRef={chatEndRef} />}
          {activeTab === 'profile' && <ProfileScreen userPoints={userPoints} handleRecycle={handleRecycle} />}
        </main>

        <nav className="bg-white border-t border-lime-100 px-2 pb-2 pt-0 grid grid-cols-5 items-end absolute bottom-0 w-full pb-safe z-40 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.05)] h-[80px]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center gap-1 mb-3 transition ${activeTab === 'home' ? 'text-lime-600 scale-105' : 'text-gray-400'}`}><Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} /><span className="text-[10px] font-bold">Ana Sayfa</span></button>
          <button onClick={() => setActiveTab('ai')} className={`flex flex-col items-center justify-center gap-1 mb-3 transition ${activeTab === 'ai' ? 'text-lime-600 scale-105' : 'text-gray-400'}`}><MessageSquare size={24} strokeWidth={activeTab === 'ai' ? 2.5 : 2} /><span className="text-[10px] font-bold">Asistan</span></button>
          <div className="relative flex flex-col items-center justify-end h-full">
             <button onClick={() => setShowQR(true)} className="absolute -top-6 w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition border-4 border-lime-50"><QrCode size={28}/></button>
             <span className="text-[10px] font-bold text-gray-400 mb-3">QR</span>
          </div>
          <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center justify-center gap-1 mb-3 transition ${activeTab === 'cart' ? 'text-lime-600 scale-105' : 'text-gray-400'}`}>
            <div className="relative"><ShoppingBag size={24} strokeWidth={activeTab === 'cart' ? 2.5 : 2} />{cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm border border-white">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}</div>
            <span className="text-[10px] font-bold">Sepetim</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center gap-1 mb-3 transition ${activeTab === 'profile' ? 'text-lime-600 scale-105' : 'text-gray-400'}`}><User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} /><span className="text-[10px] font-bold">Profil</span></button>
        </nav>

        {showLocationModal && (
          <div className="absolute inset-0 bg-black/50 z-[99] flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={() => setShowLocationModal(false)}>
             <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-lime-900">Otomat Seçimi</h3><button onClick={() => setShowLocationModal(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button></div>
                <div className="space-y-3">
                  {VENDING_MACHINES.map(machine => (
                    <button key={machine.id} onClick={() => handleMachineSelect(machine)} className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${selectedMachine?.id === machine.id ? 'bg-lime-50 border-lime-500' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedMachine?.id === machine.id ? 'bg-lime-200 text-lime-700' : 'bg-gray-50 text-gray-400'}`}><MapPin size={20}/></div>
                          <div className="text-left"><h4 className="font-bold text-lime-900 text-sm">{machine.name}</h4><p className="text-xs text-gray-500">{machine.type}</p></div>
                        </div>
                        {selectedMachine?.id === machine.id && <div className="w-3 h-3 bg-lime-500 rounded-full"></div>}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

        {showQR && (
          <div className="absolute inset-0 bg-lime-900/90 z-[99] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={handleCloseQR}>
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleCloseQR} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6 text-lime-600 border-4 border-lime-50"><QrCode size={40}/></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sipariş Hazır!</h3>
              <div className="bg-gray-900 p-4 rounded-2xl inline-block mb-4 shadow-inner"><div className="w-40 h-40 bg-white flex items-center justify-center rounded-lg overflow-hidden"><QrCode size={140} className="text-black"/></div></div>
              <p className="text-xs text-gray-400 font-mono tracking-widest">#BEE-{Math.floor(Math.random()*9000)+1000}</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bounce-in { 0% { transform: scale(0.9); opacity: 0; } 70% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}