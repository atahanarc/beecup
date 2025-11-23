import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Menu, X, Leaf, ArrowRight, Sparkles, User, 
  LogOut, Zap, Filter, Check, CreditCard, History, Gift, 
  Smartphone, Building2, Users, Briefcase, Phone, Mail,
  Package, Utensils, Wallet, Instagram, FileText, Info, Loader2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, 
  signInWithPopup, sendPasswordResetEmail 
} from 'firebase/auth';
import { getFirestore, addDoc, collection, getDocs, setDoc, doc, query } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import ReactGA from "react-ga4";

// --- 1. KONFİGÜRASYON ---
const CONFIG = {
  adminEmail: "info@beecupco.com",
  instagramLink: "https://www.instagram.com/beecupco/#",
  logoUrl: "/logo.png",
  gaMeasurementId: "G-XXXXXXXXXX", // Google Analytics Kodunu Buraya Yaz (Yoksa boş kalsın)
  emailJs: {
    serviceId: "service_5nludkm",
    templateWelcome: "template_7fj3mce",
    templateFeedback: "template_g29anfl",
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

// --- 3. VERİ YÜKLEME ARACI (MENÜYÜ FIREBASE'E GÖNDERİR) ---
// NOT: Bu bileşen menüyü veritabanına yüklemek içindir.
const DataSeeder = () => {
  const FULL_MENU_DATA = [
      { id: 101, cat: "Bowl", name: "Ege Rüyası", price: 195, kcal: 420, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein", "Glutensiz"], desc: "Izgara tavuk, kinoa, nar, ceviz ve yeşillikler.", ingredients: "Marine edilmiş ızgara tavuk göğsü, haşlanmış kinoa, mevsim yeşillikleri, ayıklanmış nar taneleri, yerli ceviz içi.", macros: { protein: "32g", carbs: "45g", fat: "12g" } },
      { id: 102, cat: "Bowl", name: "Somon Poke", price: 240, kcal: 510, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", tags: ["Omega-3", "Glutensiz"], desc: "Taze somon küpleri, avokado, edamame, salatalık.", ingredients: "Norveç somonu, dilimlenmiş avokado, soya fasulyesi (edamame), salatalık, susam, suşi pirinci.", macros: { protein: "28g", carbs: "50g", fat: "18g" } },
      { id: 103, cat: "Bowl", name: "Teriyaki Tavuk", price: 210, kcal: 480, isPopular: false, imgPackaged: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600", tags: ["Sıcak"], desc: "Teriyaki soslu tavuk, pirinç, brokoli, susam.", ingredients: "Teriyaki soslu tavuk but, yasemin pirinci, haşlanmış brokoli, susam, taze soğan.", macros: { protein: "30g", carbs: "55g", fat: "10g" } },
      { id: 104, cat: "Bowl", name: "Falafel Humus", price: 180, kcal: 390, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1541518763179-0e34e424fb23?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Çıtır falafel, pancarlı humus, roka, tahin sos.", ingredients: "Ev yapımı falafel topları, pancarlı humus, bebek roka, çeri domates, tahin sos.", macros: { protein: "15g", carbs: "40g", fat: "14g" } },
      { id: 105, cat: "Bowl", name: "Mexican Fiesta", price: 220, kcal: 550, isPopular: false, imgPackaged: "https://images.unsplash.com/photo-1582499814723-22442273e626?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600", tags: ["Acılı", "Vejeteryan"], desc: "Siyah fasulye, mısır, jalapeno, guacamole, salsa.", ingredients: "Meksika fasulyesi, mısır, jalapeno turşusu, guacamole, domates salsa, esmer pirinç.", macros: { protein: "18g", carbs: "60g", fat: "20g" } },
      { id: 106, cat: "Bowl", name: "Köfte & Karabuğday", price: 215, kcal: 450, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein"], desc: "Izgara köfte, karabuğday, cacık sos, köz biber.", ingredients: "Dana ızgara köfte, haşlanmış karabuğday, süzme yoğurt, kapya biber.", macros: { protein: "28g", carbs: "35g", fat: "15g" } },
      { id: 201, cat: "Salata", name: "Sezar Klasik", price: 170, kcal: 350, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1620917670397-a331343d3c64?auto=format&fit=crop&q=80&w=600", tags: ["Klasik"], desc: "Roman marulu, parmesan, kruton, sezar sos.", ingredients: "Taze roman marulu, parmesan peyniri rendesi, fırınlanmış kruton ekmekler, özel sezar sos.", macros: { protein: "12g", carbs: "25g", fat: "22g" } },
      { id: 202, cat: "Salata", name: "Tulum Peynirli", price: 160, kcal: 280, imgPackaged: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", tags: ["Vejeteryan"], desc: "Roka, tulum peyniri, ceviz, nar ekşisi.", ingredients: "Taze roka, İzmir tulum peyniri, ceviz içi, kurutulmuş domates, nar ekşisi sosu.", macros: { protein: "14g", carbs: "10g", fat: "18g" } },
      { id: 203, cat: "Salata", name: "Asya Çıtır", price: 185, kcal: 320, imgPackaged: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1606757365690-3423421c933c?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Lahana, havuç, yer fıstığı, zencefilli sos.", ingredients: "Kırmızı ve beyaz lahana, rendelenmiş havuç, kavrulmuş yer fıstığı, edamame.", macros: { protein: "10g", carbs: "20g", fat: "15g" } },
      { id: 204, cat: "Salata", name: "Ton Balıklı", price: 195, kcal: 400, isPopular: false, imgPackaged: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein"], desc: "Ton balığı, yumurta, mısır, dereotu.", ingredients: "Yağı süzülmüş ton balığı, haşlanmış yumurta, süt mısır, dereotu, göbek marul.", macros: { protein: "35g", carbs: "15g", fat: "18g" } },
      { id: 205, cat: "Salata", name: "Yeşil Detoks", price: 165, kcal: 250, imgPackaged: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600", tags: ["Diyet", "Vegan"], desc: "Ispanak, yeşil elma, kereviz sapı, limon sos.", ingredients: "Bebek ıspanak, dilimlenmiş yeşil elma, kereviz sapı, salatalık, maydanoz, limon sosu.", macros: { protein: "5g", carbs: "25g", fat: "8g" } },
      { id: 301, cat: "Wrap", name: "Hindi Füme", price: 160, kcal: 380, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein"], desc: "Tam buğday lavaş, hindi füme, labne.", ingredients: "Tam buğday unlu lavaş, hindi füme dilimleri, labne peyniri, marul, salatalık.", macros: { protein: "25g", carbs: "40g", fat: "12g" } },
      { id: 302, cat: "Wrap", name: "Falafel Dürüm", price: 150, kcal: 340, imgPackaged: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Falafel, humus, turşu, yeşillik (Tavuksuz).", ingredients: "Nohut falafel, ev yapımı humus, salatalık turşusu, maydanoz, lavaş.", macros: { protein: "12g", carbs: "50g", fat: "10g" } },
      { id: 303, cat: "Wrap", name: "Acılı Karnabahar", price: 155, kcal: 320, imgPackaged: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", tags: ["Vejeteryan", "Acılı"], desc: "Baharatlı karnabahar, yoğurt sos, marul.", ingredients: "Fırınlanmış acı soslu karnabahar, süzme yoğurt sos, marul, lavaş.", macros: { protein: "8g", carbs: "35g", fat: "14g" } },
      { id: 304, cat: "Wrap", name: "Tavuk Sezar Wrap", price: 165, kcal: 400, imgPackaged: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein"], desc: "Izgara tavuk, parmesan, sezar sos.", ingredients: "Izgara tavuk dilimleri, parmesan peyniri, sezar sos, marul, lavaş.", macros: { protein: "30g", carbs: "30g", fat: "18g" } },
      { id: 305, cat: "Wrap", name: "Thai Sebzeli", price: 160, kcal: 360, imgPackaged: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Tofu, renkli biberler, yer fıstığı sosu.", ingredients: "Tofu, kırmızı ve sarı biber, taze soğan, yer fıstığı sosu, lavaş.", macros: { protein: "15g", carbs: "40g", fat: "16g" } },
      { id: 401, cat: "Atıştırmalık", name: "Elma & Fıstık Ezmesi", price: 60, kcal: 190, imgPackaged: "https://images.unsplash.com/photo-1584559582128-b8be43b4342b?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1576675784432-994941412b3d?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Yeşil elma dilimleri, şekersiz fıstık ezmesi.", ingredients: "Granny Smith elma, %100 şekersiz fıstık ezmesi.", macros: { protein: "6g", carbs: "20g", fat: "10g" } },
      { id: 402, cat: "Atıştırmalık", name: "Humus & Kraker", price: 70, kcal: 240, imgPackaged: "https://images.unsplash.com/photo-1584559582128-b8be43b4342b?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Ev yapımı humus, tam tahıllı kraker.", ingredients: "Nohut, tahin, limon, zeytinyağı, tam buğday kraker.", macros: { protein: "8g", carbs: "30g", fat: "12g" } },
      { id: 403, cat: "Atıştırmalık", name: "Protein Topları", price: 55, kcal: 180, imgPackaged: "https://images.unsplash.com/photo-1584559582128-b8be43b4342b?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600", tags: ["Yüksek Protein"], desc: "Hurma, kakao, fındık topları.", ingredients: "Hurma püresi, kakao, fındık parçaları, whey protein tozu.", macros: { protein: "10g", carbs: "20g", fat: "8g" } },
      { id: 404, cat: "Atıştırmalık", name: "Chia Puding", price: 90, kcal: 220, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1579353977828-2a4eab54c8fa?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1584559582128-b8be43b4342b?auto=format&fit=crop&q=80&w=600", tags: ["Tatlı", "Vegan"], desc: "Hindistan cevizi sütü, chia, meyve.", ingredients: "Hindistan cevizi sütü, chia tohumu, agave şurubu, orman meyveleri.", macros: { protein: "6g", carbs: "25g", fat: "12g" } },
      { id: 405, cat: "Atıştırmalık", name: "Çiğ Kuruyemiş", price: 80, kcal: 260, imgPackaged: "https://images.unsplash.com/photo-1584559582128-b8be43b4342b?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?auto=format&fit=crop&q=80&w=600", tags: ["Vegan"], desc: "Badem, kaju, ceviz karışımı.", ingredients: "Çiğ badem, çiğ kaju, ceviz içi.", macros: { protein: "10g", carbs: "8g", fat: "22g" } },
      { id: 501, cat: "İçecek", name: "Green Juice", price: 85, kcal: 110, isPopular: true, imgPackaged: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=600", tags: ["Detox"], desc: "Ispanak, elma, limon, zencefil suyu.", ingredients: "Soğuk sıkım ıspanak, yeşil elma, salatalık, limon, zencefil.", macros: { protein: "2g", carbs: "26g", fat: "0g" } },
      { id: 502, cat: "İçecek", name: "Kombucha", price: 90, kcal: 40, imgPackaged: "https://images.unsplash.com/photo-1622597467961-f052d33a9080?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1622597467961-f052d33a9080?auto=format&fit=crop&q=80&w=600", tags: ["Probiyotik"], desc: "Doğal fermente çay.", ingredients: "Fermante siyah çay, şeker, probiyotik kültür.", macros: { protein: "0g", carbs: "10g", fat: "0g" } },
      { id: 503, cat: "İçecek", name: "Zencefil Shot", price: 55, kcal: 20, imgPackaged: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600", tags: ["Bağışıklık"], desc: "%100 zencefil ve limon suyu.", ingredients: "Taze zencefil suyu, limon suyu, zerdeçal, karabiber.", macros: { protein: "0g", carbs: "5g", fat: "0g" } },
      { id: 504, cat: "İçecek", name: "Cold Brew", price: 80, kcal: 5, imgPackaged: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600", tags: ["Kafein"], desc: "Soğuk demlenmiş kahve.", ingredients: "%100 Arabica kahve çekirdekleri, su.", macros: { protein: "0g", carbs: "1g", fat: "0g" } },
      { id: 505, cat: "İçecek", name: "Su", price: 25, kcal: 0, imgPackaged: "https://images.unsplash.com/photo-1560714235-d145ba2f8109?auto=format&fit=crop&q=80&w=600", imgPlated: "https://images.unsplash.com/photo-1560714235-d145ba2f8109?auto=format&fit=crop&q=80&w=600", tags: [], desc: "Cam şişe kaynak suyu.", ingredients: "Doğal kaynak suyu.", macros: { protein: "0g", carbs: "0g", fat: "0g" } },
  ];

  const uploadMenu = async () => {
    if (!confirm("Menüyü veritabanına yüklemek üzeresin. Bu işlemi sadece BİR KERE yapmalısın. Devam?")) return;
    const menuRef = collection(db, "products");
    let count = 0;
    for (const item of FULL_MENU_DATA) {
      await setDoc(doc(menuRef, item.id.toString()), item); 
      count++;
    }
    alert(`${count} ürün başarıyla veritabanına yüklendi! Artık bu butonu koddan silebilirsin.`);
  };

  return (
    <button onClick={uploadMenu} className="fixed bottom-4 left-4 z-[999] bg-red-600 text-white p-4 rounded-full shadow-xl font-bold border-4 border-white hover:bg-red-700 transition-colors">
      VERİTABANINI DOLDUR 🚀
    </button>
  );
};

// --- 4. SABİT VERİLER (Sadece Görüntüleme İçin) ---
const IMAGES = { 
  heroBg: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000", 
  appMockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
};

const LOCATIONS = [ 
    { id: 1, name: "Kanyon AVM", status: "active", stock: "Yüksek", distance: "200m" }, 
    { id: 2, name: "Zorlu PSM", status: "low", stock: "Azaldı", distance: "1.2km" }, 
    { id: 3, name: "Maslak 42", status: "active", stock: "Yüksek", distance: "3.5km" }, 
    { id: 4, name: "Kolektif House", status: "active", stock: "Yüksek", distance: "500m" }, 
    { id: 5, name: "Vadistanbul", status: "maintenance", stock: "Bakımda", distance: "6km" }
];

// --- 5. GLOBAL STATE ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authModalType, setAuthModalType] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null);

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
      isOfficeModalOpen, setIsOfficeModalOpen,
      legalModalType, setLegalModalType
    }}>
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => useContext(AppContext);

// --- 6. BİLEŞENLER ---

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
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <img src={CONFIG.logoUrl} alt="BeeCup" className="h-10 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
            <span className="font-bold text-2xl tracking-tight text-[#4F772D]">BeeCup</span>
          </div>
          {currentView === 'home' && (
            <div className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
                <a href="#menu" className="hover:text-[#4F772D] transition-colors">MENÜ</a>
                <a href="#app-section" className="hover:text-[#4F772D] transition-colors">UYGULAMA</a>
                <a href="#beebul" className="hover:text-[#4F772D] transition-colors">BEEBUL</a>
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute top-full left-0 w-full bg-white border-t shadow-lg z-50 overflow-hidden">
             <div className="flex flex-col p-6 gap-4 font-medium text-gray-600">
                <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menü</a>
                <a href="#app-section" onClick={() => setIsMenuOpen(false)}>Uygulama</a>
                <button onClick={() => { setIsOfficeModalOpen(true); setIsMenuOpen(false); }} className="text-left flex items-center gap-2 font-bold text-[#132A13]"><Building2 size={16}/> Kurumsal</button>
                {user ? <button onClick={handleLogout} className="text-red-500 text-left">Çıkış Yap</button> : <button onClick={() => {setAuthModalType('login'); setIsMenuOpen(false);}} className="text-[#4F772D] font-bold text-left">Giriş / Kayıt</button>}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- GÜVENLİ PROFİL SAYFASI ---
const ProfilePage = () => {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="min-h-screen bg-[#F7F9F4] pt-8 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-[#ECF39E] rounded-full flex items-center justify-center text-[#4F772D] font-bold text-3xl">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "M"}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#132A13]">Hoş Geldin, {user?.displayName || "Misafir"}</h1>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <div className="bg-[#132A13] text-white px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-full"><Gift size={24} /></div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Bal Puan</div>
                            <div className="text-2xl font-bold">0 BP</div>
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
                            <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                                <div className="bg-[#F0F5ED] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4F772D]"><Package size={32} /></div>
                                <h3 className="text-xl font-bold text-[#132A13] mb-2">Henüz Siparişin Yok</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">BeeCup otomatlarından veya mobil uygulamamızdan vereceğin siparişler burada listelenecek.</p>
                                <a href="#app-section" className="inline-flex items-center gap-2 text-[#4F772D] font-bold hover:underline">Uygulamayı İndirip Başla <ArrowRight size={16}/></a>
                            </div>
                        )}

                        {activeTab === 'cards' && (
                             <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                                <div className="bg-[#F0F5ED] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4F772D]"><CreditCard size={32} /></div>
                                <h3 className="text-xl font-bold text-[#132A13] mb-2">Kayıtlı Kart Bulunamadı</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">Güvenliğin için kredi kartı ve yemek kartı (Multinet, Sodexo) ekleme işlemleri sadece <strong>BeeCup Mobil Uygulaması</strong> üzerinden yapılabilir.</p>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold">MasterCard</span>
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold">Visa</span>
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-bold">Yemek Kartları</span>
                                </div>
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

const MenuSection = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Çok Sevilenler");

  // Veriyi Firebase'den Çekme
  useEffect(() => {
    const fetchProducts = async () => {
      if (!db) return;
      try {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: "Çok Sevilenler", icon: "⭐", label: "Çok Sevilenler" },
    { id: "Bowl", icon: "🥗", label: "Bowl" },
    { id: "Salata", icon: "🥬", label: "Salata" },
    { id: "Wrap", icon: "🌯", label: "Wrap" },
    { id: "Atıştırmalık", icon: "🍎", label: "Atıştırmalık" },
    { id: "İçecek", icon: "🥤", label: "İçecek" }
  ];

  const filteredItems = products.filter(item => {
    if(activeCat === "Çok Sevilenler") return item.isPopular;
    return item.cat === activeCat;
  });

  return (
    <section id="menu" className="py-24 bg-[#F7F9F4]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#132A13] mb-10">Menüyü Keşfet {loading && <span className="text-sm text-gray-400 font-normal">(Yükleniyor...)</span>}</h2>
        
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCat(cat.id)} 
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2 ${activeCat === cat.id ? 'bg-[#4F772D] text-white border-[#4F772D] shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-[#4F772D]'}`}
            >
              <span>{cat.icon}</span><span>{cat.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4F772D]" size={48} /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div 
                    key={item.id} 
                    onClick={() => onProductSelect(item)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-[#90A955] transition-all cursor-pointer group"
                    >
                        <div className="relative h-56 rounded-xl overflow-hidden mb-4 bg-gray-100">
                            <img src={item.imgPackaged} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" alt={item.name} />
                            <img src={item.imgPlated} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100" alt={item.name} />
                            
                            {item.tags && <div className="absolute top-2 left-2 flex gap-1 z-20"><span className="bg-white/90 text-[10px] font-bold px-2 py-1 rounded">{item.tags[0]}</span></div>}
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-[#132A13] text-lg">{item.name}</h3>
                            <span className="font-bold text-[#4F772D] text-lg">₺{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

const ProductDetailModal = ({ product, onClose }) => {
    const [isPlated, setIsPlated] = useState(true);
    if(!product) return null;
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl h-[85vh] flex flex-col md:flex-row relative shadow-2xl" onClick={e => e.stopPropagation()}>
                 <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100"><X size={20}/></button>
                 <div className="w-full md:w-1/2 bg-[#F7F9F4] flex flex-col items-center justify-center p-6 relative">
                    <motion.img key={isPlated ? "plated" : "packaged"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={isPlated ? product.imgPlated : product.imgPackaged} className="max-h-[300px] md:max-h-[400px] object-contain drop-shadow-2xl" />
                    <div className="flex gap-2 mt-6 bg-white/80 backdrop-blur p-1 rounded-full shadow-sm">
                        <button onClick={()=>setIsPlated(false)} className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${!isPlated ? 'bg-[#4F772D] text-white' : 'text-gray-500 hover:text-[#132A13]'}`}><Package size={14} /> Paket</button>
                        <button onClick={()=>setIsPlated(true)} className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-colors ${isPlated ? 'bg-[#4F772D] text-white' : 'text-gray-500 hover:text-[#132A13]'}`}><Utensils size={14} /> Servis</button>
                    </div>
                 </div>
                 <div className="w-full md:w-1/2 flex flex-col h-full">
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="flex justify-between items-start mb-2 pr-12"><div><div className="text-[#90A955] font-bold text-xs uppercase tracking-wider mb-1">{product.cat}</div><h2 className="text-3xl font-bold text-[#132A13] leading-tight">{product.name}</h2></div><div className="text-2xl font-bold text-[#4F772D]">₺{product.price}</div></div>
                        <div className="flex gap-2 mb-6">{product.tags?.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{tag}</span>)}</div>
                        <div className="space-y-6"><div><h4 className="font-bold text-[#132A13] text-sm mb-2">İçindekiler</h4><p className="text-gray-600 text-sm leading-relaxed">{product.ingredients || product.desc}</p></div>{product.macros && (<div className="bg-[#F7F9F4] p-4 rounded-xl border border-gray-100"><div className="grid grid-cols-4 gap-2 text-center divide-x divide-gray-200"><div><div className="text-[#4F772D] font-bold">{product.kcal}</div><div className="text-gray-400 text-[10px] uppercase">kcal</div></div><div><div className="font-bold text-gray-700">{product.macros.protein}</div><div className="text-gray-400 text-[10px] uppercase">Prot.</div></div><div><div className="font-bold text-gray-700">{product.macros.carbs}</div><div className="text-gray-400 text-[10px] uppercase">Karb.</div></div><div><div className="font-bold text-gray-700">{product.macros.fat}</div><div className="text-gray-400 text-[10px] uppercase">Yağ</div></div></div></div>)}</div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-white"><button onClick={() => { onClose(); document.getElementById('app-section').scrollIntoView({ behavior: 'smooth' }); }} className="w-full bg-[#4F772D] text-white py-4 rounded-xl font-bold hover:bg-[#3E6024] transition-all shadow-lg flex items-center justify-center gap-2"><Smartphone size={18} /> Uygulamadan Sipariş Ver</button></div>
                 </div>
            </motion.div>
        </div>
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
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 opacity-80 cursor-not-allowed" title="Çok Yakında"><div className="flex flex-col items-start"><span className="text-[10px] uppercase">Çok Yakında</span><span>App Store</span></div></button>
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 opacity-80 cursor-not-allowed" title="Çok Yakında"><div className="flex flex-col items-start"><span className="text-[10px] uppercase">Çok Yakında</span><span>Google Play</span></div></button>
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

// --- YASAL METİNLER ---
const LEGAL_TEXTS = {
    kvkk: { title: "KVKK Aydınlatma Metni", content: "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, BeeCup olarak kişisel verilerinizi sadece hizmetlerimizi sunmak, sipariş süreçlerini yönetmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla işliyoruz. Verileriniz üçüncü taraflarla izniniz olmadan paylaşılmaz. Detaylı bilgi için bizimle iletişime geçebilirsiniz." },
    privacy: { title: "Gizlilik Politikası", content: "BeeCup, kullanıcılarının gizliliğine saygı duyar. Bu web sitesi, kullanıcı deneyimini iyileştirmek ve analiz yapmak amacıyla Firebase gibi güvenli altyapı sağlayıcılarını kullanır. Kredi kartı bilgileriniz sunucularımızda saklanmaz, ödeme işlemleri lisanslı ödeme kuruluşları aracılığıyla şifreli olarak gerçekleştirilir." },
    terms: { title: "Kullanım Koşulları", content: "Bu web sitesini ziyaret ederek BeeCup'ın kullanım koşullarını kabul etmiş sayılırsınız. Sitedeki tüm içerik, görseller ve marka hakları BeeCup'a aittir. İzinsiz kopyalanamaz veya ticari amaçla kullanılamaz." }
};

const Footer = () => {
  const { setLegalModalType } = useAppContext();
  return (
    <footer className="text-white py-16 bg-[#132A13]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6"><span className="font-bold text-2xl">BeeCup.</span></div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">Doğal, sürdürülebilir ve teknolojik beslenme deneyimi.</p>
              <a href={CONFIG.instagramLink} target="_blank" className="inline-flex items-center gap-2 mt-6 text-[#90A955] hover:text-white transition-colors font-bold"><Instagram size={20}/> Instagram'da Takip Et</a>
          </div>
          <div>
              <h4 className="font-bold mb-6 text-[#90A955]">İletişim</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                  <li>Galatasaray Üniversitesi, Ortaköy</li>
                  <li>info@beecupco.com</li>
              </ul>
          </div>
          <div>
              <h4 className="font-bold mb-6 text-[#90A955]">Yasal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                  <li><button onClick={()=>setLegalModalType('kvkk')} className="hover:text-white text-left">KVKK Aydınlatma Metni</button></li>
                  <li><button onClick={()=>setLegalModalType('privacy')} className="hover:text-white text-left">Gizlilik Politikası</button></li>
                  <li><button onClick={()=>setLegalModalType('terms')} className="hover:text-white text-left">Kullanım Koşulları</button></li>
              </ul>
          </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">© 2025 BeeCup Inc. Tüm hakları saklıdır.</div>
    </footer>
  );
};

const LegalModal = () => {
    const { legalModalType, setLegalModalType } = useAppContext();
    if(!legalModalType) return null;
    const data = LEGAL_TEXTS[legalModalType];
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setLegalModalType(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-2xl max-w-2xl w-full relative" onClick={e=>e.stopPropagation()}>
                <button onClick={()=>setLegalModalType(null)} className="absolute top-4 right-4"><X/></button>
                <h2 className="text-2xl font-bold text-[#132A13] mb-4 flex items-center gap-2"><FileText size={24}/> {data.title}</h2>
                <div className="text-gray-600 text-sm leading-relaxed h-64 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-100">{data.content}</div>
                <div className="mt-4 text-xs text-gray-400 flex items-center gap-1"><Info size={12}/> Bu metin bilgilendirme amaçlıdır.</div>
            </motion.div>
        </div>
    );
};

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  useEffect(() => {
    document.title = "BeeCup | Şehrin En Taze Molası";
    const style = document.createElement('style');
    style.innerHTML = `html { scroll-behavior: smooth; } .font-display { font-family: 'Outfit', sans-serif; }`;
    document.head.appendChild(style);
    // GA4 Sayfa Görüntüleme
    if(CONFIG.gaMeasurementId) ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#132A13]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@300;400;600;800&display=swap'); body { font-family: 'DM Sans', sans-serif; }`}</style>
      
      <Navbar />

      {currentView === 'home' ? (
        <>
            <ScrollReveal><Hero /></ScrollReveal>
            <ScrollReveal delay={0.2}><MenuSection onProductSelect={setSelectedProduct} /></ScrollReveal>
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
      <LegalModal />
      
      <AnimatePresence>
        {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainLayout />
  </AppProvider>
);

export default App;