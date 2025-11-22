import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Menu, X, ChevronDown, Leaf, ArrowRight, Sparkles, Send, User, LogIn, ShoppingBag, Phone, MessageCircle, Check, Zap, Filter, Mail, Star, Heart, Trash2, Plus, Minus, Info, Package, Utensils, LogOut, Eye, EyeOff, Loader2 } from 'lucide-react';
// Firebase İçe Aktarımları
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, signInAnonymously, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, addDoc, collection } from 'firebase/firestore';
// EmailJS İçe Aktarımı
import emailjs from '@emailjs/browser';

// --- AYARLAR ---
const LOGO_URL = "/logo.png"; 
const APP_LINK = "https://gemini.google.com/share/4fc04afd1c2a";
const ADMIN_EMAIL = "info@beecupco.com"; 

// --- YAPAY ZEKA (GEMINI) ANAHTARI ---
const apiKey = "AIzaSyAx9MQ8BZd3nzp9yTddorJ5w2ttYYlOSIw";

// --- EMAILJS AYARLARI ---
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_ggxh0x9", // Eğer çalışmazsa panelden kontrol et (service_5nludkm olabilir)
  TEMPLATE_ID_WELCOME: "template_7fj3mce", 
  TEMPLATE_ID_FEEDBACK: "template_g29anfl", 
  PUBLIC_KEY: "_m2hMVBLwxednDRNg"
};

// --- FIREBASE KURULUMU ---
const firebaseConfig = {
  apiKey: "AIzaSyAxOqxvqD72VOqCKKl-dH2I-VkUhJonslA",
  authDomain: "beecup-5ad27.firebaseapp.com",
  projectId: "beecup-5ad27",
  storageBucket: "beecup-5ad27.firebasestorage.app",
  messagingSenderId: "586223080700",
  appId: "1:586223080700:web:c72de78fefe5e884d6b379",
  measurementId: "G-XHMEKVW5ZW"
};

// Güvenli başlatma
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase başlatılamadı:", e);
}

// --- GENEL GÖRSELLER (KALİTELİ OLANLAR) ---
const IMAGES = {
  heroBg: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000",
  appMockup: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
};

// --- LOKASYONLAR ---
const LOCATIONS = [
  { id: 1, name: "Kanyon AVM", status: "active", stock: "Yüksek", distance: "200m" },
  { id: 2, name: "Zorlu PSM", status: "low", stock: "Azaldı", distance: "1.2km" },
  { id: 3, name: "Maslak 42", status: "active", stock: "Yüksek", distance: "3.5km" },
  { id: 4, name: "Kolektif House", status: "active", stock: "Yüksek", distance: "500m" },
  { id: 5, name: "Vadistanbul", status: "maintenance", stock: "Bakımda", distance: "6km" },
  { id: 6, name: "Ferko Signature", status: "active", stock: "Orta", distance: "800m" },
  { id: 7, name: "Teknopark İst.", status: "active", stock: "Yüksek", distance: "15km" },
];

// --- MENÜ (DOĞRU RESİMLİ VERSİYON) ---
const FULL_MENU = [
  { 
    id: 101, cat: "Bowl", name: "Ege Rüyası", price: 195, kcal: 420, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    imgPlated: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
    tags: ["Yüksek Protein", "Glutensiz"], desc: "Izgara tavuk, kinoa, nar, ceviz ve yeşillikler.",
    ingredients: "Marine edilmiş ızgara tavuk göğsü, haşlanmış kinoa, mevsim yeşillikleri, ayıklanmış nar taneleri, yerli ceviz içi.",
    macros: { protein: "32g", carbs: "45g", fat: "12g" }
  },
  { 
    id: 102, cat: "Bowl", name: "Somon Poke", price: 240, kcal: 510, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600", 
    tags: ["Omega-3", "Glutensiz"], desc: "Taze somon küpleri, avokado, edamame, salatalık.",
    ingredients: "Norveç somonu, dilimlenmiş avokado, soya fasulyesi (edamame), salatalık, susam, suşi pirinci.",
    macros: { protein: "28g", carbs: "50g", fat: "18g" }
  },
  { 
    id: 103, cat: "Bowl", name: "Teriyaki Tavuk", price: 210, kcal: 480, isPopular: false,
    imgPackaged: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600", 
    tags: ["Sıcak"], desc: "Teriyaki soslu tavuk, pirinç, brokoli, susam.",
    ingredients: "Teriyaki soslu tavuk but, yasemin pirinci, haşlanmış brokoli, susam, taze soğan.",
    macros: { protein: "30g", carbs: "55g", fat: "10g" }
  },
  { 
    id: 104, cat: "Bowl", name: "Falafel Humus", price: 180, kcal: 390, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1541518763179-0e34e424fb23?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vegan"], desc: "Çıtır falafel, pancarlı humus, roka, tahin sos.",
    ingredients: "Ev yapımı falafel topları, pancarlı humus, bebek roka, çeri domates, tahin sos.",
    macros: { protein: "15g", carbs: "40g", fat: "14g" }
  },
  { 
    id: 105, cat: "Bowl", name: "Mexican Fiesta", price: 220, kcal: 550, isPopular: false,
    imgPackaged: "https://images.unsplash.com/photo-1582499814723-22442273e626?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600", 
    tags: ["Acılı", "Vejeteryan"], desc: "Siyah fasulye, mısır, jalapeno, guacamole, salsa.",
    ingredients: "Meksika fasulyesi, mısır, jalapeno turşusu, guacamole, domates salsa, esmer pirinç.",
    macros: { protein: "18g", carbs: "60g", fat: "20g" }
  },
  { 
    id: 201, cat: "Salata", name: "Sezar Klasik", price: 170, kcal: 350, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1620917670397-a331343d3c64?auto=format&fit=crop&q=80&w=600", 
    tags: ["Klasik"], desc: "Roman marulu, parmesan, kruton, sezar sos.",
    ingredients: "Taze roman marulu, parmesan peyniri rendesi, fırınlanmış kruton ekmekler, özel sezar sos.",
    macros: { protein: "12g", carbs: "25g", fat: "22g" }
  },
  { 
    id: 202, cat: "Salata", name: "Tulum Peynirli", price: 160, kcal: 280, 
    imgPackaged: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vejeteryan"], desc: "Roka, tulum peyniri, ceviz, nar ekşisi.",
    ingredients: "Taze roka, İzmir tulum peyniri, ceviz içi, kurutulmuş domates, nar ekşisi sosu.",
    macros: { protein: "14g", carbs: "10g", fat: "18g" }
  },
  { 
    id: 203, cat: "Salata", name: "Asya Çıtır", price: 185, kcal: 320, 
    imgPackaged: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1606757365690-3423421c933c?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vegan"], desc: "Lahana, havuç, yer fıstığı, zencefilli sos.",
    ingredients: "Kırmızı ve beyaz lahana, rendelenmiş havuç, kavrulmuş yer fıstığı, edamame.",
    macros: { protein: "10g", carbs: "20g", fat: "15g" }
  },
  { 
    id: 204, cat: "Salata", name: "Ton Balıklı", price: 195, kcal: 400, isPopular: false,
    imgPackaged: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?auto=format&fit=crop&q=80&w=600", 
    tags: ["Yüksek Protein"], desc: "Ton balığı, yumurta, mısır, dereotu.",
    ingredients: "Yağı süzülmüş ton balığı, haşlanmış yumurta, süt mısır, dereotu, göbek marul.",
    macros: { protein: "35g", carbs: "15g", fat: "18g" }
  },
  { 
    id: 205, cat: "Salata", name: "Yeşil Detoks", price: 165, kcal: 250, 
    imgPackaged: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600", 
    tags: ["Diyet", "Vegan"], desc: "Ispanak, yeşil elma, kereviz sapı, limon sos.",
    ingredients: "Bebek ıspanak, dilimlenmiş yeşil elma, kereviz sapı, salatalık, maydanoz, limon sosu.",
    macros: { protein: "5g", carbs: "25g", fat: "8g" }
  },
  { 
    id: 301, cat: "Wrap", name: "Hindi Füme", price: 160, kcal: 380, isPopular: true,
    imgPackaged: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", 
    tags: ["Yüksek Protein"], desc: "Tam buğday lavaş, hindi füme, labne.",
    ingredients: "Tam buğday unlu lavaş, hindi füme dilimleri, labne peyniri, marul, salatalık.",
    macros: { protein: "25g", carbs: "40g", fat: "12g" }
  },
  { 
    id: 302, cat: "Wrap", name: "Falafel Dürüm", price: 150, kcal: 340, 
    imgPackaged: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vegan"], desc: "Falafel, humus, turşu, yeşillik (Tavuksuz).",
    ingredients: "Nohut falafel, ev yapımı humus, salatalık turşusu, maydanoz, lavaş.",
    macros: { protein: "12g", carbs: "50g", fat: "10g" }
  },
  { 
    id: 303, cat: "Wrap", name: "Acılı Karnabahar", price: 155, kcal: 320, 
    imgPackaged: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vejeteryan", "Acılı"], desc: "Baharatlı karnabahar, yoğurt sos, marul.", 
    ingredients: "Fırınlanmış acı soslu karnabahar, süzme yoğurt sos, marul, lavaş.", 
    macros: { protein: "8g", carbs: "35g", fat: "14g" } 
  },
  { 
    id: 304, cat: "Wrap", name: "Tavuk Sezar Wrap", price: 165, kcal: 400, 
    imgPackaged: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600", 
    tags: ["Yüksek Protein"], desc: "Izgara tavuk, parmesan, sezar sos.", 
    ingredients: "Izgara tavuk dilimleri, parmesan peyniri, sezar sos, marul, lavaş.", 
    macros: { protein: "30g", carbs: "30g", fat: "18g" } 
  },
  { 
    id: 305, cat: "Wrap", name: "Thai Sebzeli", price: 160, kcal: 360, 
    imgPackaged: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=600", 
    imgPlated: "https://images.unsplash.com/photo-1625937329053-2db3839846c8?auto=format&fit=crop&q=80&w=600", 
    tags: ["Vegan"], desc: "Tofu, renkli biberler, yer fıstığı sosu.", 
    ingredients: "Tofu, kırmızı ve sarı biber, taze soğan, yer fıstığı sosu, lavaş.", 
    macros: { protein: "15g", carbs: "40g", fat: "16g" } 
  },
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

// --- BİLEŞENLER ---

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  const [isPlated, setIsPlated] = useState(true);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl h-[85vh] flex flex-col md:flex-row relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white p-2 rounded-full hover:bg-gray-100 shadow-md"><X size={24} className="text-gray-600" /></button>
        <div className="w-full md:w-1/2 bg-[#F7F9F4] flex flex-col items-center justify-center p-6 relative overflow-hidden h-56 md:h-full shrink-0">
          <motion.img key={isPlated ? "plated" : "packaged"} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} src={isPlated ? product.imgPlated : product.imgPackaged} className="w-full h-full object-contain drop-shadow-2xl max-h-[300px] md:max-h-[400px]" />
          <div className="flex gap-2 mt-4 bg-white/80 backdrop-blur p-1 rounded-full shadow-sm z-10">
             <button onClick={() => setIsPlated(false)} className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${!isPlated ? 'bg-[#4F772D] text-white' : 'text-gray-500'}`}><Package size={14} /> Paket</button>
             <button onClick={() => setIsPlated(true)} className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${isPlated ? 'bg-[#4F772D] text-white' : 'text-gray-500'}`}><Utensils size={14} /> Servis</button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
            <div className="flex justify-between items-start mb-2 pr-12"><div><div className="text-[#90A955] font-bold text-xs uppercase tracking-wider mb-1">{product.cat}</div><h2 className="text-2xl md:text-3xl font-bold text-[#132A13] leading-tight">{product.name}</h2></div><div className="text-xl md:text-2xl font-bold text-[#4F772D]">₺{product.price}</div></div>
            <div className="flex gap-2 flex-wrap mb-4">{product.tags.map(tag => (<span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">{tag}</span>))}</div>
            <div className="space-y-4"><div><h4 className="font-bold text-[#132A13] text-sm mb-1">İçindekiler</h4><p className="text-gray-600 text-sm leading-snug">{product.ingredients}</p></div>{product.macros && (<div className="bg-[#F7F9F4] p-3 rounded-lg border border-gray-100"><div className="grid grid-cols-4 gap-2 text-center divide-x divide-gray-200"><div><div className="text-[#4F772D] font-bold text-sm">{product.kcal}</div><div className="text-gray-400 text-[10px]">kcal</div></div><div><div className="font-bold text-gray-700 text-sm">{product.macros.protein}</div><div className="text-gray-400 text-[10px]">Prot.</div></div><div><div className="font-bold text-gray-700 text-sm">{product.macros.carbs}</div><div className="text-gray-400 text-[10px]">Karb.</div></div><div><div className="font-bold text-gray-700 text-sm">{product.macros.fat}</div><div className="text-gray-400 text-[10px]">Yağ</div></div></div></div>)}</div>
          </div>
          <div className="p-5 border-t border-gray-100 bg-white shrink-0 z-10"><button onClick={() => { onAddToCart(product); onClose(); }} className="w-full bg-[#4F772D] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#3E6024] transition-all shadow-md flex items-center justify-center gap-2 active:scale-95">Sepete Ekle <ShoppingBag size={18} /></button></div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-[60]" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F7F9F4]"><h2 className="text-xl font-bold text-[#132A13] flex items-center gap-2"><ShoppingBag className="text-[#4F772D]" /> Sepetim</h2><button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">{cart.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4"><ShoppingBag size={64} className="opacity-20" /><p>Sepetin henüz boş.</p><button onClick={onClose} className="text-[#4F772D] font-bold hover:underline">Menüye Göz At</button></div>) : (cart.map((item) => (<motion.div layout key={item.cartId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><img src={item.imgPackaged} className="w-16 h-16 object-cover rounded-lg" /><div className="flex-1"><h4 className="font-bold text-[#132A13] text-sm">{item.name}</h4><p className="text-xs text-gray-500">{item.cat}</p><p className="font-bold text-[#4F772D] mt-1 text-sm">₺{item.price}</p></div><button onClick={() => removeFromCart(item.cartId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16} /></button></motion.div>)))}</div>
            {cart.length > 0 && (<div className="p-6 border-t border-gray-100 bg-white"><div className="flex justify-between items-center mb-6 text-lg font-bold text-[#132A13]"><span>Toplam</span><span>₺{total}</span></div><button className="w-full bg-[#4F772D] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#3E6024] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">Siparişi Tamamla <ArrowRight size={18} /></button></div>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- AUTH MODAL ---
const AuthModal = ({ type, onClose }) => {
  const [mode, setMode] = useState(type); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { setMode(type); setError(''); setSuccessMsg(''); }, [type]);

  const sendWelcomeEmail = (userName, userEmail) => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_WELCOME,
        { to_name: userName, to_email: userEmail },
        EMAILJS_CONFIG.PUBLIC_KEY
      ).then(() => {}, (err) => console.error(err));
    }
  };

  const handlePasswordReset = async () => {
    if (!email) { setError("Lütfen e-posta adresinizi yazın."); return; }
    setLoading(true); setError(''); setSuccessMsg('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Sıfırlama bağlantısı e-postana gönderildi! 📧");
      setTimeout(() => { setMode('login'); setSuccessMsg(''); }, 4000);
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
      else if (err.code === 'auth/invalid-email') setError("Geçersiz e-posta formatı.");
      else setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { creationTime, lastSignInTime } = user.metadata;
      const isNewUser = creationTime === lastSignInTime;

      if (db) {
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName,
          email: user.email,
          role: 'customer',
          lastLogin: new Date()
        }, { merge: true });
      }
      if (isNewUser) sendWelcomeEmail(user.displayName, user.email);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Google ile giriş yapılamadı.");
    }
  };

  const handleSubmit = async () => {
    if (!auth) { setError("Firebase bağlantısı yok!"); return; }
    setLoading(true); setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        if (db) {
           await setDoc(doc(db, 'users', cred.user.uid), { fullName, email, createdAt: new Date(), role: 'customer' });
        }
        sendWelcomeEmail(fullName, email);
      }
      onClose();
    } catch (err) {
      let msg = "Bir hata oluştu.";
      if (err.code === 'auth/email-already-in-use') msg = "Bu e-posta zaten kullanımda.";
      else if (err.code === 'auth/weak-password') msg = "Şifre çok zayıf.";
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') msg = "E-posta veya şifre hatalı.";
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#132A13] mb-2">{mode === 'login' ? "Giriş Yap" : mode === 'register' ? "Kayıt Ol" : "Şifre Yenileme"}</h2>
          {mode === 'reset' && <p className="text-sm text-gray-500">E-posta adresini gir, sana sıfırlama linki gönderelim.</p>}
        </div>
        <div className="space-y-4">
           {mode === 'reset' ? (
             <>
               <input type="email" placeholder="E-posta" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} />
               {successMsg && <div className="text-green-600 text-sm text-center font-bold bg-green-50 p-2 rounded-lg">{successMsg}</div>}
               {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
               <button onClick={handlePasswordReset} disabled={loading} className="w-full bg-[#4F772D] text-white py-3 rounded-xl font-bold hover:bg-[#3E6024] transition-colors disabled:opacity-50">{loading ? "Gönderiliyor..." : "Bağlantı Gönder"}</button>
               <button onClick={() => setMode('login')} className="w-full text-gray-500 text-sm font-bold hover:text-[#4F772D] mt-2">Giriş Yap'a Dön</button>
             </>
           ) : (
             <>
               <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google ile Devam Et</button>
               <div className="flex items-center gap-3 my-4"><div className="h-px bg-gray-200 flex-1"></div><span className="text-gray-400 text-sm">veya</span><div className="h-px bg-gray-200 flex-1"></div></div>
               {mode === 'register' && <input type="text" placeholder="Adın Soyadın" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none" value={fullName} onChange={e => setFullName(e.target.value)} />}
               <input type="email" placeholder="E-posta" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} />
               <div className="relative"><input type={showPassword ? "text" : "password"} placeholder="Şifre" className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none pr-10" value={password} onChange={e => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400"><Eye size={20} /></button></div>
               {mode === 'login' && (<div className="flex justify-end"><button onClick={() => setMode('reset')} className="text-xs text-gray-500 hover:text-[#4F772D] font-medium">Şifremi Unuttum?</button></div>)}
               {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
               <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#4F772D] text-white py-3 rounded-xl font-bold hover:bg-[#3E6024] transition-colors disabled:opacity-50">{loading ? "İşlem yapılıyor..." : (mode === 'login' ? "Giriş Yap" : "Üye Ol")}</button>
             </>
           )}
        </div>
      </motion.div>
    </div>
  );
};

// --- GÖRÜŞ BİLDİR ---
const FeedbackSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null);

  const sendFeedbackEmail = () => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_FEEDBACK,
        { from_name: name, from_email: email, message: msg, to_email: ADMIN_EMAIL },
        EMAILJS_CONFIG.PUBLIC_KEY
      ).then(() => {}, (err) => console.error(err));
    }
  };

  const handleSubmit = async () => {
    if(!name || !email || !msg) return;
    setStatus('loading');
    try {
        if (db) { await addDoc(collection(db, 'feedback'), { name, email, message: msg, createdAt: new Date() }); }
        sendFeedbackEmail();
        setStatus('success'); setTimeout(() => setStatus(null), 3000);
        setName(''); setEmail(''); setMsg('');
    } catch (e) {
        console.error("Feedback error:", e);
        setStatus('success'); setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <section id="feedback" className="bg-[#132A13] py-16 text-white border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Görüşlerin Bizim İçin Değerli</h2>
        <p className="text-gray-400 mb-8">Deneyimlerini paylaş, BeeCup'ı birlikte geliştirelim.</p>
        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Adın" className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#4F772D] outline-none" /><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="E-posta Adresin" className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#4F772D] outline-none" /></div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Öneri veya şikayetin..." rows="4" className="w-full bg-black/20 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#4F772D] outline-none mb-4"></textarea>
          <button onClick={handleSubmit} disabled={status === 'loading' || status === 'success'} className="bg-[#4F772D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3E6024] transition-colors w-full md:w-auto flex items-center justify-center gap-2">{status === 'loading' ? <Loader2 className="animate-spin" /> : status === 'success' ? "Gönderildi!" : "Gönder"}</button>
        </div>
      </div>
    </section>
  );
};

// --- AI CHAT WIDGET (GEMINI 1.5 FLASH - HATA LOGLAMALI) ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Merhaba! Ben BeeCup Asistanı. Bugün senin için ne hazırlayalım? 🥗" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input; setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    try {
      if (!apiKey) throw new Error("API Key eksik");
      const systemPrompt = `Sen BeeCup'ın asistanısın. Menü: ${JSON.stringify(FULL_MENU)}. Kullanıcıya kısa, samimi ve satışa yönlendirici öneriler yap.`;
      
      // v1beta ve gemini-1.5-flash URL'si
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ 
              contents: [{ 
                  parts: [{ text: systemPrompt + " Müşteri dedi ki: " + userText }] 
              }] 
          }) 
      });

      if (!response.ok) {
          // Hata durumunda konsola detay basalım
          const errData = await response.json().catch(() => ({}));
          console.error("AI HATA:", response.status, errData);
          throw new Error(`API Hatası: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Harika bir seçim!";
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (e) { 
        console.error("AI Hatası:", e);
        setMessages(prev => [...prev, { role: 'assistant', text: "Şu an bağlantı kuramıyorum ama menümüz harika! 🥗" }]); 
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 text-white p-4 rounded-full shadow-2xl flex items-center justify-center bg-[#4F772D]">{isOpen ? <X /> : <MessageCircle size={28} />}</motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[500px]">
            <div className="p-4 text-white flex items-center gap-2 bg-[#4F772D]"><Sparkles size={18} /><span className="font-bold">BeeCup Asistan</span></div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#F9F9F9] min-h-[300px]">{messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-[#90A955] text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>{m.text}</div></div>))} {loading && <div className="text-xs text-gray-400 ml-2">Yazıyor...</div>}<div ref={chatEndRef} /></div>
            <div className="p-3 bg-white border-t"><div className="flex items-center bg-gray-100 rounded-full px-4 py-2"><input className="flex-1 bg-transparent outline-none text-sm" placeholder="Mesaj yaz..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} /><button onClick={handleSend} className="text-[#4F772D]"><Send size={18} /></button></div></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;