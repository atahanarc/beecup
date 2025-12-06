import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, Info } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import StoreMap from './StoreMap';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!db) return;
            try {
                const snapshot = await getDocs(collection(db, "locations"));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLocations(data);
            } catch (error) {
                console.error("Lokasyon hatası:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    if (loading) {
        return (
            <section id="beebul" className="py-20 bg-white border-b border-gray-100 flex justify-center">
                <Loader2 className="animate-spin text-[#4F772D]" size={32} />
            </section>
        );
    }

    return (
        <section id="beebul" className="py-20 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-[#132A13] mb-2">BeeBul Noktaları</h2>
                <p className="text-gray-600 mb-8">Sana en yakın otomatı bul ve stok durumunu canlı takip et.</p>

                {/* HARİTA ALANI */}
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <StoreMap locations={locations} />
                </div>

                {locations.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                        <Info size={40} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Bölgendeki noktalar yakında eklenecek.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {locations.map((loc) => (
                            <div key={loc.id} className="border border-gray-200 rounded-2xl p-6 hover:border-[#4F772D] transition-all group bg-white shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-[#F7F9F4] p-3 rounded-full text-[#132A13]"><MapPin size={24} /></div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${loc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {loc.status === 'active' ? 'Aktif' : 'Bakımda'}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-[#132A13] mb-1">{loc.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{loc.description}</p>
                                {loc.stockStatus && <p className="text-xs text-[#4F772D] font-bold mb-4">{loc.stockStatus} Stok</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Locations;