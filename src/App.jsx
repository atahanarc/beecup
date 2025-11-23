import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Menu, X, Leaf, ArrowRight, Sparkles, User, 
  LogOut, Zap, Filter, Check, CreditCard, History, Gift, 
  Smartphone, Building2, Users, Briefcase, Phone, Mail 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, 
  signInWithPopup, sendPasswordResetEmail 
} from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// --- 1. KONFİGÜRASYON ---
const CONFIG = {
  adminEmail: "info@beecupco.com",
  logoUrl: "/logo.png",
  appLink: "https://gemini.google.com/share/4fc04afd1c2a",
  emailJs: {
    serviceId: "service_5nludkm",
    templateWelcome: "template_7fj3mce",
    templateFeedback: "template_g29anfl", // Kurumsal form için de şimdilik bunu kullanıyoruz
    publicKey: "_m2hMVBLwxednDRNg"
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }
};

// --- 2. FIREBASE BAŞLATMA ---
let app, auth, db;
try {
  if (CONFIG.firebase.apiKey) {
    app = initializeApp(CONFIG.firebase);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) { console.error("Firebase Hatası:", e); }

// --- 3. SABİT VERİLER ---
const IMAGES = { heroBg: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000", appMockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" };

const LOCATIONS = [ 
    { id: 1, name: "Kanyon AVM", status: "active", stock: "Yüksek", distance: "200m" }, 
    { id: 2, name: "Zorlu PSM", status: "low", stock: "Azaldı", distance: "1.2km" }, 
    { id: 3, name: "Maslak 42", status: "active", stock: "Yüksek", distance: "3.5km" }, 
    { id: 4, name: "Kolektif House", status: "active", stock: "Yüksek", distance: "500m" }, 
    { id: 5, name: "Vadistanbul", status: "maintenance", stock: "Bakımda", distance: "6km" }
];

const FULL_MENU = [
  { id: 101, cat: "Bowl", name: "Ege Rüyası", price: 195, kcal: 420, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein", "Glutensiz"], desc: "Izgara tavuk, kinoa, nar, ceviz ve yeşillikler." },
  { id: 102, cat: "Bowl", name: "Somon Poke", price: 240, kcal: 510, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600", tags: ["Omega-3"], desc: "Taze somon küpleri, avokado, edamame, salatalık." },
  { id: 104, cat: "Bowl", name: "Falafel Humus", price: 180, kcal: 390, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Çıtır falafel, pancarlı humus, roka, tahin sos." },
  { id: 201, cat: "Salata", name: "Sezar Klasik", price: 170, kcal: 350, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600", tags: ["Klasik"], desc: "Roman marulu, parmesan, kruton, sezar sos." },
];

const MOCK_ORDERS = [
    { id: "ORD-2938", date: "23 Kas 2025", location: "Kanyon AVM (Otomat)", items: ["Ege Rüyası Bowl", "Green Juice"], total: 280, status: "Tamamlandı" },
    { id: "ORD-2931", date: "20 Kas 2025", location: "Maslak 42 (App)", items: ["Somon Poke"], total: 240, status: "Tamamlandı" },
];

// --- 4. GLOBAL STATE ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authModalType, setAuthModalType] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false); // Yeni State

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      authModalType, setAuthModalType,
      currentView, setCurrentView,
      isOfficeModalOpen, setIsOfficeModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => useContext(AppContext);

// --- 5. BİLEŞENLER ---

const ScrollReveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const Navbar = () => {
  const { user, setAuthModalType, currentView, setCurrentView, setIsOfficeModalOpen } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => { 
    if (auth) await signOut(auth); 
    setCurrentView('home');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          {/* Logo Tıklama İşlevi Eklendi */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <img src={CONFIG.logoUrl} alt="BeeCup" className="h-10 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
            <span className="font-bold text-2xl tracking-tight text-[#4F772D]">BeeCup</span>
          </div>
          {currentView === 'home' && (
            <div className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
                <a href="#menu" className="hover:text-[#4F772D] transition-colors">MENÜ</a>
                <a href="#app-section" className="hover:text-[#4F772D] transition-colors">UYGULAMA</a>
                <a href="#beebul" className="hover:text-[#4F772D] transition-colors">BEEBUL</a>
                {/* YENİ MENÜ ÖĞESİ */}
                <button onClick={() => setIsOfficeModalOpen(true)} className="flex items-center gap-1 text-[#132A13] hover:text-[#4F772D] transition-colors">
                    <Building2 size={16}/> KURUMSAL
                </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('profile')} className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full transition-all ${currentView === 'profile' ? 'bg-[#ECF39E] text-[#4F772D]' : 'text-gray-600 hover:text-[#4F772D]'}`}>
                <User size={18} /> {user.displayName || "Hesabım"}
              </button>
              {currentView === 'profile' && (
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Çıkış Yap"><LogOut size={18} /></button>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setAuthModalType('login')} className="text-gray-600 hover:text-[#4F772D] font-medium text-sm px-3">Giriş</button>
              <button onClick={() => setAuthModalType('register')} className="bg-[#4F772D] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#3E6024]">Kayıt Ol</button>
            </>
          )}
        </div>
        
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
      </div>
      
      {/* Mobil Menü */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute top-full left-0 w-full bg-white border-t shadow-lg z-50 overflow-hidden">
             <div className="flex flex-col p-6 gap-4 font-medium text-gray-600">
                <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menü</a>
                <a href="#app-section" onClick={() => setIsMenuOpen(false)}>Uygulama</a>
                <button onClick={() => { setIsOfficeModalOpen(true); setIsMenuOpen(false); }} className="text-left flex items-center gap-2 font-bold text-[#132A13]"><Building2 size={16}/> Kurumsal / Ofisine İste</button>
                {user ? <button onClick={handleLogout} className="text-red-500 text-left">Çıkış Yap</button> : <button onClick={() => {setAuthModalType('login'); setIsMenuOpen(false);}} className="text-[#4F772D] font-bold text-left">Giriş / Kayıt</button>}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- PROFİL SAYFASI ---
const ProfilePage = () => {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="min-h-screen bg-[#F7F9F4] pt-8 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-[#ECF39E] rounded-full flex items-center justify-center text-[#4F772D] font-bold text-3xl">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#132A13]">{user?.displayName || "BeeCup Üyesi"}</h1>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <div className="bg-[#132A13] text-white px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-full"><Gift size={24} /></div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Bal Puan</div>
                            <div className="text-2xl font-bold">1.250 BP</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit">
                        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all mb-2 ${activeTab === 'orders' ? 'bg-[#F7F9F4] text-[#4F772D]' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <History size={18} /> Geçmiş Siparişler
                        </button>
                        <button onClick={() => setActiveTab('cards')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all mb-2 ${activeTab === 'cards' ? 'bg-[#F7F9F4] text-[#4F772D]' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <CreditCard size={18} /> Kayıtlı Kartlarım
                        </button>
                    </div>
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[#132A13] mb-4">Sipariş Geçmişi</h2>
                                {MOCK_ORDERS.map(order => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-[#132A13]">{order.location}</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{order.status}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-2">{order.items.join(", ")}</div>
                                            <div className="text-xs text-gray-400 font-mono">{order.id} • {order.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-[#4F772D]">₺{order.total}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'cards' && (
                             <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[#132A13] mb-4">Ödeme Yöntemleri</h2>
                                <p className="text-gray-500 text-sm">Kart ekleme/çıkarma işlemleri güvenlik nedeniyle sadece Mobil Uygulama üzerinden yapılabilmektedir.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ANA SAYFA İÇERİKLERİ ---
const Hero = () => (
  <div className="relative h-[600px] w-full overflow-hidden flex items-center">
    <div className="absolute inset-0">
      <img src={IMAGES.heroBg} className="w-full h-full object-cover" alt="Hero" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-[#4F772D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Leaf size={14} /> İstanbul'un En Taze Ağı
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-display">
          Doğal Lezzet,<br/><span className="text-[#ECF39E]">Anında Seninle.</span>
        </h1>
        <p className="text-xl text-gray-100 mb-8 max-w-lg">Otomatlarımızdan veya App üzerinden siparişini ver, sıra beklemeden lezzete ulaş.</p>
        <a href="#app-section" className="bg-[#4F772D] hover:bg-[#3E6024] text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105">
          Uygulamayı İndir <Smartphone size={20} />
        </a>
      </div>
    </div>
  </div>
);

const MenuSection = () => {
  const [activeCat, setActiveCat] = useState("Çok Sevilenler");
  const filteredItems = FULL_MENU.filter(item => activeCat === "Çok Sevilenler" ? item.isPopular : true);

  return (
    <section id="menu" className="py-24 bg-[#F7F9F4]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#132A13] mb-10">Menüyü Keşfet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-[#90A955] transition-all">
                    <div className="relative h-56 rounded-xl overflow-hidden mb-4 bg-gray-100">
                        <img src={item.imgPackaged} className="w-full h-full object-cover" alt={item.name} />
                        {item.tags && <div className="absolute top-2 left-2 flex gap-1"><span className="bg-white/90 text-[10px] font-bold px-2 py-1 rounded">{item.tags[0]}</span></div>}
                    </div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-[#132A13] text-lg">{item.name}</h3>
                        <span className="font-bold text-[#4F772D]">₺{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.desc}</p>
                    <a href="#app-section" className="block w-full text-center bg-[#F0F5ED] text-[#4F772D] py-2 rounded-lg font-bold text-sm hover:bg-[#4F772D] hover:text-white transition-colors">
                        App ile Sipariş Ver
                    </a>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const Locations = () => (
    <section id="beebul" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-[#132A13] mb-2">BeeBul Noktaları</h2>
            <p className="text-gray-600 mb-12">Sana en yakın otomatı bul ve stok durumunu canlı takip et.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LOCATIONS.map((loc) => (
                    <div key={loc.id} className="border border-gray-200 rounded-2xl p-6 hover:border-[#4F772D] transition-all group bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-[#F7F9F4] p-3 rounded-full text-[#132A13]"><MapPin size={24} /></div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${loc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {loc.status === 'active' ? 'Aktif' : 'Bakımda'}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-[#132A13] mb-1">{loc.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{loc.distance} uzakta</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const AppSection = () => (
    <section id="app-section" className="py-20 bg-[#F0F5ED] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#132A13] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase"><Sparkles size={14} /> BeeCup App</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#132A13]">Tazelik Cebinde.</h2>
                <p className="text-gray-600 text-lg">Otomatın önünde misin? QR kodu okut, ödemeni yap ve kapağı aç. App üzerinden sipariş ver, Bal Puan kazan.</p>
                <div className="flex gap-4 pt-4">
                    <button className="bg-[#132A13] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">App Store</button>
                    <button className="bg-[#132A13] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Google Play</button>
                </div>
            </div>
            <div className="flex-1 flex justify-center"><img src={IMAGES.appMockup} className="h-[400px] object-contain rotate-[-5deg] hover:rotate-0 transition-transform duration-500 drop-shadow-2xl" /></div>
        </div>
    </section>
);

const FeedbackSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if(!name || !email || !msg) return;
    setStatus('loading');
    try {
        if (db) await addDoc(collection(db, 'feedback'), { name, email, message: msg, createdAt: new Date() });
        if (CONFIG.emailJs.publicKey) await emailjs.send(CONFIG.emailJs.serviceId, CONFIG.emailJs.templateFeedback, { from_name: name, from_email: email, message: msg, to_email: CONFIG.adminEmail }, CONFIG.emailJs.publicKey);
        setStatus('success'); setTimeout(() => setStatus(null), 3000);
        setName(''); setEmail(''); setMsg('');
    } catch (e) {
        console.error(e);
        setStatus('success'); setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <section className="bg-[#132A13] py-16 text-white border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Görüşlerin Değerli</h2>
        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 mt-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Adın" className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none" />
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="E-posta" className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none" />
          </div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Mesajın..." rows="4" className="w-full bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none mb-4"></textarea>
          <button onClick={handleSubmit} disabled={status === 'loading'} className="bg-[#4F772D] text-white px-8 py-3 rounded-xl font-bold w-full md:w-auto">
            {status === 'loading' ? 'Gönderiliyor...' : status === 'success' ? 'Gönderildi!' : 'Gönder'}
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="text-white py-16 bg-[#132A13]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6"><span className="font-bold text-2xl">BeeCup.</span></div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">Doğal, sürdürülebilir ve teknolojik beslenme deneyimi.</p>
          </div>
          <div>
              <h4 className="font-bold mb-6 text-[#90A955]">İletişim</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                  <li>Galatasaray Üniversitesi, Ortaköy</li>
                  <li>info@beecupco.com</li>
              </ul>
          </div>
          <div><h4 className="font-bold mb-6 text-[#90A955]">İndir</h4><span className="text-gray-400 text-sm">iOS & Android</span></div>
      </div>
  </footer>
);

// --- MODALLAR ---

const OfficeRequestModal = () => {
    const { isOfficeModalOpen, setIsOfficeModalOpen } = useAppContext();
    const [formData, setFormData] = useState({ company: '', contact: '', email: '', phone: '', employees: '', district: '' });
    const [status, setStatus] = useState(null);

    if (!isOfficeModalOpen) return null;

    const handleSubmit = async () => {
        if (!formData.company || !formData.email || !formData.phone) return;
        setStatus('loading');
        try {
            if (db) await addDoc(collection(db, 'office_requests'), { ...formData, createdAt: new Date() });
            if (CONFIG.emailJs.publicKey) {
                // Not: Şimdilik feedback template'i kullanıyoruz, içerik mesajda gidecek.
                await emailjs.send(CONFIG.emailJs.serviceId, CONFIG.emailJs.templateFeedback, { 
                    from_name: `${formData.contact} (${formData.company})`, 
                    from_email: formData.email, 
                    message: `Kurumsal Talep: ${formData.employees} Çalışan, Bölge: ${formData.district}, Tel: ${formData.phone}`, 
                    to_email: CONFIG.adminEmail 
                }, CONFIG.emailJs.publicKey);
            }
            setStatus('success'); setTimeout(() => { setStatus(null); setIsOfficeModalOpen(false); setFormData({ company: '', contact: '', email: '', phone: '', employees: '', district: '' }) }, 3000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
                <button onClick={() => setIsOfficeModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#F0F5ED] rounded-full flex items-center justify-center text-[#4F772D] mx-auto mb-4"><Briefcase size={32}/></div>
                    <h2 className="text-2xl font-bold text-[#132A13] mb-2">BeeCup'ı Ofisine İste</h2>
                    <p className="text-sm text-gray-500">Ofisiniz için sağlıklı ve teknolojik otomat çözümü.</p>
                </div>
                
                {status === 'success' ? (
                    <div className="text-center py-10">
                        <div className="text-green-500 text-5xl mb-4 mx-auto">✓</div>
                        <h3 className="text-xl font-bold text-[#132A13]">Talebin Alındı!</h3>
                        <p className="text-gray-500">En kısa sürede sizinle iletişime geçeceğiz.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Firma Adı" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                            <input type="text" placeholder="Yetkili Kişi" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="email" placeholder="E-posta" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input type="tel" placeholder="Telefon" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <Users size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                                <input type="number" placeholder="Çalışan Sayısı" className="w-full p-3 pl-10 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} />
                             </div>
                             <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                                <input type="text" placeholder="Semt / İlçe" className="w-full p-3 pl-10 rounded-xl border border-gray-200 outline-none focus:border-[#4F772D]" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                             </div>
                        </div>
                        <button onClick={handleSubmit} disabled={status === 'loading'} className="w-full bg-[#4F772D] text-white py-4 rounded-xl font-bold hover:bg-[#3E6024] transition-colors mt-2">
                            {status === 'loading' ? "Gönderiliyor..." : "Talep Oluştur"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const AuthModal = () => {
  const { authModalType, setAuthModalType } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalType) return null;

  const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        setAuthModalType(null);
    } catch (e) { setError("Google girişi başarısız."); }
  };

  const handleSubmit = async () => {
    if (!auth) return;
    setLoading(true); setError('');
    try {
        if (authModalType === 'login') await signInWithEmailAndPassword(auth, email, password);
        else if (authModalType === 'register') {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: fullName });
        } else if (authModalType === 'reset') {
            await sendPasswordResetEmail(auth, email);
            setError("Sıfırlama e-postası gönderildi."); setLoading(false); return;
        }
        setAuthModalType(null);
    } catch (e) {
        setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
        <button onClick={() => setAuthModalType(null)} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
        <h2 className="text-2xl font-bold mb-6 text-center">{authModalType === 'login' ? "Giriş Yap" : authModalType === 'register' ? "Kayıt Ol" : "Şifre Yenile"}</h2>
        <div className="space-y-4">
            {authModalType !== 'reset' && <button onClick={handleGoogleLogin} className="w-full border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 flex justify-center gap-2">Google ile Devam Et</button>}
            {authModalType === 'register' && <input type="text" placeholder="Adın Soyadın" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={fullName} onChange={e => setFullName(e.target.value)} />}
            <input type="email" placeholder="E-posta" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            {authModalType !== 'reset' && <input type="password" placeholder="Şifre" className="w-full p-3 rounded-xl border border-gray-200 outline-none" value={password} onChange={e => setPassword(e.target.value)} />}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#4F772D] text-white py-3 rounded-xl font-bold hover:bg-[#3E6024]">
                {loading ? "İşlem yapılıyor..." : "Devam Et"}
            </button>
             <div className="flex justify-center gap-4 text-sm text-gray-500">
                {authModalType === 'login' && <button onClick={() => setAuthModalType('register')}>Hesabın yok mu?</button>}
                {authModalType === 'login' && <button onClick={() => setAuthModalType('reset')}>Şifreni mi unuttun?</button>}
                {authModalType !== 'login' && <button onClick={() => setAuthModalType('login')}>Giriş Yap</button>}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- 7. ANA LAYOUT ---
const MainLayout = () => {
  const { currentView } = useAppContext();
  
  useEffect(() => {
    document.title = "BeeCup | Şehrin En Taze Molası";
    const style = document.createElement('style');
    style.innerHTML = `html { scroll-behavior: smooth; } .font-display { font-family: 'Outfit', sans-serif; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#132A13]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@300;400;600;800&display=swap'); body { font-family: 'DM Sans', sans-serif; }`}</style>
      
      <Navbar />

      {/* SAYFA YÖNETİMİ: Home veya Profil */}
      {currentView === 'home' ? (
        <>
            <ScrollReveal><Hero /></ScrollReveal>
            <ScrollReveal delay={0.2}><MenuSection /></ScrollReveal>
            <ScrollReveal><AppSection /></ScrollReveal>
            <ScrollReveal><Locations /></ScrollReveal>
            <ScrollReveal><FeedbackSection /></ScrollReveal>
        </>
      ) : (
        <ProfilePage />
      )}

      <Footer />
      <AuthModal />
      <OfficeRequestModal />
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainLayout />
  </AppProvider>
);

export default App;