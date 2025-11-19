import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Home, User, QrCode, Leaf, Plus, Minus, 
  ArrowRight, Recycle, X, Sparkles, Send, MessageSquare, 
  MapPin, ChevronRight, Trash2, LogOut, Star, Search, Bell
} from 'lucide-react';

// --- GEMINI API AYARLARI ---
const apiKey = ""; // Buraya API key gelecek

// --- SABİT VERİLER ---
const VENDING_MACHINES = [
  { id: 1, name: "Kanyon AVM - Kat 1", type: "Plaza", distance: "120m", status: "Open" },
  { id: 2, name: "Levent 199 - Giriş", type: "Plaza", distance: "350m", status: "Open" },
  { id: 3, name: "MacFit - Maslak", type: "Gym", distance: "1.2km", status: "Open" },
  { id: 4, name: "İTÜ Arı Teknokent", type: "Kampüs", distance: "2.4km", status: "Busy" },
];

const MENU_ITEMS = [
  {
    id: 1,
    name: "Superfood Bowl",
    category: "Bowl",
    price: 155,
    calories: 450,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    description: "Kinoa, avokado, haşlanmış nohut ve özel sos ile.",
    tags: ["Yüksek Protein", "Popüler"]
  },
  {
    id: 2,
    name: "Izgara Tavuklu Bowl",
    category: "Bowl",
    price: 155,
    calories: 520,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    description: "Izgara tavuk göğsü, siyah pirinç ve mevsim yeşillikleri.",
    tags: ["Doyurucu"]
  },
  {
    id: 3,
    name: "Akdeniz Salata",
    category: "Salata",
    price: 140,
    calories: 320,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
    description: "Ezine peyniri, zeytin, çeri domates ve balzamik sos.",
    tags: ["Vejetaryen", "Hafif"]
  },
  {
    id: 4,
    name: "Spicy Chicken Wrap",
    category: "Wrap",
    price: 140,
    calories: 480,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    description: "Acılı tavuk parçaları, meksika fasulyesi ve cheddar.",
    tags: ["Sıcak"]
  },
  {
    id: 5,
    name: "Fit Atıştırmalık",
    category: "Atıştırmalık",
    price: 110,
    calories: 250,
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80",
    description: "Havuç, salatalık dilimleri ve humus.",
    tags: ["Vegan", "Popüler"]
  },
  {
    id: 6,
    name: "Green Detox",
    category: "İçecek",
    price: 70,
    calories: 120,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    description: "Yeşil elma, ıspanak, zencefil ve limon taze sıkım.",
    tags: ["Detox"]
  },
  {
    id: 7,
    name: "Doğal Kaynak Suyu",
    category: "İçecek",
    price: 15,
    calories: 0,
    image: "https://images.unsplash.com/photo-1564414291-276d22a50a60?q=80&w=600&auto=format&fit=crop", 
    description: "330ml cam şişe doğal kaynak suyu.",
    tags: []
  }
];

const CATEGORIES = ["Tümü", "Bowl", "Salata", "Wrap", "Atıştırmalık", "İçecek"];

// --- GEMINI API ---
async function generateGeminiResponse(prompt, systemInstruction = "") {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Bağlantı hatası.";
  } catch (error) {
    console.error("Gemini API Hatası:", error);
    return "Şu an cevap veremiyorum.";
  }
}

// --- ALT BİLEŞENLER ---

const AICoachScreen = ({ chatMessages, isChatLoading, chatInput, setChatInput, handleSendMessage, chatEndRef }) => {
  return (
    <div className="h-full flex flex-col bg-lime-50">
      <div className="p-4 bg-lime-100/80 backdrop-blur-md shadow-sm border-b border-lime-200 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-md">
          <Sparkles size={20}/>
        </div>
        <div>
          <h2 className="font-bold text-lime-900">BeeCoach AI</h2>
          <p className="text-[10px] text-lime-700 font-bold bg-lime-200 px-2 py-0.5 rounded-full inline-block">Çevrimiçi</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-lime-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-lime-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-lime-200 shadow-sm text-gray-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="absolute bottom-[85px] w-full px-4 z-20">
        <div className="flex gap-2 bg-white p-2 rounded-full shadow-lg border border-lime-200">
          <input 
            className="flex-1 bg-lime-50 rounded-full px-4 py-2 text-sm text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-lime-300 transition-all placeholder-lime-700/50"
            placeholder="Düşük kalorili ne var?..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} disabled={isChatLoading} className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-white hover:bg-lime-600 transition shadow-md">
            <Send size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileScreen = ({ userPoints, handleRecycle, machineName }) => {
  return (
    <div className="p-4 space-y-6 bg-lime-50 h-full overflow-y-auto pb-24">
      <h2 className="text-xl font-bold text-lime-900">Profilim</h2>
      
      {/* Puan Kartı */}
      <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-6 text-white shadow-xl shadow-lime-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10">
          <p className="opacity-90 text-sm font-medium text-lime-100">Toplam BeePuan</p>
          <h3 className="text-5xl font-bold mt-1">{userPoints}</h3>
          <p className="text-xs text-lime-100 mt-2">Bir sonraki ücretsiz öğün için 250 puanın kaldı!</p>
        </div>
      </div>

      {/* Geri Dönüşüm Bölümü */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-lime-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
            <Recycle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-lime-900">Boş Kap İade</h4>
            <p className="text-xs text-gray-500">Doğayı koru, puan kazan.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Elinizdeki boş BeeCup kasesini otomatın iade haznesine bırakarak 50 puan kazanabilirsiniz.
        </p>
        <button 
          onClick={handleRecycle} 
          className="w-full bg-lime-500 text-white py-3 rounded-xl font-bold hover:bg-lime-600 transition flex items-center justify-center gap-2 shadow-md"
        >
          <QrCode size={18}/> İade QR Kodunu Okut
        </button>
      </div>

      {/* Geçmiş Siparişler */}
      <div>
        <h4 className="font-bold text-lime-900 mb-3 ml-1">Son İşlemler</h4>
        <div className="bg-white p-4 mb-3 rounded-2xl border border-lime-100 flex justify-between items-center shadow-sm">
          <div className="flex gap-3 items-center">
            <div className="bg-lime-50 p-2 rounded-lg"><ShoppingBag size={16} className="text-lime-600"/></div>
            <div><p className="font-bold text-sm text-gray-800">Superfood Bowl</p><p className="text-xs text-gray-400">Dün • {machineName || 'Kanyon'}</p></div>
          </div>
          <span className="text-lime-600 font-bold">-155 ₺</span>
        </div>
        <div className="bg-white p-4 mb-3 rounded-2xl border border-lime-100 flex justify-between items-center shadow-sm">
          <div className="flex gap-3 items-center">
            <div className="bg-green-50 p-2 rounded-lg"><Recycle size={16} className="text-green-600"/></div>
            <div><p className="font-bold text-sm text-gray-800">Kap İadesi</p><p className="text-xs text-gray-400">3 gün önce</p></div>
          </div>
          <span className="text-green-600 font-bold">+50 P</span>
        </div>
      </div>

      <button className="w-full text-gray-400 text-sm font-medium flex items-center justify-center gap-2 py-4">
        <LogOut size={16}/> Çıkış Yap
      </button>
    </div>
  );
};

// --- ANA UYGULAMA ---

export default function App() {
  // State
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false); 
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [userPoints, setUserPoints] = useState(1250); 
  const [showQR, setShowQR] = useState(false);
  const [notification, setNotification] = useState(null);

  // AI State
  const [aiTip, setAiTip] = useState(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Selam! Ben BeeCoach 🐝. Seçtiğin otomatın menüsüne hakimim. Ne yemek istersin?' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeTab]);

  // --- FONKSİYONLAR ---
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    showNotification(`${item.name} sepete eklendi!`);
  };

  const decreaseQuantity = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleRecycle = () => {
    // İade simülasyonu
    showNotification(`İade haznesi açılıyor... Lütfen kabı yerleştirin.`);
    setTimeout(() => {
      setUserPoints(prev => prev + 50);
      showNotification(`Teşekkürler! 50 BeePuan hesabına yüklendi 🐝`);
    }, 2000);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setCart([]); 
    setActiveTab('home'); 
  };

  const handleMachineSelect = (machine) => {
    setSelectedMachine(machine);
    setShowLocationModal(false);
    showNotification(`Konum: ${machine.name} seçildi.`);
  };

  // AI Logic
  const handleGetAITip = async () => {
    setIsTipLoading(true);
    const menuContext = JSON.stringify(MENU_ITEMS.map(i => i.name));
    const systemPrompt = `BeeCup otomat asistanısın. Menü: (${menuContext}). Rastgele, sağlıklı ve eğlenceli bir öneri yap. Tek cümle.`;
    const response = await generateGeminiResponse("Öneri ver", systemPrompt);
    setAiTip(response);
    setIsTipLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    const menuContext = JSON.stringify(MENU_ITEMS);
    const systemPrompt = `Sen BeeCoach'sun. Kullanıcı şu an ${selectedMachine?.name || 'belirsiz bir'} otomatında. Menü: ${menuContext}. Türkçe, samimi, emojili cevap ver.`;
    const response = await generateGeminiResponse(`Geçmiş: ${JSON.stringify(chatMessages.slice(-3))}. Kullanıcı: ${userMsg}`, systemPrompt);
    
    setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsChatLoading(false);
  };

  // --- EKRANLAR ---

  // 1. ANA EKRAN (MENÜ ENTEGRE EDİLDİ)
  const renderHome = () => {
    const filteredItems = selectedCategory === "Tümü" ? MENU_ITEMS : MENU_ITEMS.filter(i => i.category === selectedCategory);

    return (
      <div className="p-4 pb-24 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3" onClick={() => setShowLocationModal(true)}>
             <div className="flex flex-col">
               <p className="text-[10px] text-lime-600 font-bold uppercase tracking-wide">Konum</p>
               <div className="flex items-center gap-1 text-lime-900 font-bold text-sm cursor-pointer hover:opacity-70 transition">
                 <MapPin size={14} className={!selectedMachine ? "text-red-500 animate-bounce" : ""} />
                 <span className={`truncate max-w-[150px] ${!selectedMachine ? 'text-red-500' : ''}`}>
                   {selectedMachine ? selectedMachine.name : 'Konum Seçiniz'}
                 </span>
                 <ChevronRight size={14} className="text-lime-400"/>
               </div>
             </div>
          </div>
          <div className="bg-white px-3 py-1 rounded-full flex items-center gap-1 text-lime-800 font-bold text-sm shadow-sm border border-lime-200">
             <Leaf size={14} className="text-lime-600" /> {userPoints}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-6 text-white shadow-xl shadow-lime-200/50 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 bg-white/20 w-40 h-40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 opacity-10">
             <Leaf size={120} />
          </div>
          
          {!aiTip ? (
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Aç mısın Atahan?</h2>
              <p className="text-lime-50 text-sm mb-5 font-medium">Moduna göre en taze seçimi senin için yapalım.</p>
              <button 
                onClick={handleGetAITip}
                disabled={isTipLoading}
                className="bg-white text-lime-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-lime-50 transition flex items-center gap-2"
              >
                {isTipLoading ? <span className="animate-pulse">Düşünüyor...</span> : <><Sparkles size={18} className="text-yellow-500" /> Bana Öner</>}
              </button>
            </div>
          ) : (
            <div className="relative z-10 animate-fade-in">
              <div className="flex justify-between mb-2">
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/20">BeeCup Önerisi</span>
                <button onClick={() => setAiTip(null)} className="hover:bg-white/20 rounded p-1"><X size={16}/></button>
              </div>
              <p className="font-medium text-lg leading-tight mb-3">"{aiTip}"</p>
            </div>
          )}
        </div>

        {/* Kategoriler & Filtreler */}
        <div className="sticky top-0 bg-lime-50 z-20 py-2 -mx-4 px-4 backdrop-blur-sm bg-opacity-95">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-lime-600 text-white shadow-md scale-105' : 'bg-white text-lime-700 border border-lime-200 hover:bg-lime-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-1 gap-4">
            {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-lime-100 flex gap-3 animate-fade-in-up group">
              <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={item.name}/>
                {item.tags.includes("Popüler") && (
                  <span className="absolute top-1 left-1 bg-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm">Popüler</span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lime-900 text-sm">{item.name}</h3>
                    <span className="font-bold text-lime-600 bg-lime-50 px-2 py-0.5 rounded-lg text-sm">{item.price}₺</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <button onClick={() => addToCart(item)} className="self-end bg-lime-100 text-lime-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-lime-200 transition hover:shadow-sm">
                  <Plus size={12} /> Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. SEPET EKRANI
  const renderCart = () => (
    <div className="h-full flex flex-col bg-lime-50 p-4 pb-24">
      <h2 className="text-xl font-bold text-lime-900 mb-4">Sepetim</h2>
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-lime-300 border-2 border-dashed border-lime-200 shadow-sm"><ShoppingBag size={40}/></div>
          <p className="font-medium text-lime-800">Sepetin şimdilik boş.</p>
          <button onClick={() => setActiveTab('home')} className="bg-lime-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-lime-700 transition">Menüye Git</button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-3 rounded-2xl border border-lime-100 flex items-center gap-3 shadow-sm">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-gray-100" alt={item.name}/>
                <div className="flex-1">
                  <h4 className="font-bold text-lime-900 text-sm">{item.name}</h4>
                  <p className="text-lime-600 font-bold text-sm">{item.price} ₺</p>
                </div>
                <div className="flex items-center gap-3 bg-lime-50 p-1.5 rounded-xl border border-lime-200">
                  <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-red-500 transition"><Minus size={12}/></button>
                  <span className="text-sm font-bold w-4 text-center text-lime-900">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-lime-600 transition"><Plus size={12}/></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white p-5 rounded-2xl shadow-lg border border-lime-100">
            <div className="flex justify-between mb-2 text-gray-500 text-sm"><span>Ara Toplam</span><span>{totalAmount} ₺</span></div>
            <div className="flex justify-between mb-2 text-lime-600 text-sm"><span>Kazanılacak Puan</span><span>+{Math.floor(totalAmount / 10)} P</span></div>
            <div className="w-full h-px bg-gray-100 my-3"></div>
            <div className="flex justify-between mb-4 text-xl font-bold text-lime-900"><span>Toplam</span><span>{totalAmount} ₺</span></div>
            <button onClick={() => setShowQR(true)} className="w-full bg-lime-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-lime-700 transition flex items-center justify-center gap-2">
               Siparişi Onayla <ArrowRight size={18}/>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F2F0E9] flex items-center justify-center relative">
      
      {/* Masaüstü Arka Plan (Sadece geniş ekranda görünür) */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/5 to-[#F4D03F]/5"></div>
         <div className="absolute top-0 left-0 w
         