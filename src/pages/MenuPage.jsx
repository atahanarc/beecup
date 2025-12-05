import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MenuSection from '../components/MenuSection';
import ProductDetailModal from '../components/ProductDetailModal';
import PageHeader from '../components/PageHeader';

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
    <div className="min-h-screen bg-[#F7F9F4]">
      
      {/* BAŞLIK (Animasyonlu Gelir) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <PageHeader 
          title="Menümüz" 
          subtitle="Şeflerimizin özenle hazırladığı, günlük taze ve doğal lezzetleri keşfedin."
        />
      </motion.div>

      {/* İÇERİK (Aşağıdan yukarı kayarak gelir) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="-mt-10 relative z-20 pb-24" // pb-24 ile alt boşluğu artırdık
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