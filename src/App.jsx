// src/App.jsx dosyasını güncelle:

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero'; // Yeni eklediğimiz satır

function App() {
  return (
    <>
      <Navbar />
      
      <main className="pt-20"> 
        {/* Navbar'ın kapladığı alanı es geçmek için pt-20 kalsın */}
        
        <Hero /> {/* BURAYA YENİ BİLEŞENİ EKLEDİK */}
        
        {/* Diğer bölümler (Menu, AboutUs) buraya eklenecek */}
        <section className="h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-xl text-gray-500">Menü ve Diğer Bölümler Bu Alana Gelecek...</p>
        </section>
        
      </main>
      
    </>
  );
}

export default App;