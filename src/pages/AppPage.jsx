import React from 'react';
import { motion } from 'framer-motion';
import AppSection from '../components/AppSection';
import PageHeader from '../components/PageHeader';

const AppPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F5ED]">
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
      >
        <PageHeader 
          title="BeeCup Mobil App" 
          subtitle="Sıra bekleme, temassız öde, Bal Puan kazan. Teknoloji ve lezzet cebinde."
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pb-24" // Alt boşluk artırıldı
      >
        <AppSection />
      </motion.div>
    </div>
  );
};

export default AppPage;