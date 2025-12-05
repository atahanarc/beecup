// src/components/ProductDetailModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Utensils, Smartphone } from 'lucide-react';

const ProductDetailModal = ({ product, onClose }) => {
    const [isPlated, setIsPlated] = useState(true);
    
    if (!product) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl h-[85vh] flex flex-col md:flex-row relative shadow-2xl" 
                onClick={e => e.stopPropagation()}
             >
                 <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                     <X size={20} className="text-gray-600"/>
                 </button>

                 <div className="w-full md:w-1/2 bg-[#F0F5ED] flex flex-col items-center justify-center p-8 relative">
                    <img 
                        src={isPlated ? product.imgPlated : product.imgPackaged} 
                        className="max-h-[350px] md:max-h-[450px] object-contain drop-shadow-2xl z-10" 
                        alt={product.name} 
                    />
                    <div className="flex gap-2 mt-8 bg-white p-1.5 rounded-full shadow-lg z-10">
                        <button onClick={()=>setIsPlated(false)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${!isPlated ? 'bg-[#132A13] text-white shadow-md' : 'text-gray-500 hover:text-[#132A13]'}`}><Package size={16}/> Paket</button>
                        <button onClick={()=>setIsPlated(true)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${isPlated ? 'bg-[#132A13] text-white shadow-md' : 'text-gray-500 hover:text-[#132A13]'}`}><Utensils size={16}/> Servis</button>
                    </div>
                 </div>

                 <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto bg-white flex flex-col">
                    <div>
                        <div className="text-[#90A955] font-bold text-xs uppercase mb-2 tracking-widest border border-[#90A955]/30 px-2 py-1 rounded w-fit">{product.cat}</div>
                        <h2 className="text-4xl font-bold mb-3 font-serif text-[#132A13] leading-tight">{product.name}</h2>
                        <div className="text-3xl font-bold text-[#4F772D] mb-6">₺{product.price}</div>
                        <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed"><p>{product.desc}</p></div>
                        {product.ingredients && (
                            <div className="bg-[#F9F8F4] p-5 rounded-2xl border border-gray-100 mb-6">
                                <h4 className="font-bold text-[#132A13] text-xs uppercase mb-2 tracking-wide">İçindekiler</h4>
                                <p className="text-gray-600 text-sm">{product.ingredients}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button className="w-full bg-[#132A13] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                            <Smartphone size={20}/> <span>Uygulamadan Sipariş Ver</span>
                        </button>
                    </div>
                 </div>
             </motion.div>
        </div>
    );
};

export default ProductDetailModal; // <-- İŞTE EKSİK OLAN BU SATIRDI!