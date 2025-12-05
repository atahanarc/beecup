// src/components/ProductDetailModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Utensils, Smartphone, Flame, Activity, Wheat } from 'lucide-react';

const ProductDetailModal = ({ product, onClose }) => {
    const [isPlated, setIsPlated] = useState(true);
    
    if (!product) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#132A13]/60 backdrop-blur-md" onClick={onClose}>
             <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                
                // DEĞİŞİKLİK BURADA: max-w-5xl yerine max-w-4xl yaptık (Genişlik azaldı)
                // max-h-[90vh] yerine max-h-[85vh] yaptık (Yükseklik azaldı)
                className="bg-white rounded-[2rem] overflow-hidden w-full max-w-4xl max-h-[85vh] flex flex-col md:flex-row relative shadow-2xl border border-white/20" 
                
                onClick={e => e.stopPropagation()}
             >
                 {/* Kapatma Butonu */}
                 <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm border border-gray-100">
                     <X size={20} />
                 </button>

                 {/* SOL TARAF: GÖRSEL */}
                 <div className="w-full md:w-1/2 bg-[#F0F5ED] flex flex-col items-center justify-center p-6 relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_70%)] opacity-50 pointer-events-none"></div>

                    <motion.img 
                        key={isPlated ? "plated" : "packaged"}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        src={isPlated ? product.imgPlated : product.imgPackaged} 
                        // Resim boyutunu biraz daha kıstık ki taşmasın
                        className="max-h-[180px] md:max-h-[320px] w-auto object-contain drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-500" 
                        alt={product.name}
                    />
                    
                    <div className="flex gap-2 mt-6 bg-white p-1 rounded-full shadow-lg z-10 border border-gray-100">
                        <button onClick={()=>setIsPlated(false)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 ${!isPlated ? 'bg-[#132A13] text-white shadow-md' : 'text-gray-500 hover:text-[#132A13] hover:bg-gray-50'}`}>
                            <Package size={14}/> Paket
                        </button>
                        <button onClick={()=>setIsPlated(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300 ${isPlated ? 'bg-[#132A13] text-white shadow-md' : 'text-gray-500 hover:text-[#132A13] hover:bg-gray-50'}`}>
                            <Utensils size={14}/> Servis
                        </button>
                    </div>
                 </div>

                 {/* SAĞ TARAF: DETAYLAR */}
                 <div className="w-full md:w-1/2 p-6 md:p-8 bg-white flex flex-col overflow-y-auto">
                    <div>
                        <div className="text-[#90A955] font-bold text-[10px] uppercase mb-2 tracking-widest border border-[#90A955]/30 px-2 py-0.5 rounded-full w-fit bg-[#90A955]/5">
                            {product.cat || "Lezzet"}
                        </div>
                        
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#132A13] leading-tight max-w-[70%]">
                                {product.name}
                            </h2>
                            <div className="text-lg md:text-xl font-bold text-[#4F772D] bg-green-50 px-3 py-1 rounded-xl whitespace-nowrap">
                                ₺{product.price}
                            </div>
                        </div>
                        
                        <div className="prose prose-sm text-gray-600 mb-6 leading-relaxed text-sm">
                            <p>{product.desc}</p>
                        </div>

                        {product.macros && (
                            <div className="grid grid-cols-3 gap-2 mb-5">
                                <div className="bg-orange-50 border border-orange-100 p-2 rounded-xl text-center">
                                    <Flame size={14} className="mx-auto text-orange-500 mb-1"/>
                                    <div className="text-xs font-bold text-gray-800">{product.kcal || "-"}</div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400">kcal</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl text-center">
                                    <Activity size={14} className="mx-auto text-blue-500 mb-1"/>
                                    <div className="text-xs font-bold text-gray-800">{product.macros?.protein || "-"}g</div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400">Prot</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-100 p-2 rounded-xl text-center">
                                    <Wheat size={14} className="mx-auto text-yellow-500 mb-1"/>
                                    <div className="text-xs font-bold text-gray-800">{product.macros?.carbs || "-"}g</div>
                                    <div className="text-[9px] uppercase font-bold text-gray-400">Karb</div>
                                </div>
                            </div>
                        )}

                        {product.ingredients && (
                            <div className="bg-[#F9F8F4] p-4 rounded-xl border border-gray-100 mb-2">
                                <h4 className="font-bold text-[#132A13] text-[10px] uppercase mb-1 tracking-wide flex items-center gap-1">
                                    <span>🥗 İçindekiler</span>
                                </h4>
                                <p className="text-gray-600 text-xs leading-relaxed">{product.ingredients}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <button className="w-full bg-[#132A13] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-[0.98] text-sm">
                            <Smartphone size={18}/> <span>Uygulamadan Sipariş Ver</span>
                        </button>
                    </div>
                 </div>
             </motion.div>
        </div>
    );
};

export default ProductDetailModal;