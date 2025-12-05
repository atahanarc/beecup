// src/pages/Home.jsx
import React, { useState } from 'react';
import Hero from '../components/Hero';
import FeedbackSection from '../components/FeedbackSection';
import MenuSection from '../components/MenuSection';
import ProductDetailModal from '../components/ProductDetailModal'; // Modalı çağırdık
import AppSection from '../components/AppSection';
import Locations from '../components/Locations';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollReveal = ({ children }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
);

const Home = () => {
  // Modalın açılması için gereken state'i buraya da ekledik
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Modal açılınca arkadaki kaydırmayı kilitle
  if (selectedProduct) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <div className="min-h-screen">
        <Hero />
        
        <ScrollReveal>
            {/* Tıklama özelliğini (onProductSelect) buraya bağladık */}
            <MenuSection onProductSelect={setSelectedProduct} />
        </ScrollReveal>

        <ScrollReveal><AppSection /></ScrollReveal>
        <ScrollReveal><Locations /></ScrollReveal>
        <ScrollReveal><FeedbackSection /></ScrollReveal>

        {/* MODAL: Artık ana sayfada da var */}
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

export default Home;