import React from 'react';
import { motion } from 'framer-motion';
import Locations from '../components/Locations';
import PageHeader from '../components/PageHeader';

const LocationsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }}
      >
        <PageHeader 
          title="BeeBul Noktaları" 
          subtitle="Sana en yakın BeeCup otomatını bul, tazeliğe giden en kısa yolu keşfet."
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pt-10 pb-24"
      >
        <Locations />
      </motion.div>
    </div>
  );
};

export default LocationsPage;