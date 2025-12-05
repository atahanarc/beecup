import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Save, X, LogOut, CheckCircle, Loader2 
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // onAuthStateChanged ekledik

// --- SANTRAL BAĞLANTILARI ---
import { db, auth } from '../firebase'; 
import { CONFIG } from '../context/AppContext';

const AdminPage = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true); // Kimlik kontrolü yapılıyor mu?
  const [isEditing, setIsEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Başlangıç Form Verisi
  const initialForm = {
    name: '', price: '', cat: 'Bowl', desc: '', 
    imgPackaged: '/yemekler/ege.jpg', imgPlated: '/yemekler/ege.jpg', 
    ingredients: '', kcal: '', isPopular: false,
    macros: { protein: '', carbs: '', fat: '' }
  };
  const [formData, setFormData] = useState(initialForm);

  // --- GÜVENLİK KONTROLÜ (GARANTİLİ YÖNTEM) ---
  useEffect(() => {
    // Firebase'e doğrudan soruyoruz: "Bu adam kim?"
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
            // 1. Giriş yapmamışsa
            alert("Lütfen önce giriş yapın.");
            navigate('/');
        } else if (currentUser.email !== CONFIG.adminEmail) {
            // 2. Giriş yapmış ama maili yanlışsa (Konsola yazdıralım ki hatayı gör)
            console.log("Giriş yapan:", currentUser.email, "Beklenen:", CONFIG.adminEmail);
            alert(`Bu alana giriş yetkiniz yok! (${currentUser.email})`);
            navigate('/');
        } else {
            // 3. HOŞ GELDİN PATRON!
            setAuthChecking(false); // Kontrol bitti, kapıyı aç
            fetchProducts(); // Ürünleri getir
        }
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- ÜRÜNLERİ GETİR ---
  const fetchProducts = async () => {
    setLoading(true);
    if (!db) return;
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
    } catch (error) {
        console.error("Hata:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- KAYDETME FONKSİYONU ---
  const handleSave = async () => {
    if (!formData.name || !formData.price) return alert("Lütfen isim ve fiyat giriniz.");
    
    try {
        if (isEditing) {
            await updateDoc(doc(db, "products", isEditing), formData);
            alert("Ürün güncellendi! ✅");
        } else {
            await addDoc(collection(db, "products"), formData);
            alert("Yeni ürün eklendi! 🎉");
        }
        setIsAdding(false);
        setIsEditing(null);
        setFormData(initialForm);
        fetchProducts(); 
    } catch (e) {
        console.error("Hata:", e);
        alert("Bir sorun oluştu.");
    }
  };

  // --- SİLME FONKSİYONU ---
  const handleDelete = async (id) => {
      if(window.confirm("Bu ürünü silmek istediğine emin misin?")) {
          try {
              await deleteDoc(doc(db, "products", id));
              fetchProducts();
          } catch (e) { console.error(e); }
      }
  };

  // --- DÜZENLEMEYİ BAŞLAT ---
  const startEdit = (product) => {
      setFormData(product);
      setIsEditing(product.id);
      setIsAdding(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // EĞER KİMLİK KONTROLÜ SÜRÜYORSA YÜKLENİYOR GÖSTER (Seni hemen atmasın)
  if (authChecking) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-[#132A13]">
              <Loader2 size={48} className="animate-spin mb-4 text-[#4F772D]" />
              <h2 className="text-xl font-bold">Güvenlik Kontrolü Yapılıyor...</h2>
              <p className="text-gray-500 text-sm">Lütfen bekleyin.</p>
          </div>
      );
  }

  // --- ANA EKRAN ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20 pt-24">
      {/* ÜST YÖNETİM BARI */}
      <div className="bg-[#132A13] text-white p-4 fixed top-0 w-full z-50 shadow-lg flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
              <div className="bg-[#4F772D] px-3 py-1 rounded-lg font-bold tracking-wider text-sm md:text-base">PANEL</div>
              <span className="font-serif text-lg hidden md:inline">BeeCup Yönetim</span>
          </div>
          <div className="flex gap-4 items-center">
              <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Siteye Dön</button>
              <button onClick={() => { signOut(auth); navigate('/'); }} className="bg-red-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-700 transition-colors">
                  <LogOut size={14}/> Çıkış
              </button>
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* BAŞLIK & EKLE BUTONU */}
        <div className="flex justify-between items-center mb-8 mt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                Ürünler <span className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">{products.length}</span>
            </h1>
            <button 
                onClick={() => { setIsAdding(!isAdding); setIsEditing(null); setFormData(initialForm); }} 
                className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 ${isAdding ? 'bg-gray-600 text-white' : 'bg-[#4F772D] text-white hover:bg-[#3E6024]'}`}
            >
                {isAdding ? <><X size={20}/> İptal</> : <><Plus size={20}/> Yeni Ürün</>}
            </button>
        </div>

        {/* --- FORM ALANI --- */}
        {isAdding && (
            <div className="bg-white p-8 rounded-3xl shadow-xl mb-10 border border-gray-200 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#132A13] flex items-center gap-2">
                        {isEditing ? <Edit size={20}/> : <Plus size={20}/>}
                        {isEditing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SOL KOLON: Bilgiler */}
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Ürün Adı</label>
                            <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white transition-colors" placeholder="Örn: Ege Tabağı" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Fiyat (₺)</label>
                                <input type="number" value={formData.price} onChange={e=>setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" placeholder="150" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Kategori</label>
                                <select value={formData.cat} onChange={e=>setFormData({...formData, cat: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white cursor-pointer">
                                    <option value="Bowl">Bowl</option>
                                    <option value="Salata">Salata</option>
                                    <option value="Wrap">Wrap</option>
                                    <option value="Atıştırmalık">Atıştırmalık</option>
                                    <option value="İçecek">İçecek</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Açıklama</label>
                            <textarea rows="4" value={formData.desc} onChange={e=>setFormData({...formData, desc: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white resize-none" placeholder="Ürün detayları..." />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">İçindekiler</label>
                            <input value={formData.ingredients} onChange={e=>setFormData({...formData, ingredients: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" placeholder="Nohut, roka, domates..." />
                        </div>
                    </div>

                    {/* SAĞ KOLON: Resimler ve Detaylar */}
                    <div className="space-y-5">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-bold text-sm mb-3">Resim Yolları (Örn: /yemekler/resim.jpg)</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Paketli Resim</label>
                                    <input value={formData.imgPackaged} onChange={e=>setFormData({...formData, imgPackaged: e.target.value})} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="/yemekler/ege.jpg" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Tabak Resim</label>
                                    <input value={formData.imgPlated} onChange={e=>setFormData({...formData, imgPlated: e.target.value})} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="/yemekler/ege.jpg" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase">Kcal</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={formData.kcal} onChange={e=>setFormData({...formData, kcal: e.target.value})}/></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase">Protein</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={formData.macros?.protein} onChange={e=>setFormData({...formData, macros: {...formData.macros, protein: e.target.value}})}/></div>
                            <div><label className="text-[10px] font-bold text-gray-400 uppercase">Karb</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={formData.macros?.carbs} onChange={e=>setFormData({...formData, macros: {...formData.macros, carbs: e.target.value}})}/></div>
                        </div>

                        <div className="flex gap-2 items-center p-4 bg-yellow-50 rounded-xl border border-yellow-100 cursor-pointer" onClick={() => setFormData({...formData, isPopular: !formData.isPopular})}>
                            <input type="checkbox" checked={formData.isPopular} onChange={()=>{}} className="w-5 h-5 accent-[#4F772D]" />
                            <label className="text-sm font-bold text-gray-700 cursor-pointer">Bu ürün "Popüler" listesinde görünsün</label>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Vazgeç</button>
                    <button onClick={handleSave} className="bg-[#4F772D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3E6024] shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                        <Save size={20}/> {isEditing ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
                    </button>
                </div>
            </div>
        )}

        {/* --- ÜRÜN LİSTESİ --- */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {products.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:border-[#4F772D] transition-all group">
                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-200 relative">
                            <img 
                                src={item.imgPackaged} 
                                className="w-full h-full object-cover" 
                                alt="Ürün"
                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Resim+Yok'; }}
                            />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <h3 className="font-bold text-lg text-[#132A13]">{item.name}</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">{item.cat}</span>
                                {item.isPopular && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded border border-yellow-200 flex items-center gap-1"><CheckCircle size={10}/> Popüler</span>}
                            </div>
                            <p className="text-xs text-gray-400 truncate max-w-md">{item.desc}</p>
                        </div>

                        <div className="text-xl font-bold text-[#4F772D] bg-green-50 px-3 py-1 rounded-lg">₺{item.price}</div>

                        <div className="flex gap-2">
                            <button onClick={() => startEdit(item)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100" title="Düzenle">
                                <Edit size={18}/>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-100" title="Sil">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;