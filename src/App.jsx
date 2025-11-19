import React, { useState } from 'react';
import { 
  Leaf, 
  Smartphone, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Menu, 
  X, 
  Instagram, 
  Linkedin, 
  Mail,
  CheckCircle2,
  Recycle 
} from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="font-sans text-gray-800 bg-white">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-lime-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-white shadow-md">
                <Leaf size={20} fill="white" />
              </div>
              <span className="text-2xl font-bold text-lime-900 tracking-tight">BeeCup</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#nasil-calisir" className="text-gray-600 hover:text-lime-600 font-medium transition">Nasıl Çalışır?</a>
              <a href="#menu" className="text-gray-600 hover:text-lime-600 font-medium transition">Menü</a>
              <a href="#app" className="text-gray-600 hover:text-lime-600 font-medium transition">Uygulama</a>
              <a href="#iletisim" className="bg-lime-500 text-white px-5 py-2.5 rounded-full font-bold hover:bg-lime-600 transition shadow-lg shadow-lime-200">
                Kurumsal Başvuru
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full p-4 shadow-lg">
            <div className="flex flex-col gap-4">
              <a href="#nasil-calisir" className="text-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Nasıl Çalışır?</a>
              <a href="#menu" className="text-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Menü</a>
              <a href="#app" className="text-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Uygulama</a>
              <a href="#iletisim" className="bg-lime-500 text-white px-4 py-3 rounded-xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>Kurumsal Başvuru</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-lime-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-lime-100 mb-6 animate-fade-in-up">
                <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-lime-800">İstanbul'un En Taze Otomatı</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Sağlıklı Yemek <br/>
                <span className="text-lime-600">Tek Tuşla Yanında.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Plaza hayatının koşturmacasında sağlıklı beslenmek artık zor değil. BeeCup, taze bowl, wrap ve salataları 7/24 ofisine getiriyor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-lime-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-lime-200 hover:bg-lime-700 transition flex items-center justify-center gap-2">
                  Hemen İncele <ArrowRight size={20} />
                </button>
                <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Smartphone size={20} /> Uygulamayı İndir
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-lime-400 rounded-full opacity-20 blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
                alt="Healthy Bowl" 
                className="relative z-10 w-full rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500 border-8 border-white"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce-slow">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Recycle size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Sürdürülebilir</p>
                  <p className="text-lg font-bold text-gray-800">%100 Geri Dönüşüm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="nasil-calisir" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden BeeCup?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Sadece bir otomat değil, ofisinizdeki kişisel şefiniz ve sürdürülebilirlik partneriniz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "7/24 Taze & Hazır", desc: "Gece mesaisi veya erken sabah toplantısı fark etmez. Yemeğin her an taze." },
              { icon: Smartphone, title: "Temassız Teknoloji", desc: "BeeCup uygulaması ile önceden sipariş ver, QR kod ile saniyeler içinde teslim al." },
              { icon: Leaf, title: "Doğa Dostu", desc: "Boş kaplarını geri getir, puan kazan. Karbon ayak izimizi birlikte düşürelim." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-gray-50 hover:bg-lime-50 transition duration-300 border border-transparent hover:border-lime-200 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-lime-600 group-hover:scale-110 transition">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MENU PREVIEW --- */}
      <section id="menu" className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-lime-400 font-bold tracking-widest uppercase text-sm">Lezzet Şöleni</span>
              <h2 className="text-4xl font-bold mt-2">Haftanın Favorileri</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-lime-400 font-bold hover:text-lime-300 transition mt-4 md:mt-0">
              Tüm Menüyü Gör <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Superfood Bowl", price: "155 ₺", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
              { name: "Spicy Chicken Wrap", price: "140 ₺", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" },
              { name: "Green Detox", price: "70 ₺", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" }
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 p-6 w-full">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="bg-lime-500 text-black px-3 py-1 rounded-lg font-bold text-sm">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-8 bg-lime-600 text-white py-4 rounded-xl font-bold">Tüm Menüyü Gör</button>
        </div>
      </section>

      {/* --- APP SHOWCASE --- */}
      <section id="app" className="py-20 bg-lime-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Cebindeki Sağlık Asistanı.</h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Stok durumunu canlı takip et",
                    "QR kod ile temassız öde",
                    "BeeCoach yapay zeka ile öneri al",
                    "Puan topla, ücretsiz yemek kazan"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                      <CheckCircle2 className="text-lime-500" size={20} /> {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition">
                      <div className="text-left">
                        <p className="text-[10px] font-medium uppercase">Download on the</p>
                        <p className="text-lg font-bold leading-none">App Store</p>
                      </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition">
                      <div className="text-left">
                        <p className="text-[10px] font-medium uppercase">GET IT ON</p>
                        <p className="text-lg font-bold leading-none">Google Play</p>
                      </div>
                  </button>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                 {/* App Mockup Image Placeholder */}
                 <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-50" alt="App Screen" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mb-4">
                        <Leaf size={32} />
                      </div>
                      <h3 className="font-bold text-2xl">BeeCup</h3>
                      <p className="text-sm opacity-80">Uygulama Arayüzü</p>
                    </div>
                 </div>
                 
                 {/* Decorative Circles */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
                 <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT / B2B FORM --- */}
      <section id="iletisim" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Plazanıza BeeCup Getirin</h2>
          <p className="text-gray-500 mb-10">Çalışanlarınız için sağlıklı bir mola, işletmeniz için prestijli bir çözüm. Formu doldurun, sizi arayalım.</p>
          
          <form className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ad Soyad</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 transition" placeholder="Örn: Atahan Arıcı" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Şirket / Plaza Adı</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 transition" placeholder="Örn: Kanyon Yönetim" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">E-posta</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 transition" placeholder="ornek@sirket.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mesajınız</label>
              <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 transition" placeholder="Çalışan sayımız yaklaşık 500 kişi..."></textarea>
            </div>
            <button type="button" className="w-full bg-lime-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-lime-700 transition">Gönder</button>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Leaf size={24} className="text-lime-500" />
              <span className="text-xl font-bold">BeeCup</span>
            </div>
            <p className="text-sm">Şehrin en taze, en hızlı ve en sürdürülebilir yemek çözümü.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-lime-400 transition">Ana Sayfa</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Menü</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Kurumsal</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Sürdürülebilirlik</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16}/> İstanbul, Türkiye</li>
              <li className="flex items-center gap-2"><Mail size={16}/> info@beecup.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Takip Et</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-600 hover:text-white transition"><Instagram size={20}/></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-lime-600 hover:text-white transition"><Linkedin size={20}/></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
          © 2024 BeeCup Teknoloji A.Ş. Tüm hakları saklıdır.
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
}