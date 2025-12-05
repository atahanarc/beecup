import React from 'react';
import AppSection from '../components/AppSection';

const AppPage = () => {
  return (
    <div className="min-h-screen bg-[#F0F5ED]">
      <PageHeader 
        title="BeeCup Mobil App" 
        subtitle="Sıra bekleme, temassız öde, Bal Puan kazan. Teknoloji ve lezzet cebinde."
      />
      <div className="py-10">
        <AppSection />
      </div>
    </div>
  );
};

export default AppPage;