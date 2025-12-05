import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

const MenuSection = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCat, setActiveCat] = useState("Çok Sevilenler");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!db) {
        setError("Veritabanı bağlantısı yok.");
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        setError("Ürünler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: "Çok Sevilenler", icon: "⭐", label: "Popüler" },
    { id: "Bowl", icon: "🥗", label: "Bowl" },
    { id: "Salata", icon: "🥬", label: "Salata" },
    { id: "Wrap", icon: "🌯", label: "Wrap" },
    { id: "Atıştırmalık", icon: "🍎", label: "Atıştırmalık" },
  ];

  const filteredItems = products.filter(item => {
    if(activeCat === "Çok Sevilenler") return item.isPopular;
    return item.cat === activeCat;
  });

  return (
    <section className="py-10 bg-[#F7F9F4] min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#132A13] mb-8 font-serif">Menüyü Keşfet</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${activeCat === cat.id ? 'bg-[#4F772D] text-white border-[#4F772D]' : 'bg-white text-gray-600 border-gray-200'}`}>
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
                        // 👇 KRİTİK NOKTA: Burası olmazsa Modal açılmaz
                        onClick={() => onProductSelect && onProductSelect(item)} 
                        className="bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-[#90A955] transition-all cursor-pointer group hover:shadow-xl"
                    >
                        <div className="relative h-56 rounded-xl overflow-hidden mb-4 bg-gray-100">
                            <img src={item.imgPackaged} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500" alt={item.name} />
                            <img src={item.imgPlated} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" alt={item.name} />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-[#132A13] text-lg leading-tight">{item.name}</h3>
                            <span className="font-bold text-[#4F772D] text-lg bg-green-50 px-2 py-1 rounded-lg">₺{item.price}</span>
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

export default MenuSection;