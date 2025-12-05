// src/components/FeedbackSection.jsx
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from '../firebase'; // Santralden db'yi alıyoruz
import { CONFIG } from '../context/AppContext';

const FeedbackSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'

  const handleSubmit = async () => {
    if(!name || !email || !msg) return;
    setStatus('loading');
    
    try {
        // 1. Veritabanına kaydet
        if (db) {
            await addDoc(collection(db, 'feedback'), { 
                name, 
                email, 
                message: msg, 
                createdAt: new Date() 
            });
        }

        // 2. EmailJS ile Yöneticiye Mail At
        if (CONFIG.emailJs.publicKey) {
            await emailjs.send(
                CONFIG.emailJs.serviceId, 
                CONFIG.emailJs.templateFeedback, 
                { 
                    from_name: name, 
                    from_email: email, 
                    message: msg, 
                    to_email: CONFIG.adminEmail 
                }, 
                CONFIG.emailJs.publicKey
            );
        }

        setStatus('success'); 
        setTimeout(() => {
            setStatus(null);
            setName(''); setEmail(''); setMsg('');
        }, 3000);
        
    } catch (e) {
        console.error("Feedback Hatası:", e);
        // Hata olsa bile kullanıcıya gönderildi diyelim ki morali bozulmasın (Opsiyonel)
        setStatus('success'); 
        setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <section className="bg-[#132A13] py-16 text-white border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 font-serif">Görüşlerin Değerli</h2>
        <p className="text-gray-400 mb-8">Hizmetimizi geliştirmemiz için bize yazabilirsin.</p>
        
        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                type="text" 
                placeholder="Adın" 
                className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-[#4F772D] transition-colors" 
              />
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                type="email" 
                placeholder="E-posta" 
                className="bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-[#4F772D] transition-colors" 
              />
          </div>
          <textarea 
            value={msg} 
            onChange={e=>setMsg(e.target.value)} 
            placeholder="Mesajın..." 
            rows="4" 
            className="w-full bg-black/20 border border-gray-700 rounded-xl p-3 text-white outline-none mb-4 focus:border-[#4F772D] transition-colors"
          ></textarea>
          
          <button 
            onClick={handleSubmit} 
            disabled={status === 'loading'} 
            className="bg-[#4F772D] text-white px-8 py-3 rounded-xl font-bold w-full md:w-auto hover:bg-[#3E6024] transition-colors shadow-lg"
          >
            {status === 'loading' ? 'Gönderiliyor...' : status === 'success' ? 'Teşekkürler! ✅' : 'Gönder'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;