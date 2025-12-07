import React, { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StockList = ({ inventory, locationName, onProductClick }) => {
    const [selectedCategory, setSelectedCategory] = useState("Tümü");

    // Otomatikteki mevcut kategorileri bul
    const categories = useMemo(() => {
        if (!inventory) return ["Tümü"];
        const cats = new Set(inventory.map(item => item.category).filter(Boolean));
        return ["Tümü", ...Array.from(cats)];
    }, [inventory]);

    // Seçili kategoriye göre filtrele
    // Seçili kategoriye göre filtrele (Sadece STOK > 0 olanlar)
    const filteredItems = useMemo(() => {
        if (!inventory) return [];
        const activeItems = inventory.filter(item => item.count > 0);
        if (selectedCategory === "Tümü") return activeItems;
        return activeItems.filter(item => item.category === selectedCategory);
    }, [inventory, selectedCategory]);

    if (!inventory || inventory.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden w-full mt-4"
        >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-[#132A13] px-4 py-3 flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-[#ECF39E] uppercase tracking-wider">
                        <Package size={14} /> {locationName ? `${locationName} Stok` : 'Menü Stok'}
                    </h4>
                    <span className="text-[10px] text-white/70 font-medium">
                        {inventory.length} Ürün
                    </span>
                </div>

                {/* Kategori Filtreleri (Wrap - Alt alta) */}
                <div className="bg-white border-b border-gray-100 px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedCategory === cat
                                    ? 'bg-[#4F772D] text-white border-[#4F772D]'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mini Menu Grid */}
                <div className="p-3 max-h-[300px] overflow-y-auto custom-scrollbar bg-[#F7F9F4]">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-2"
                        >
                            {filteredItems.map((item, index) => {
                                let statusColor = "text-[#132A13]";
                                let ringColor = "ring-gray-200";
                                let bgClass = "bg-white";

                                if (item.count === 0) {
                                    statusColor = "text-red-600";
                                    ringColor = "ring-red-100";
                                    bgClass = "bg-red-50/50";
                                } else if (item.count < 3) {
                                    statusColor = "text-orange-600";
                                    ringColor = "ring-orange-200";
                                }

                                return (
                                    <div
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); onProductClick && onProductClick(item); }}
                                        className={`relative p-2.5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-20 ${bgClass} hover:ring-1 ${ringColor} transition-all cursor-pointer`}
                                    >
                                        <div>
                                            <h5 className="text-xs font-bold text-[#132A13] leading-tight line-clamp-2">
                                                {item.name}
                                            </h5>
                                            {/* Kategori etiketi sadece "Tümü" seçiliyse anlamlı olabilir, ama yer kaplamaması için kaldırdım veya küçültebilirim */}
                                        </div>

                                        <div className="flex items-end justify-between mt-1">
                                            <div className={`text-[10px] font-bold ${statusColor} bg-white/80 px-1.5 py-0.5 rounded shadow-sm border border-black/5`}>
                                                {item.count === 0 ? "Tükendi" : `${item.count} Adet`}
                                            </div>
                                            {/* Durum İkonu */}
                                            {item.count > 0 ? (
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.count < 3 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-xs">
                            Bu kategoride ürün bulunamadı.
                        </div>
                    )}
                </div>
            </div>
            {/* Alt boşluk */}
            <div className="h-2"></div>
        </motion.div>
    );
};

export default StockList;
