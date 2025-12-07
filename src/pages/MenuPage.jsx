import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuSection from '../components/MenuSection';
import ProductDetailModal from '../components/ProductDetailModal';

const MenuPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Modal açılınca scroll kilitleme
  if (selectedProduct) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    // min-h-screen ve arka plan rengiyle bütünlüğü sağlıyoruz
    <div className="min-h-screen bg-[#F7F9F4] pt-0">



      {/* İÇERİK (Aşağıdan yukarı kayarak gelir) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-20 pb-12"
      >
        <MenuSection onProductSelect={setSelectedProduct} />
      </motion.div>

      {/* MODAL */}
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