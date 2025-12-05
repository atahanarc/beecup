import React from 'react';
import { ArrowLeft, Gift, History, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, auth } from '../context/AppContext';
import { deleteUser } from 'firebase/auth'; // Firebase silme fonksiyonu

const Profile = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    // HESAP SİLME FONKSİYONU
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Hesabını kalıcı olarak silmek istediğine emin misin? Bu işlem geri alınamaz ve Bal Puanların silinir.");
        
        if (confirmDelete) {
            try {
                if (auth.currentUser) {
                    await deleteUser(auth.currentUser);
                    alert("Hesabın başarıyla silindi. Seni özleyeceğiz!");
                    navigate('/');
                }
            } catch (error) {
                console.error("Hesap silme hatası:", error);
                // Güvenlik gereği, kullanıcı uzun süredir giriş yapmışsa tekrar giriş yapmasını isteyebiliriz.
                alert("Güvenlik gereği hesabını silmek için çıkış yapıp tekrar giriş yapmalısın.");
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-[#F7F9F4] pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-[#4F772D] font-bold mb-6 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Ana Sayfaya Dön
                </button>

                {/* Kullanıcı Kartı */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 bg-[#ECF39E] rounded-full flex items-center justify-center text-[#4F772D] font-bold text-3xl font-serif">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#132A13]">Hoş Geldin, {user?.displayName || "Misafir"}</h1>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <div className="bg-[#132A13] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <Gift size={20} className="text-[#ECF39E]"/>
                        <div>
                            <div className="text-[10px] text-white/60 uppercase font-bold tracking-wider">Bal Puan</div>
                            <div className="text-xl font-bold">0 BP</div>
                        </div>
                    </div>
                </div>
                
                {/* Sipariş Geçmişi */}
                <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center mb-8">
                    <History size={32} className="mx-auto text-gray-300 mb-4"/>
                    <h3 className="text-xl font-bold text-[#132A13] mb-2">Sipariş Geçmişi</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Geçmiş siparişlerinizi BeeCup mobil uygulamasından görüntüleyebilirsiniz.</p>
                </div>

                {/* HESAP SİLME BÖLÜMÜ (Tehlikeli Bölge) */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-red-500"/> Tehlikeli Bölge
                    </h3>
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <p className="font-bold text-red-800">Hesabımı Sil</p>
                            <p className="text-xs text-red-600 mt-1">Bu işlem geri alınamaz. Tüm verilerin ve puanların silinir.</p>
                        </div>
                        <button 
                            onClick={handleDeleteAccount}
                            className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Trash2 size={16}/> Hesabı Sil
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;