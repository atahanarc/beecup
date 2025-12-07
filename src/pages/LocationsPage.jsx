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
        <Locations showFooterPromos={true} />
      </motion.div>
    </div>
  );
};

export default LocationsPage;