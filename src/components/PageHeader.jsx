import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, bgImage }) => {
  return (
    <div className="relative h-[300px] w-full overflow-hidden flex items-center justify-center bg-[#132A13]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ECF39E 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="relative z-10 text-center px-6 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-4">{title}</h1>
        <p className="text-[#ECF39E] text-lg max-w-xl mx-auto font-medium">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageHeader;