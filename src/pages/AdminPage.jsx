import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit, Trash2, Save, X, LogOut, CheckCircle, Loader2, Package, MapPin
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// --- SANTRAL BAĞLANTILARI ---
import { db, auth } from '../firebase';
import { CONFIG } from '../context/AppContext';

const AdminPage = () => {
    const navigate = useNavigate();

    // --- STATE YÖNETİMİ ---
    const [activeTab, setActiveTab] = useState('products'); // 'products' | 'locations' | 'inventory'
    const [loading, setLoading] = useState(true);
    const [authChecking, setAuthChecking] = useState(true);

    // Veriler
    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    // Stok Yönetimi State'leri
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [stockMap, setStockMap] = useState({}); // { ürünId: adet }
    const [stockSaving, setStockSaving] = useState(false);

    // Form Durumu
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form Verileri (İki taraf için de tek state kullanabiliriz veya ayırabiliriz. Basitlik için tek obje)
    const productInitial = {
        name: '', price: '', cat: 'Bowl', desc: '',
        imgPackaged: '/yemekler/ege.jpg', imgPlated: '/yemekler/ege.jpg',
        ingredients: '', kcal: '', isPopular: false,
        macros: { protein: '', carbs: '', fat: '' }
    };

    const locationInitial = {
        name: '', status: 'active', stockStatus: 'Yüksek', description: '',
        city: 'İstanbul', district: 'Şişli',
        latitude: '', longitude: ''
    };

    const [formData, setFormData] = useState(productInitial);

    // --- GÜVENLİK ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                alert("Lütfen önce giriş yapın.");
                navigate('/');
            } else if (currentUser.email !== CONFIG.adminEmail) {
                console.log("Yetkisiz Giriş:", currentUser.email);
                alert("Bu alana giriş yetkiniz yok!");
                navigate('/');
            } else {
                setAuthChecking(false);
                fetchAllData();
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // --- VERİ ÇEKME ---
    const fetchAllData = async () => {
        setLoading(true);
        if (!db) return;
        try {
            // Ürünleri Çek
            const prodSnap = await getDocs(collection(db, "products"));
            setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Lokasyonları Çek
            const locSnap = await getDocs(collection(db, "locations"));
            setLocations(locSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Veri hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- STOK YÖNETİMİ ---
    const handleLocationSelect = (locId) => {
        setSelectedLocationId(locId);
        if (!locId) {
            setStockMap({});
            return;
        }
        const loc = locations.find(l => l.id === locId);
        // Eğer lokasyonda inventory varsa onu al, yoksa boş obje
        setStockMap(loc?.inventory || {});
    };

    const handleStockChange = (prodId, qty) => {
        setStockMap(prev => ({
            ...prev,
            [prodId]: parseInt(qty) || 0
        }));
    };

    const saveStock = async () => {
        if (!selectedLocationId) return alert("Lokasyon seçmediniz.");
        setStockSaving(true);
        try {
            // Lokasyon dokümanını güncelle (inventory alanını)
            const locRef = doc(db, 'locations', selectedLocationId);
            await updateDoc(locRef, {
                inventory: stockMap,
                lastStockUpdate: new Date().toISOString()
            });

            // Local state'i de güncelle ki ekranda eski kalmasın
            setLocations(prev => prev.map(loc =>
                loc.id === selectedLocationId ? { ...loc, inventory: stockMap } : loc
            ));

            alert("Stoklar güncellendi! ✅");
        } catch (error) {
            console.error("Stok kayıt hatası:", error);
            alert("Kaydedilemedi!");
        } finally {
            setStockSaving(false);
        }
    };

    // --- KAYDETME ---
    const handleSave = async () => {
        if (!formData.name) return alert("Lütfen isim giriniz.");

        const collectionName = activeTab === 'products' ? 'products' : 'locations';

        try {
            if (editingId) {
                // Güncelleme (ID'yi string'e çeviriyoruz!)
                await updateDoc(doc(db, collectionName, String(editingId)), formData);
                alert("Güncellendi! ✅");
            } else {
                // Ekleme
                await addDoc(collection(db, collectionName), formData);
                alert("Eklendi! 🎉");
            }
            resetForm();
            fetchAllData();
        } catch (e) {
            console.error("Hata:", e);
            alert("Bir sorun oluştu.");
        }
    };

    // --- SİLME ---
    const handleDelete = async (id) => {
        if (window.confirm("Silmek istediğine emin misin?")) {
            const collectionName = activeTab === 'products' ? 'products' : 'locations';
            try {
                await deleteDoc(doc(db, collectionName, String(id)));
                fetchAllData();
            } catch (e) { console.error(e); }
        }
    };

    // --- YARDIMCILAR ---
    const resetForm = (targetTab = activeTab) => {
        setIsAdding(false);
        setEditingId(null);
        setFormData(targetTab === 'products' ? productInitial : locationInitial);
    };

    const startEdit = (item) => {
        setFormData(item);
        setEditingId(item.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        resetForm(tab); // Pass variable explicitly to ensure correct initial state
    };

    if (authChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-[#132A13]">
                <Loader2 size={48} className="animate-spin mb-4 text-[#4F772D]" />
                <h2 className="text-xl font-bold">Panel Yükleniyor...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20 pt-24">
            {/* ÜST BAR */}
            <div className="bg-[#132A13] text-white p-4 fixed top-0 w-full z-50 shadow-lg flex justify-between items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#4F772D] px-3 py-1 rounded-lg font-bold tracking-wider text-sm">PANEL</div>
                    <span className="font-serif text-lg hidden md:inline">BeeCup Yönetim</span>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => navigate('/')} className="text-sm font-bold text-gray-300 hover:text-white">Siteye Dön</button>
                    <button onClick={() => { signOut(auth); navigate('/'); }} className="bg-red-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-700">
                        <LogOut size={14} /> Çıkış
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6">

                {/* TAB MENÜSÜ */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1 overflow-x-auto">
                    <button
                        onClick={() => handleTabChange('products')}
                        className={`pb-3 px-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === 'products' ? 'text-[#4F772D] border-b-4 border-[#4F772D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Ürünler ({products.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('locations')}
                        className={`pb-3 px-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === 'locations' ? 'text-[#4F772D] border-b-4 border-[#4F772D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Lokasyonlar ({locations.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('inventory')}
                        className={`pb-3 px-4 font-bold text-lg whitespace-nowrap transition-all ${activeTab === 'inventory' ? 'text-[#4F772D] border-b-4 border-[#4F772D]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Stok Yönetimi 📦
                    </button>
                </div>

                {/* BAŞLIK & EKLE BUTONU (Inventory dışındaki tablar için) */}
                {activeTab !== 'inventory' && (
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'products' ? 'Ürün Yönetimi' : 'Lokasyon Yönetimi'}
                        </h1>
                        <button
                            onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData(activeTab === 'products' ? productInitial : locationInitial); }}
                            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all ${isAdding ? 'bg-gray-600 text-white' : 'bg-[#4F772D] text-white hover:bg-[#3E6024]'}`}
                        >
                            {isAdding ? <><X size={20} /> İptal</> : <><Plus size={20} /> {activeTab === 'products' ? 'Yeni Ürün' : 'Yeni Lokasyon'}</>}
                        </button>
                    </div>
                )}

                {/* --- STOK YÖNETİMİ PANELİ --- */}
                {activeTab === 'inventory' && (
                    <div className="animate-in fade-in slide-in-from-top-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xl font-bold text-[#132A13] mb-4 flex items-center gap-2"><MapPin size={24} /> Lokasyon Seç</h2>
                            <select
                                onChange={(e) => handleLocationSelect(e.target.value)}
                                value={selectedLocationId}
                                className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] cursor-pointer font-bold"
                            >
                                <option value="">Bir lokasyon seçiniz...</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name} {loc.district ? `(${loc.district})` : ''}</option>
                                ))}
                            </select>
                        </div>

                        {selectedLocationId && (
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold text-[#132A13]">Stok Durumu</h2>
                                    <button
                                        onClick={saveStock}
                                        disabled={stockSaving}
                                        className="bg-[#4F772D] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#3E6024] shadow-md flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {stockSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        Tümünü Kaydet
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map(prod => {
                                        const currentStock = stockMap[prod.id] || 0;
                                        return (
                                            <div key={prod.id} className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${currentStock > 0 ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50 opacity-75'}`}>
                                                <img src={prod.imgPackaged} className="w-12 h-12 rounded-lg object-cover bg-white" alt="" />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-[#132A13]">{prod.name}</h3>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">{prod.cat}</p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <label className="text-[10px] font-bold text-gray-400 mb-1">ADET</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={currentStock}
                                                        onChange={(e) => handleStockChange(prod.id, e.target.value)}
                                                        className={`w-16 p-2 text-center font-bold text-lg rounded-lg border-2 outline-none focus:border-[#4F772D] ${currentStock > 0 ? 'bg-white border-green-200 text-[#4F772D]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* --- FORM ALANI (Ürün/Lokasyon Ekleme) --- */}
                {isAdding && activeTab !== 'inventory' && (
                    <div className="bg-white p-8 rounded-3xl shadow-xl mb-10 border border-gray-200 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#132A13] flex items-center gap-2">
                                {editingId ? <Edit size={20} /> : <Plus size={20} />}
                                {editingId ? "Düzenle" : "Ekle"}
                            </h2>
                        </div>

                        {/* ÜRÜN FORMU */}
                        {activeTab === 'products' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Ürün Adı</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" placeholder="Örn: Ege Tabağı" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Fiyat (₺)</label>
                                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Kategori</label>
                                            <select value={formData.cat} onChange={e => setFormData({ ...formData, cat: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white cursor-pointer">
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
                                        <textarea rows="3" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white resize-none" />
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Resim Yolu</label>
                                        <input value={formData.imgPackaged} onChange={e => setFormData({ ...formData, imgPackaged: e.target.value })} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex gap-2 items-center p-4 bg-yellow-50 rounded-xl border border-yellow-100 cursor-pointer" onClick={() => setFormData({ ...formData, isPopular: !formData.isPopular })}>
                                        <input type="checkbox" checked={formData.isPopular} onChange={() => { }} className="w-5 h-5 accent-[#4F772D]" />
                                        <label className="text-sm font-bold text-gray-700 cursor-pointer">Popüler Ürün</label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LOKASYON FORMU */}
                        {activeTab === 'locations' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Lokasyon Adı</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" placeholder="Örn: Kanyon AVM" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Durum</label>
                                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white cursor-pointer">
                                                <option value="active">Aktif</option>
                                                <option value="maintenance">Bakımda</option>
                                                <option value="closed">Kapalı</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Stok Durumu</label>
                                            <input value={formData.stockStatus} onChange={e => setFormData({ ...formData, stockStatus: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white" placeholder="Yüksek" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Şehir</label>
                                            <select value={formData.city || 'İstanbul'} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white cursor-pointer">
                                                <option value="İstanbul">İstanbul</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">İlçe</label>
                                            <select value={formData.district || 'Şişli'} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white cursor-pointer">
                                                <option value="Adalar">Adalar</option>
                                                {/* İlçe listesi kısaltıldı, hepsi var varsayıyoruz */}
                                                <option value="Şişli">Şişli</option>
                                                <option value="Beşiktaş">Beşiktaş</option>
                                                <option value="Kadıköy">Kadıköy</option>
                                                <option value="Sarıyer">Sarıyer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Adres / Açıklama</label>
                                        <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4F772D] focus:bg-white resize-none" placeholder="Kat 2, Food Court yanı..." />
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h3 className="text-blue-800 font-bold text-sm mb-3">Harita Koordinatları (Opsiyonel)</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Enlem (Lat)</label>
                                                <input type="number" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="41.0082" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Boylam (Lng)</label>
                                                <input type="number" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm" placeholder="28.9784" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-400 mt-2">Bu bilgiler harita entegrasyonu için kullanılacaktır.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={resetForm} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Vazgeç</button>
                            <button onClick={handleSave} className="bg-[#4F772D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3E6024] shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                                <Save size={20} /> {editingId ? "Kaydet" : "Oluştur"}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- LİSTE --- */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {activeTab === 'products' && products.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:border-[#4F772D] transition-all">
                                <img src={item.imgPackaged} className="w-16 h-16 rounded-xl object-cover bg-gray-50" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Resim+Yok'; }} alt="" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#132A13]">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <div className="font-bold text-[#4F772D]">₺{item.price}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'locations' && locations.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:border-[#4F772D] transition-all">
                                <div className="w-16 h-16 rounded-xl bg-[#F7F9F4] flex items-center justify-center text-[#4F772D]"><Edit size={24} /></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-[#132A13]">{item.name}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                                <div className="text-sm font-bold text-gray-600">{item.stockStatus}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => startEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'locations' && locations.length === 0 && (
                            <div className="text-center p-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                                Henüz hiç lokasyon eklenmemiş. "Yeni Lokasyon" butonuna tıkla!
                            </div>
                        )}

                        {/* Stok Tabı için özel boş durum */}
                        {activeTab === 'inventory' && !selectedLocationId && (
                            <div className="text-center p-12 text-gray-400 opacity-75">
                                <Package size={48} className="mx-auto mb-4 text-[#4F772D]" />
                                Stok yönetimi yapmak için yukarıdan bir lokasyon seçiniz.
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div >
    );
};

export default AdminPage;