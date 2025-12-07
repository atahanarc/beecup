import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Info, Search, Smartphone, MessageSquare } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import StoreMap from './StoreMap';
import StockList from './StockList';
import { useAppContext } from '../context/AppContext';

const Locations = ({ showFooterPromos = false }) => {
    const { setIsFeedbackModalOpen } = useAppContext();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null); // Haritada odaklanılan

    // Filtreleme State'leri

    const [filterDistrict, setFilterDistrict] = useState("Tümü");
    const [searchTerm, setSearchTerm] = useState("");

    const itemRefs = useRef({});

    // Seçilen kartı ortala
    useEffect(() => {
        if (selectedLocation && itemRefs.current[selectedLocation.id]) {
            itemRefs.current[selectedLocation.id].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [selectedLocation]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!db) return;
            try {
                const snapshot = await getDocs(collection(db, "locations"));
                const data = snapshot.docs.map(doc => {
                    // MOCK STOCK DATA (20+ Ürün Simülasyonu)
                    const allProducts = [
                        { name: "Somonlu Bowl", category: "Bowl" },
                        { name: "Acai Bowl", category: "Bowl" },
                        { name: "Falafel Bowl", category: "Bowl" },
                        { name: "Meksika Bowl", category: "Bowl" },
                        { name: "Fıstık Ezmeli Wrap", category: "Wrap" },
                        { name: "Humuslu Wrap", category: "Wrap" },
                        { name: "Ton Balıklı Wrap", category: "Wrap" },
                        { name: "Sezar Wrap", category: "Wrap" },
                        { name: "Akdeniz Salata", category: "Salata" },
                        { name: "Kinoa Salata", category: "Salata" },
                        { name: "Izgara Tavuk Salata", category: "Salata" },
                        { name: "Detoks Suyu (Yeşil)", category: "İçecek" },
                        { name: "Detoks Suyu (Kırmızı)", category: "İçecek" },
                        { name: "Cold Brew Kahve", category: "İçecek" },
                        { name: "Ev Yapımı Limonata", category: "İçecek" },
                        { name: "Protein Bar", category: "Atıştırmalık" },
                        { name: "Yulaflı Kurabiye", category: "Atıştırmalık" },
                        { name: "Meyve Salatası", category: "Atıştırmalık" },
                        { name: "Chia Puding", category: "Atıştırmalık" }
                    ];

                    const getRandomInventory = () => {
                        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
                        const selected = shuffled.slice(0, Math.floor(Math.random() * 6) + 12);
                        return selected.map(item => ({
                            ...item,
                            count: Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 8) + 1
                        }));
                    };

                    const mockInventory = getRandomInventory();

                    return {
                        id: doc.id,
                        ...doc.data(),
                        inventory: mockInventory
                    };
                });
                setLocations(data);
            } catch (error) {
                console.error("Lokasyon hatası:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const uniqueDistricts = ["Tümü", ...new Set(locations.map(l => l.district).filter(Boolean))];

    // Listeyi Filtrele
    const filteredLocations = locations.filter(loc => {
        const districtMatch = filterDistrict === "Tümü" || loc.district === filterDistrict;
        const searchMatch = !searchTerm ||
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loc.city && loc.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (loc.district && loc.district.toLowerCase().includes(searchTerm.toLowerCase()));
        return districtMatch && searchMatch;
    });

    if (loading) {
        return (
            <section id="beebul" className="py-20 bg-white border-b border-gray-100 flex justify-center">
                <Loader2 className="animate-spin text-[#4F772D]" size={32} />
            </section>
        );
    }

    return (
        <section id="beebul" className="pt-2 pb-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                {/* BAŞLIK VE FİLTRELER (RENKLİ PANEL) */}
                <div className="bg-[#4F772D] rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-1">BeeBul Noktaları</h2>
                        <p className="text-[#ECF39E] text-sm font-medium opacity-90">Size en yakın sağlıklı lezzet noktasını bulun.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* ARAMA ÇUBUĞU */}
                        <div className="relative flex-grow md:max-w-md">
                            <input
                                type="text"
                                placeholder="Şube adı, il veya ilçe ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-0 text-gray-700 font-bold focus:ring-2 focus:ring-[#ECF39E] bg-white text-sm outline-none shadow-sm placeholder:font-medium"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>

                        {/* FİLTRELER */}
                        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">

                            <select
                                value={filterDistrict}
                                onChange={(e) => setFilterDistrict(e.target.value)}
                                className="px-5 py-2.5 rounded-xl border-0 text-sm font-bold text-[#4F772D] focus:ring-2 focus:ring-[#ECF39E] bg-white cursor-pointer shadow-sm min-w-[120px] outline-none"
                            >
                                {uniqueDistricts.map(d => <option key={d} value={d}>{d === "Tümü" ? "Tüm İlçeler" : d}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* SOL TARAF: LİSTE */}
                    <div className="lg:col-span-7">

                        {filteredLocations.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                                <Info size={40} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 font-medium">Bu kriterlere uygun nokta bulunamadı.</p>
                            </div>
                        ) : (
                            // SCROLLABLE LIST CONTAINER
                            <div className="h-[600px] overflow-y-auto overscroll-y-contain pr-2 pb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                    {filteredLocations.map((loc) => (
                                        <div
                                            key={loc.id}
                                            ref={(el) => (itemRefs.current[loc.id] = el)}
                                            onClick={() => setSelectedLocation(selectedLocation?.id === loc.id ? null : loc)}
                                            className={`border rounded-2xl p-5 transition-all group bg-white shadow-sm hover:shadow-md cursor-pointer ${selectedLocation?.id === loc.id ? 'border-[#4F772D] ring-1 ring-[#4F772D] bg-green-50' : 'border-gray-200 hover:border-[#4F772D]'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="bg-[#F7F9F4] p-2.5 rounded-full text-[#132A13] group-hover:bg-[#4F772D] group-hover:text-white transition-colors">
                                                    <MapPin size={20} />
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${loc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {loc.status === 'active' ? 'Aktif' : 'Bakımda'}
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                                <h3 className="font-bold text-lg text-[#132A13] line-clamp-1">{loc.name}</h3>
                                                {(loc.city || loc.district) && <span className="text-xs text-gray-400 font-medium">{loc.city}{loc.district ? ` / ${loc.district}` : ''}</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{loc.description}</p>

                                            {selectedLocation?.id === loc.id ? (
                                                <StockList inventory={loc.inventory} locationName={loc.name} />
                                            ) : loc.stockStatus && (
                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                    <div className={`w-2 h-2 rounded-full ${loc.stockStatus === 'Dolu' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                                    <p className="text-xs font-bold text-gray-700">Stok: {loc.stockStatus}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SAĞ TARAF: HARİTA (Sticky) */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-24 h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                            <StoreMap
                                locations={filteredLocations}
                                focusedLocation={selectedLocation}
                                onMarkerClick={setSelectedLocation}
                            />
                        </div>
                    </div>
                </div>

                {/* ALT PROMO ALANI */}
                {showFooterPromos && (
                    <div className="grid md:grid-cols-2 gap-6 mt-12">
                        {/* MOBİL UYGULAMA */}
                        <div className="bg-[#132A13] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F772D] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="bg-white/10 p-4 rounded-full text-[#ECF39E]">
                                <Smartphone size={32} />
                            </div>
                            <div className="flex-1 text-center md:text-left z-10">
                                <h3 className="text-xl font-bold text-white mb-2">BeeCup Cebinde!</h3>
                                <p className="text-gray-300 text-sm mb-4">Sipariş ver, puan topla, sürprizleri kaçırma. Hemen indir!</p>
                                <a href="/uygulama" className="inline-flex items-center gap-2 bg-[#4F772D] hover:bg-[#3E6024] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md">
                                    İncele ve İndir
                                </a>
                            </div>
                        </div>

                        {/* GÖRÜŞ / ÖNERİ */}
                        <div className="bg-[#132A13] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F772D] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                            <div className="bg-white/10 p-4 rounded-full text-[#ECF39E]">
                                <MessageSquare size={32} />
                            </div>
                            <div className="flex-1 text-center md:text-left z-10">
                                <h3 className="text-xl font-bold text-white mb-2">Görüşlerin Değerli</h3>
                                <p className="text-gray-300 text-sm mb-4">Daha iyi hizmet için önerilerini bizimle paylaş, gelişimimize katkıda bulun.</p>
                                <button
                                    onClick={() => setIsFeedbackModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-[#4F772D] hover:bg-[#3E6024] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
                                >
                                    Bize Yazın
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Locations;