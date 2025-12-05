import React, { useState } from 'react';
import MenuSection from '../components/MenuSection';
import ProductDetailModal from '../components/ProductDetailModal'; // Modalı buraya alıyoruz
import { AnimatePresence } from 'framer-motion';

const MenuPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#F7F9F4]">
      {/* Menü Bileşenini Çağırıyoruz */}
      <MenuSection onProductSelect={setSelectedProduct} />
      
      {/* Ürün Detay Modalı */}
      <AnimatePresence>
        {selectedProduct && (
            <ProductDetailModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;