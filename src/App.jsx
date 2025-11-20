import React from 'react';
import Navbar from './components/Navbar'; // Yeni oluşturacağımız bileşen

function App() {
  return (
    <>
      <Navbar />
      
      {/* Buraya Ana Sayfa Bölümleri Gelecek: Hero, Menu, About Us... */}
      <main className="pt-20"> 
        {/* pt-20, fixed Navbar altından başlamak için boşluk bırakır */}
        <section className="h-screen flex items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">Premium Site İnşa Ediliyor...</h1>
        </section>
      </main>
      
    </>
  );
}

export default App;