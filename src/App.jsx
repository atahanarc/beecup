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
  Recycle,
  Droplets
} from 'lucide-react';

export default function BeeCupWeb() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="font-sans text-gray-800 bg-lime-50 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-lime-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {/* Logo yolu düzeltildi ve dosya uzantısı .jpg yapıldı */}
              <img src="/beecup-logo.jpg" alt="BeeCup Logo" className="h-10 w-auto" /> 
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#nasil-calisir" className="text-gray-600 hover:text-lime-600 font-medium transition">Nasıl Çalışır?</a>
              <a href="#menu" className="text-gray-600 hover:text-lime-600 font-medium transition">Menü</a>
              <a href="#app" className="text-gray-600 hover:text-lime-600 font-medium transition">Uygulama</a>
              <a href="#iletisim" className="bg-lime-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-lime-600 transition shadow-lg shadow-lime-200 transform hover:scale-105">
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
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full p-4 shadow-xl z-50">
            <div className="flex flex-col gap-4">
              <a href="#nasil-calisir" className="text-lg font-medium text-gray-700 p-2 rounded hover:bg-lime-50" onClick={() => setIsMenuOpen(false)}>Nasıl Çalışır?</a>
              <a href="#menu" className="text-lg font-medium text-gray-700 p-2 rounded hover:bg-lime-50" onClick={() => setIsMenuOpen(false)}>Menü</a>
              <a href="#app" className="text-lg font-medium text-gray-700 p-2 rounded hover:bg-lime-50" onClick={() => setIsMenuOpen(false)}>Uygulama</a>
              <a href="#iletisim" className="bg-lime-500 text-white px-4 py-3 rounded-xl text-center font-bold" onClick={() => setIsMenuOpen(false)}>Kurumsal Başvuru</a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-lime-200 mb-6 animate-fade-in-up">
                <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-lime-800">İstanbul'un En Taze Otomatı</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
                Sağlıklı Yemek <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-green-600">Tek Tuşla Yanında.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Plaza hayatının koşturmacasında sağlıklı beslenmek artık zor değil. BeeCup, taze bowl, wrap ve salataları 7/24 ofisine getiriyor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-lime-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-lime-200 hover:bg-lime-600 transition flex items-center justify-center gap-2 transform hover:-translate-y-1">
                  Hemen İncele <ArrowRight size={20} />
                </button>
                <button className="bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:border-lime-500 hover:text-lime-600 transition flex items-center justify-center gap-2">
                  <Smartphone size={20} /> Uygulamayı İndir
                </button>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-lime-400 rounded-full opacity-20 blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
                alt="Healthy Bowl" 
                className="relative z-10 w-full rounded-[2.5rem] shadow-2xl transform hover:scale-105 transition duration-500 border-8 border-white"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 animate-bounce-slow border border-lime-50">
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
      <section id="nasil-calisir" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-lime-600 font-bold tracking-widest uppercase text-sm">Avantajlar</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Neden BeeCup?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Sadece bir otomat değil, ofisinizdeki kişisel şefiniz ve sürdürülebilirlik partneriniz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "7/24 Taze & Hazır", desc: "Gece mesaisi veya erken sabah toplantısı fark etmez. Yemeğin her an taze." },
              { icon: Smartphone, title: "Temassız Teknoloji", desc: "BeeCup uygulaması ile önceden sipariş ver, QR kod ile saniyeler içinde teslim al." },
              { icon: Leaf, title: "Doğa Dostu", desc: "Boş kaplarını geri getir, puan kazan. Karbon ayak izimizi birlikte düşürelim." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-lime-50/50 hover:bg-lime-100 transition duration-300 border border-transparent hover:border-lime-200 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-lime-600 group-hover:scale-110 transition group-hover:bg-lime-500 group-hover:text-white">
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
      <section id="menu" className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4d7c0f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-lime-400 font-bold tracking-widest uppercase text-sm">Lezzet Şöleni</span>
              <h2 className="text-4xl font-bold mt-2">Haftanın Favorileri</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-lime-400 font-bold hover:text-lime-300 transition mt-4 md:mt-0 border border-lime-400/30 px-4 py-2 rounded-full hover:bg-lime-400/10">
              Tüm Menüyü Gör <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Superfood Bowl", price: "155 ₺", cal: "450 kcal", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80" },
              { name: "Spicy Chicken Wrap", price: "140 ₺", cal: "480 kcal", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" },
              { name: "Green Detox", price: "70 ₺", cal: "120 kcal", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
              { name: "Vegan Protein Bowl", price: "160 ₺", cal: "520 kcal", img: "https://images.unsplash.com/photo-1504754528070-e6876c669126?auto=format&fit=crop&w=600&q=80" }, // Yeni ürün
              { name: "Fresh Berry Smoothie", price: "85 ₺", cal: "180 kcal", img: "https://images.unsplash.com/photo-1505252585461-0428cd1a403f?auto=format&fit=crop&w=600&q=80" }, // Yeni ürün
              { name: "Mantar & Peynir Sandviç", price: "110 ₺", cal: "380 kcal", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?auto=format&fit=crop&w=600&q=80" }, // Yeni ürün
              { name: "Çikolatalı Fit Bar", price: "45 ₺", cal: "250 kcal", img: "https://images.unsplash.com/photo-1620210214300-cb64c8d4f4e7?auto=format&fit=crop&w=600&q=80" }, // Yeni ürün
              { name: "Doğal Kaynak Suyu", price: "15 ₺", cal: "0 kcal", img: "https://images.unsplash.com/photo-1602143407151-11115cdbf69c?q=80&w=600&auto=format&fit=crop" }
            ].slice(0, 4).map((item, i) => ( // Sadece ilk 4 ürünü gösteriyoruz
              <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl border border-gray-800">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10">
                  {item.cal}
                </div>
                <div className="absolute bottom-0 p-5 w-full">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-lime-400 font-bold text-lg">{item.price}</span>
                       <div className="bg-lime-500 p-2 rounded-full text-black group-hover:bg-white transition">
                         <PlusIcon />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-8 bg-lime-600 text-white py-4 rounded-xl font-bold">Tüm Menüyü Gör</button>
        </div>
      </section>

      {/* --- APP SHOWCASE --- */}
      <section id="app" className="py-24 bg-gradient-to-b from-lime-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-lime-100 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="z-10">
                <div className="inline-block bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full text-xs mb-4">MOBİL UYGULAMA</div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Cebindeki <br/> Sağlık Asistanı.</h2>
                <p className="text-gray-600 mb-8 text-lg">Siparişini ver, otomata git, QR kodunu okut ve yemeğini al. Sıra beklemek yok, temas yok.</p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "Stok durumunu canlı takip et",
                    "QR kod ile temassız öde",
                    "BeeCoach yapay zeka ile öneri al",
                    "Puan topla, ücretsiz yemek kazan"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="bg-lime-500 rounded-full p-1 text-white"><CheckCircle2 size={16} /></div> {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition shadow-lg">
                     <div className="text-left">
                        <p className="text-[10px] font-medium uppercase text-gray-400">Download on the</p>
                        <p className="text-lg font-bold leading-none">App Store</p>
                     </div>
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:opacity-80 transition shadow-lg">
                     <div className="text-left">
                        <p className="text-[10px] font-medium uppercase text-gray-400">GET IT ON</p>
                        <p className="text-lg font-bold leading-none">Google Play</p>
                     </div>
                  </button>
                </div>
              </div>
              
              <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
                 {/* Phone Mockup */}
                 <div className="relative w-72 h-[550px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden z-10 transform rotate-3 hover:rotate-0 transition duration-500">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-white flex flex-col">
                       {/* Mock App Header */}
                       <div className="bg-lime-50 p-4 pt-8 flex justify-between items-center border-b border-lime-100">
                          <div className="flex gap-2 items-center">
                             <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center text-white"><Leaf size={16}/></div>
                             <span className="font-bold text-lime-900">BeeCup</span>
                          </div>
                          <div className="bg-white px-2 py-1 rounded-full text-xs font-bold text-lime-700 border border-lime-200">1250 P</div>
                       </div>
                       {/* Mock App Body */}
                       <div className="p-4 space-y-4 bg-white h-full">
                          <div className="bg-gradient-to-br from-lime-400 to-green-500 h-32 rounded-2xl p-4 text-white shadow-lg">
                             <p className="font-bold text-lg">Bugün ne yesem?</p>
                             <div className="bg-white/20 w-24 h-6 rounded-full mt-2"></div>
                          </div>
                          <div className="flex gap-2 overflow-hidden">
                             {[1,2,3].map(i => <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl shrink-0"></div>)}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl flex gap-3 items-center border border-gray-100">
                             <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                             <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded w-10"></div>
                             </div>
                             <div className="w-8 h-8 bg-lime-100 rounded-full"></div>
                          </div>
                       </div>
                       {/* Mock App Nav */}
                       <div className="mt-auto bg-white border-t p-4 flex justify-around text-gray-300">
                          <div className="w-6 h-6 bg-lime-500 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                       </div>
                    </div>
                 </div>
                 
                 {/* Decorative Elements */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-300/30 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT / B2B FORM --- */}
      <section id="iletisim" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-lime-600 font-bold tracking-widest uppercase text-sm">İş Ortaklığı</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Plazanıza BeeCup Getirin</h2>
          <p className="text-gray-500 mb-10 text-lg">Çalışanlarınız için sağlıklı bir mola, işletmeniz için prestijli bir çözüm. Formu doldurun, 24 saat içinde sizi arayalım.</p>
          
          <form className="space-y-4 text-left bg-lime-50/50 p-8 rounded-3xl border border-lime-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ad Soyad</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition" placeholder="Örn: Atahan Arıcı" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Şirket / Plaza Adı</label>
                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition" placeholder="Örn: Kanyon Yönetim" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-posta</label>
              <input type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition" placeholder="ornek@sirket.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mesajınız</label>
              <textarea rows={4} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition" placeholder="Çalışan sayımız yaklaşık 500 kişi..."></textarea>
            </div>
            <button type="button" className="w-full bg-lime-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-lime-200 hover:bg-lime-600 transition transform active:scale-95">Gönder</button>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <img src="/beecup-logo.jpg" alt="BeeCup Logo" className="h-10 w-auto" /> {/* FOOTER'A DA LOGO EKLENDİ */}
            </div>
            <p className="text-sm leading-relaxed mb-6">Şehrin en taze, en hızlı ve en sürdürülebilir yemek çözümü. Teknoloji ve doğayı lezzetle buluşturuyoruz.</p>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-lime-500 hover:text-white transition"><Instagram size={18}/></a>
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-lime-500 hover:text-white transition"><Linkedin size={18}/></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Hızlı Linkler</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-lime-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span> Ana Sayfa</a></li>
              <li><a href="#menu" className="hover:text-lime-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span> Menü</a></li>
              <li><a href="#iletisim" className="hover:text-lime-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span> Kurumsal</a></li>
              <li><a href="#" className="hover:text-lime-400 transition flex items-center gap-2"><span className="w-1.5 h-1.5 bg-lime-500 rounded-full"></span> Sürdürülebilirlik</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">İletişim</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-lime-500 shrink-0"/> 
                <span>Maslak Mah. Büyükdere Cad. No:123<br/>Sarıyer, İstanbul</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-lime-500 shrink-0"/> 
                <a href="mailto:info@beecup.com" className="hover:text-white">info@beecup.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Bülten</h4>
            <p className="text-xs mb-4">Yeni ürünler ve kampanyalardan haberdar olun.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="E-posta adresiniz" className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-lime-500" />
              <button className="bg-lime-500 text-black p-2 rounded-lg hover:bg-lime-400 transition"><ArrowRight size={18}/></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2024 BeeCup Teknoloji A.Ş. Tüm hakları saklıdır.
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
}

// Helper Component for Plus Icon
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}