import React from 'react';
import { MapPin } from 'lucide-react';

const LOCATIONS = [ 
    { id: 1, name: "Kanyon AVM", status: "active", stock: "Yüksek", distance: "200m" }, 
    { id: 2, name: "Zorlu PSM", status: "low", stock: "Azaldı", distance: "1.2km" }, 
    { id: 3, name: "Maslak 42", status: "active", stock: "Yüksek", distance: "3.5km" }, 
    { id: 4, name: "Kolektif House", status: "active", stock: "Yüksek", distance: "500m" }, 
    { id: 5, name: "Vadistanbul", status: "maintenance", stock: "Bakımda", distance: "6km" }
];

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

export default Locations;