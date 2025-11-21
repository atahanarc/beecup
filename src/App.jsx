import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, ChevronDown, Leaf, ArrowRight, Sparkles, Send, User, LogIn, ShoppingBag, Phone, MessageCircle, Check, Zap, Filter, Mail, Star, Heart, Trash2, Plus, Minus, Info, Package, Utensils, LogOut, Eye, EyeOff, Loader2, Smartphone, Download, Navigation, Bot } from 'lucide-react';
// Firebase İçe Aktarımları
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';

// --- AYARLAR ---
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/2935/2935413.png";
const APP_LINK = "#";
const apiKey = ""; // Gemini API Key runtime'da sağlanır

// --- FIREBASE KURULUMU ---
const firebaseConfig = typeof _firebase_config !== 'undefined' ? JSON.parse(_firebase_config) : null;

let app, auth, db;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'beecup-prod';

try {
  if (firebaseConfig) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase başlatma hatası:", e);
}

// --- GENEL GÖRSELLER ---
const IMAGES = {
  heroBg: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000",
  appMockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
};

// --- LOKASYONLAR ---
const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", status: "active", stock: "92%", distance: "200m", lat: 41.07, lng: 29.01 },
  { id: 2, name: "Zorlu PSM", status: "low", stock: "15%", distance: "1.2km", lat: 41.06, lng: 29.02 },
  { id: 3, name: "Maslak 42", status: "active", stock: "88%", distance: "3.5km", lat: 41.11, lng: 29.02 },
  { id: 4, name: "Kolektif House", status: "active", stock: "76%", distance: "500m", lat: 41.08, lng: 29.00 },
  { id: 5, name: "Vadistanbul", status: "maintenance", stock: "Bakımda", distance: "6km", lat: 41.10, lng: 28.99 },
];

// --- MENÜ (GÜNCELLENMİŞ GÖRSELLER) ---
const FULL_MENU = [
  { 
    id: 101, cat: "Bowl", name: "Ege Rüyası", price: 195, kcal: 420, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500", 
    tags: ["Yüksek Protein", "Glutensiz"], desc: "Izgara tavuk, kinoa, nar, ceviz ve yeşillikler.",
    ingredients: "Marine edilmiş ızgara tavuk göğsü, haşlanmış kinoa, mevsim yeşillikleri, ayıklanmış nar taneleri, yerli ceviz içi, özel nar ekşisi sosu.",
    macros: { protein: "32g", carbs: "45g", fat: "12g" }
  },
  { 
    id: 102, cat: "Bowl", name: "Somon Poke", price: 240, kcal: 510, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1603082303693-f39b0403eb72?auto=format&fit=crop&q=80&w=500", 
    tags: ["Omega-3", "Glutensiz"], desc: "Taze somon küpleri, avokado, edamame, salatalık.",
    ingredients: "Norveç somonu, dilimlenmiş avokado, soya fasulyesi (edamame), salatalık, susam, suşi pirinci, soya sosu.",
    macros: { protein: "28g", carbs: "50g", fat: "18g" }
  },
  { 
    id: 103, cat: "Bowl", name: "Teriyaki Tavuk", price: 210, kcal: 480, isPopular: false,
    imgPackaged: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500", 
    tags: ["Sıcak"], desc: "Teriyaki soslu tavuk, pirinç, brokoli, susam.",
    ingredients: "Teriyaki soslu tavuk but, yasemin pirinci, haşlanmış brokoli, susam, taze soğan.",
    macros: { protein: "30g", carbs: "55g", fat: "10g" }
  },
  { 
    id: 104, cat: "Bowl", name: "Falafel Humus", price: 180, kcal: 390, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1541518763179-0e34e424fb23?auto=format&fit=crop&q=80&w=500", 
    tags: ["Vegan"], desc: "Çıtır falafel, pancarlı humus, roka, tahin sos.",
    ingredients: "Ev yapımı falafel topları, pancarlı humus, bebek roka, çeri domates, tahin sos.",
    macros: { protein: "15g", carbs: "40g", fat: "14g" }
  },
  { 
    id: 201, cat: "Salata", name: "Sezar Klasik", price: 170, kcal: 350, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500", 
    tags: ["Klasik"], desc: "Roman marulu, parmesan, kruton, sezar sos.",
    ingredients: "Taze roman marulu, parmesan peyniri rendesi, fırınlanmış kruton ekmekler, özel sezar sos.",
    macros: { protein: "12g", carbs: "25g", fat: "22g" }
  },
  { 
    id: 301, cat: "Wrap", name: "Hindi Füme", price: 160, kcal: 380, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=500", 
    tags: ["Yüksek Protein"], desc: "Tam buğday lavaş, hindi füme, labne.",
    ingredients: "Tam buğday unlu lavaş, hindi füme dilimleri, labne peyniri, marul, salatalık.",
    macros: { protein: "25g", carbs: "40g", fat: "12g" }
  },
  { 
    id: 501, cat: "İçecek", name: "Green Juice", price: 85, kcal: 110, isPopular: true, 
    imgPackaged: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=500", 
    tags: ["Detox"], desc: "Ispanak, elma, limon, zencefil suyu.",
    ingredients: "Soğuk sıkım ıspanak, yeşil elma, salatalık, limon, zencefil.",
    macros: { protein: "2g", carbs: "26g", fat: "0g" } 
  },
  { 
    id: 504, cat: "İçecek", name: "Cold Brew", price: 80, kcal: 5, 
    imgPackaged: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=500", 
    imgPlated: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=500", 
    tags: ["Kafein"], desc: "Soğuk demlenmiş kahve.",
    ingredients: "%100 Arabica kahve çekirdekleri, su.",
    macros: { protein: "0g", carbs: "1g", fat: "0g" } 
  },
];

// --- YARDIMCI BİLEŞENLER (Micro-Components) ---

// Macro Ring (Besin Değeri Halkası)
const MacroRing = ({ value, label, color }) => {
    const radius = 18;
    const stroke = 3;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (35 / 100) * circumference; 

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                    <circle stroke="#e5e7eb" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} fill="transparent" />
                    <circle stroke={color} strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} fill="transparent" />
                </svg>
                <span className="absolute text-[8px] font-bold text-gray-700">{value}</span>
            </div>
            <span className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">{label}</span>
        </div>
    );
};

// AI CHAT WIDGET (GEMINI API INTEGRATION)
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Merhaba! Ben BeeCup Asistanı. Bugün nasıl hissediyorsun? Sana menüden harika öneriler yapabilirim! ✨" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      // Menü verisini string formatına çevirip bağlama ekliyoruz
      const menuContext = JSON.stringify(FULL_MENU.map(item => ({
        name: item.name,
        category: item.cat,
        price: item.price,
        calories: item.kcal,
        tags: item.tags,
        description: item.desc,
        macros: item.macros
      })));

      const systemPrompt = `
        Sen BeeCup uygulamasının neşeli, yardımsever ve uzman yemek asistanısın.
        Görevlerin:
        1. Kullanıcının ruh haline, açlık durumuna veya diyet hedeflerine göre menüden öneriler yapmak.
        2. Ürünlerin kalori, protein ve içerik bilgilerini kullanarak sağlıklı tavsiyeler vermek.
        3. Kısa, samimi ve emojili Türkçe cevaplar vermek.
        
        İşte BeeCup Menüsü:
        ${menuContext}

        Kullanıcı Sorusu: ${userText}
        
        Lütfen sadece menüdeki ürünleri öner ve menü dışı hayali ürünler uydurma.
      `;

      const response = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, şu an bağlantıda bir sorun var. Lütfen tekrar deneyin. 🐝";
      
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (e) {
      console.error("AI Error:", e);
      setMessages(prev => [...prev, { role: 'assistant', text: "Bağlantı hatası oluştu, ancak menümüzdeki 'Ege Rüyası' her zaman iyi bir tercihtir! 🥗" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 z-50 bg-[#132A13] text-[#ECF39E] p-4 rounded-full shadow-2xl border-2 border-[#ECF39E] flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }} 
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-5 bg-[#132A13] text-white flex items-center gap-3 border-b border-[#ECF39E]/20">
              <div className="bg-[#ECF39E] p-2 rounded-full text-[#132A13]">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm font-['Space_Grotesk']">BeeCup Asistan ✨</h3>
                <p className="text-[10px] text-gray-300">Gemini AI ile güçlendirildi</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#F9FAFB] min-h-[300px]">
              {messages.map((m, i) => (
                <div key={i} className={flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-[#132A13] text-white rounded-br-none' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#4F772D]" />
                    <span className="text-xs text-gray-400">Düşünüyor...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-[#4F772D] transition-colors">
                <input 
                  className="flex-1 bg-transparent outline-none text-sm py-1" 
                  placeholder="Ne yemek istersin?" 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleSend()} 
                />
                <button onClick={handleSend} className="text-[#132A13] hover:text-[#4F772D] transition-colors p-1">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 1. NAVBAR (Türkçe ve Düzgün Linkleme)
const Navbar = ({ onAuthOpen, cartCount, onCartClick, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
      { name: 'Menü', href: '#menu' },
      { name: 'Uygulama', href: '#app-section' },
      { name: 'BeeBul', href: '#beebul' },
  ];

  return (
    <nav className={fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/20 py-3 shadow-sm' : 'bg-transparent py-6'}}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className={w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${scrolled ? 'bg-[#4F772D] text-white' : 'bg-white text-[#4F772D]'}}>
                <Leaf size={18} />
            </div>
            <span className={font-bold text-2xl tracking-tight font-['Space_Grotesk'] ${scrolled ? 'text-[#132A13]' : 'text-white'}}>BeeCup</span>
        </div>
        
        <div className={hidden md:flex items-center gap-8 text-sm font-medium tracking-wide ${scrolled ? 'text-gray-600' : 'text-gray-100'}}>
            {navLinks.map((item) => (
                <a key={item.name} href={item.href} className="hover:text-[#4F772D] transition-colors relative group font-['Inter']">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#4F772D] transition-all duration-300 group-hover:w-full"></span>
                </a>
            ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className={flex items-center gap-3 px-4 py-2 rounded-full border ${scrolled ? 'border-gray-200 bg-white/50' : 'border-white/20 bg-black/10 text-white'}}>
              <User size={16} className="text-[#4F772D]" /> 
              <span className="text-sm font-bold font-['Inter']">{user.displayName || 'Misafir'}</span>
              <button onClick={onLogout} className="hover:text-red-500 ml-2"><LogOut size={16}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
                <button onClick={() => onAuthOpen('login')} className={font-bold text-sm px-4 py-2 transition-colors ${scrolled ? 'text-gray-600 hover:text-[#4F772D]' : 'text-white hover:text-[#ECF39E]'}}>Giriş</button>
                <button onClick={() => onAuthOpen('register')} className="bg-[#4F772D] hover:bg-[#3E6024] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-green-900/20">Kayıt Ol</button>
            </div>
          )}
           
          <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={onCartClick}
             className={p-3 rounded-full transition-all relative group ${scrolled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ECF39E] text-[#132A13] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>
        <button className={md:hidden ${scrolled ? 'text-black' : 'text-white'}} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
    </nav>
  );
};

// 2. HERO (Türkçe)
const Hero = () => (
  <div className="relative h-[85vh] w-full overflow-hidden flex items-center bg-[#0a1a0a]">
    <div className="absolute inset-0">
        <img src={IMAGES.heroBg} className="w-full h-full object-cover opacity-80 scale-105 animate-[pulse_10s_ease-in-out_infinite]" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0a] via-transparent to-transparent"></div>
    </div>
    
    <div className="relative z-20 max-w-7xl mx-auto px-6 w-full mt-10">
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-[#ECF39E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Şehirli Beslenmenin Geleceği
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-6xl md:text-8xl font-bold text-white leading-[0.95] mb-6 font-['Space_Grotesk'] tracking-tight">
          Tazelik <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ECF39E] to-[#4F772D]">Anında Yanında.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-gray-300 mb-10 max-w-lg font-light leading-relaxed font-['Inter']">
            Şef imzalı kaseler, yapay zeka destekli stok yönetimi. Sıra beklemeden, şehrin en taze molasını verin.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex gap-4">
           <a href="#menu" className="bg-[#4F772D] hover:bg-[#3E6024] text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-green-900/40">Menüyü Keşfet <ArrowRight size={18} /></a>
           <a href="#app-section" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all">Nasıl Çalışır?</a>
        </motion.div>
      </div>
    </div>
    
    {/* Scroll Indicator */}
    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest">Kaydır</span>
        <ChevronDown size={20} />
    </motion.div>
  </div>
);

// 3. MENU SECTION (Türkçe Kategoriler)
const MenuSection = ({ selectedLocation, onAddToCart, onProductClick }) => {
  const [activeCat, setActiveCat] = useState("Popüler");
  
  const mapCategory = (cat) => {
      if(cat === "Popüler" || cat === "Çok Sevilenler") return item => item.isPopular;
      return item => item.cat === cat;
  }

  const filteredItems = FULL_MENU.filter(mapCategory(activeCat));

  return (
    <section id="menu" className="py-32 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
             <span className="text-[#4F772D] font-bold tracking-widest uppercase text-xs font-['Space_Grotesk']">Şef İmzalı</span>
             <h2 className="text-5xl font-bold text-[#132A13] mt-2 tracking-tight font-['Space_Grotesk']">Güncel Menü</h2>
          </div>
          <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
             {["Popüler", "Bowl", "Salata", "Wrap", "İçecek"].map(cat => (
                 <button key={cat} onClick={() => setActiveCat(cat)} className={px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCat === cat ? 'bg-[#132A13] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}}>{cat}</button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode='popLayout'>
             {filteredItems.map((item) => (
               <motion.div 
                 layout 
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
                 whileHover={{ y: -5 }}
                 key={item.id} 
                 onClick={() => onProductClick(item)}
                 className="group bg-white rounded-[2rem] p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer border border-gray-100 relative overflow-hidden"
               >
                 {/* Image Area */}
                 <div className="relative aspect-[1/1.1] rounded-[1.5rem] overflow-hidden bg-[#F3F4F6] mb-5">
                    <img src={item.imgPackaged} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110" />
                    <img src={item.imgPlated} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                       {item.isPopular && <span className="bg-[#ECF39E] text-[#132A13] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Popüler</span>}
                    </div>

                    <button 
                       onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} 
                       className="absolute bottom-3 right-3 bg-white text-[#132A13] p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#132A13] hover:text-white z-20"
                    >
                       <Plus size={20} />
                    </button>
                 </div>

                 {/* Info */}
                 <div className="px-2">
                    <div className="flex justify-between items-baseline mb-2">
                        <h3 className="font-bold text-lg text-[#132A13] font-['Space_Grotesk'] group-hover:text-[#4F772D] transition-colors">{item.name}</h3>
                        <span className="font-mono text-[#132A13] font-bold text-lg">₺{item.price}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 font-['Inter']">{item.desc}</p>
                    
                    {item.macros && (
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <MacroRing value={item.kcal} label="Kcal" color="#4F772D" />
                            <MacroRing value={item.macros.protein} label="Prot" color="#ECF39E" />
                            <MacroRing value={item.macros.carbs} label="Karb" color="#90A955" />
                        </div>
                    )}
                 </div>
               </motion.div>
             ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// 4. LOCATIONS (BeeBul - Türkçe)
const Locations = ({ onLocationSelect }) => {
  return (
    <section id="beebul" className="py-32 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
                <div className="mb-10">
                    <span className="text-[#4F772D] font-bold tracking-widest uppercase text-xs">Ağımız</span>
                    <h2 className="text-4xl font-bold text-[#132A13] mt-2 font-['Space_Grotesk']">BeeBul Noktaları</h2>
                    <p className="text-gray-500 mt-4 text-lg">İstanbul'un 7 farklı noktasında, 7/24 hizmetinizdeyiz.</p>
                </div>
                <div className="space-y-4">
                    {LOCATIONS.slice(0, 4).map((loc) => (
                        <div key={loc.id} onClick={() => onLocationSelect(loc)} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-[#4F772D] hover:shadow-md transition-all cursor-pointer group bg-[#F9FAFB] hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm text-[#4F772D] group-hover:bg-[#4F772D] group-hover:text-white transition-colors"><MapPin size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-[#132A13] text-lg">{loc.name}</h4>
                                    <p className="text-gray-400 text-xs font-mono">{loc.distance} uzaklıkta</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                      {loc.status === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                      <span className={relative inline-flex rounded-full h-2.5 w-2.5 ${loc.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}}></span>
                                    </span>
                                    <span className={text-xs font-bold ${loc.status === 'active' ? 'text-green-600' : 'text-yellow-600'}}>
                                        {loc.status === 'active' ? 'Açık' : 'Bakımda'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-1 rounded border border-gray-100">Stok: {loc.stock}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="lg:w-1/2 h-[500px] bg-[#132A13] rounded-[2.5rem] relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"), backgroundSize: 'cover', filter: 'grayscale(100%) invert(1)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#132A13] to-transparent"></div>
                
                {LOCATIONS.slice(0,3).map((loc, i) => (
                    <div key={loc.id} className="absolute bg-white p-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{ top: ${30 + i*15}%, left: ${40 + i*10}%, animationDelay: ${i*0.5}s }}>
                        <div className="w-2 h-2 bg-[#4F772D] rounded-full"></div>
                        <span className="text-xs font-bold text-[#132A13]">{loc.name}</span>
                    </div>
                ))}

                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Kapsama Alanı</h3>
                            <p className="text-gray-400 text-xs">İstanbul Avrupa & Anadolu Yakası</p>
                        </div>
                        <button className="bg-white text-[#132A13] p-3 rounded-full hover:scale-110 transition-transform"><Navigation size={20}/></button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

// 5. APP SECTION (Türkçe)
const AppSection = () => (
    <section id="app-section" className="py-24 bg-[#132A13] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 bg-[#4F772D]/20 text-[#ECF39E] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#ECF39E]/20">
            <Smartphone size={14} /> BeeCup Mobil
          </div>
          <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] font-['Space_Grotesk'] tracking-tight">
            Cebindeki <br/><span className="text-[#ECF39E]">Lezzet Asistanı</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed font-['Inter']">
            Sıra bekleme derdine son. Favori kaseni önceden seç, ödemeni yap ve sana en yakın noktadan QR kod ile 10 saniyede teslim al.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-white text-[#132A13] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl">
                <Download size={20} /> App Store
            </button>
            <button className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-colors">
                Google Play
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative flex justify-center">
            <div className="absolute inset-0 bg-[#4F772D] blur-[100px] opacity-30 rounded-full"></div>
            <img src={IMAGES.appMockup} className="relative z-10 w-[300px] rotate-[-6deg] rounded-[3rem] border-[8px] border-[#2a2a2a] shadow-2xl" />
        </div>
      </div>
    </section>
);

// 6. GÖRÜŞ BİLDİR (EKLENDİ)
const FeedbackSection = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [status, setStatus] = useState(null);
  
    const handleSubmit = async () => {
      if(!name || !email || !msg) return;
      setStatus('loading');
      try {
          if (db) { 
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'feedback'), {
                name, email, message: msg, createdAt: new Date()
            });
          }
          setStatus('success');
          setTimeout(() => setStatus(null), 3000);
          setName(''); setEmail(''); setMsg('');
      } catch (e) {
          console.error(e);
          setStatus('success'); // Demo için başarı simülasyonu
          setTimeout(() => setStatus(null), 3000);
      }
    };
  
    return (
      <section id="feedback" className="bg-[#F9FAFB] py-20 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#4F772D] font-bold tracking-widest uppercase text-xs font-['Space_Grotesk']">Bize Ulaşın</span>
          <h2 className="text-3xl font-bold mb-4 text-[#132A13] font-['Space_Grotesk']">Görüşlerin Bizim İçin Değerli</h2>
          <p className="text-gray-500 mb-10">Deneyimlerini paylaş, BeeCup'ı birlikte geliştirelim.</p>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Adınız" className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#132A13] placeholder-gray-400 focus:border-[#4F772D] outline-none transition-colors" />
               <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="E-posta Adresiniz" className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#132A13] placeholder-gray-400 focus:border-[#4F772D] outline-none transition-colors" />
            </div>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Öneri veya şikayetiniz..." rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#132A13] placeholder-gray-400 focus:border-[#4F772D] outline-none mb-6 transition-colors"></textarea>
            <button onClick={handleSubmit} disabled={status === 'loading' || status === 'success'} className="bg-[#132A13] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4F772D] transition-colors w-full flex items-center justify-center gap-2 shadow-lg">
              {status === 'loading' ? <Loader2 className="animate-spin"/> : status === 'success' ? "Gönderildi!" : "Gönder"}
            </button>
          </div>
        </div>
      </section>
    );
  };

// --- MODAL & CART ---

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
    if (!product) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-5xl h-[85vh] flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="w-full md:w-1/2 h-64 md:h-full bg-[#F3F4F6] relative p-10 flex items-center justify-center">
              <img src={product.imgPlated} className="w-full h-full object-contain drop-shadow-2xl" />
              <button onClick={onClose} className="absolute top-6 left-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors text-gray-500"><X size={20}/></button>
          </div>
          <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col h-full bg-white relative">
              <div className="flex-1 overflow-y-auto scrollbar-hide pr-4">
                  <span className="text-[#4F772D] font-bold uppercase text-xs tracking-widest mb-2 block">{product.cat}</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#132A13] mb-6 font-['Space_Grotesk']">{product.name}</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10 font-['Inter']">{product.ingredients}</p>
                  
                  {product.macros && (
                      <div className="grid grid-cols-4 gap-4 bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100">
                          <div className="text-center"><div className="text-[#4F772D] font-bold text-xl">{product.kcal}</div><div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">kcal</div></div>
                          <div className="text-center border-l border-gray-200"><div className="font-bold text-xl text-gray-700">{product.macros.protein}</div><div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Prot</div></div>
                          <div className="text-center border-l border-gray-200"><div className="font-bold text-xl text-gray-700">{product.macros.carbs}</div><div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Karb</div></div>
                          <div className="text-center border-l border-gray-200"><div className="font-bold text-xl text-gray-700">{product.macros.fat}</div><div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Yağ</div></div>
                      </div>
                  )}
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-between items-center gap-8">
                  <div className="text-4xl font-bold text-[#132A13] font-['Space_Grotesk']">₺{product.price}</div>
                  <button onClick={() => { onAddToCart(product); onClose(); }} className="flex-1 bg-[#132A13] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#4F772D] transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                      Sepete Ekle <ShoppingBag size={20}/>
                  </button>
              </div>
          </div>
        </motion.div>
      </div>
    );
};

const CartDrawer = ({ isOpen, onClose, cart, removeFromCart, total }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white z-[70] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-2xl font-bold text-[#132A13] font-['Space_Grotesk']">Sepetim ({cart.length})</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center"><ShoppingBag size={32} className="opacity-30"/></div>
                        <p className="font-medium">Sepetiniz henüz boş.</p>
                        <button onClick={onClose} className="text-[#4F772D] font-bold hover:underline">Alışverişe Başla</button>
                    </div>
                ) : cart.map((item) => (
                  <motion.div layout key={item.cartId} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex gap-5 items-center">
                    <div className="w-20 h-20 bg-[#F9FAFB] rounded-xl p-2 flex items-center justify-center border border-gray-100">
                        <img src={item.imgPackaged} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#132A13] text-base">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.kcal} kcal • {item.cat}</p>
                      <p className="font-bold text-[#4F772D] mt-2">₺{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={18} /></button>
                  </motion.div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-100 bg-[#F9FAFB]">
                  <div className="flex justify-between mb-6">
                      <span className="text-gray-500">Ara Toplam</span>
                      <span className="font-bold">₺{total}</span>
                  </div>
                  <div className="flex justify-between mb-8 text-2xl font-bold text-[#132A13]">
                      <span>Toplam</span>
                      <span>₺{total}</span>
                  </div>
                  <button className="w-full bg-[#132A13] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#4F772D] transition-colors shadow-lg">Ödemeyi Tamamla</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
};

const AuthModal = ({ type, onClose, onDemoLogin }) => {
    const isLogin = type === 'login';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            if (auth) {
                if (isLogin) await signInWithEmailAndPassword(auth, email, password);
                else {
                    const cred = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(cred.user, { displayName: fullName });
                    if(db) await setDoc(doc(db, 'artifacts', appId, 'users', cred.user.uid, 'profile'), { fullName, email, createdAt: new Date() });
                }
                onClose();
            } else {
                setTimeout(() => {
                    onDemoLogin({ uid: 'demo-123', displayName: fullName || 'Demo Üye', email: email || 'demo@beecup.com' });
                    setLoading(false);
                    onClose();
                }, 1500);
                return;
            }
        } catch (e) {
            setError(e.message);
        } finally { if(auth) setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
             <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white p-10 max-w-md w-full relative rounded-[2rem] shadow-2xl">
                 <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X/></button>
                 <div className="mb-8 text-center">
                     <h2 className="text-3xl font-bold text-[#132A13] font-['Space_Grotesk'] mb-2">{isLogin ? 'Hoş Geldin' : 'Aramıza Katıl'}</h2>
                     <p className="text-gray-500 text-sm">Lezzet dolu dünyamıza giriş yap.</p>
                 </div>
                 <div className="space-y-4">
                     {!isLogin && <input onChange={e=>setFullName(e.target.value)} placeholder="Adın Soyadın" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#4F772D] outline-none font-medium"/>}
                     <input onChange={e=>setEmail(e.target.value)} placeholder="E-posta Adresi" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#4F772D] outline-none font-medium"/>
                     <input type="password" onChange={e=>setPassword(e.target.value)} placeholder="Şifre" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#4F772D] outline-none font-medium"/>
                     {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                     <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#132A13] text-white py-4 rounded-xl font-bold hover:bg-[#4F772D] transition-colors flex items-center justify-center">
                         {loading ? <Loader2 className="animate-spin"/> : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
                     </button>
                     {!auth && <p className="text-xs text-center text-gray-400 mt-2">Demo Modu: Rastgele bilgilerle giriş yapabilirsiniz.</p>}
                 </div>
             </motion.div>
        </div>
    );
}

const Footer = () => (
    <footer className="bg-[#132A13] text-white py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
                <span className="text-2xl font-bold font-['Space_Grotesk'] tracking-tight mb-6 block">BeeCup.</span>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">Doğal, sürdürülebilir ve teknolojik beslenme deneyimi. Şehrin temposuna lezzet katıyoruz.</p>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-[#ECF39E]">Menü</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer transition-colors">Bowls</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Salatalar</li>
                    <li className="hover:text-white cursor-pointer transition-colors">İçecekler</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-6 text-[#ECF39E]">İletişim</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li className="flex items-start gap-3 hover:text-white transition-colors">
                        <MapPin size={20} className="text-[#4F772D] shrink-0" />
                        <span>Galatasaray Üniversitesi, Ortaköy</span>
                    </li>
                    <li className="flex items-center gap-3 hover:text-white transition-colors">
                        <Mail size={20} className="text-[#4F772D] shrink-0" />
                        <a href="mailto:info@beecupco.com">info@beecupco.com</a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
);

// --- MAIN APP ---
const App = () => {
  const [authModalType, setAuthModalType] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
      // Premium Fontlar (Inter & Space Grotesk)
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      
      document.title = "BeeCup | Şehrin En Taze Molası";

      if(auth) {
          const unsub = onAuthStateChanged(auth, setUser);
          return () => unsub();
      }
  }, []);

  const addToCart = (item) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleDemoLogin = (userData) => { setUser(userData); }
  const handleLogout = async () => { 
      if(auth) await signOut(auth); 
      else setUser(null);
  };

  const handleLocationSelect = (loc) => {
      const section = document.getElementById('menu');
      if(section) section.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter'] text-[#132A13] selection:bg-[#4F772D] selection:text-white">
      <Navbar onAuthOpen={setAuthModalType} cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} user={user} onLogout={handleLogout} />
      <Hero />
      <MenuSection selectedLocation={null} onAddToCart={addToCart} onProductClick={setSelectedProduct} />
      <AppSection />
      <Locations onLocationSelect={handleLocationSelect} />
      <FeedbackSection />
      <Footer />
      <AIChatWidget />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} removeFromCart={removeFromCart} total={cart.reduce((acc, i) => acc + i.price, 0)} />
      <AnimatePresence>
          {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      </AnimatePresence>
      {authModalType && <AuthModal type={authModalType} onClose={() => setAuthModalType(null)} onDemoLogin={handleDemoLogin} />}
    </div>
  );
};

export default App;