import React from 'react';
import { ArrowLeft, Gift, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#F7F9F4] pt-8 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Ana Sayfaya Dön Butonu */}
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
                
                {/* Geçmiş Siparişler */}
                <div className="bg-white p-12 rounded-[2rem] border border-gray-100 text-center">
                    <History size={32} className="mx-auto text-gray-300 mb-4"/>
                    <h3 className="text-xl font-bold text-[#132A13] mb-2">Sipariş Geçmişi</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Geçmiş siparişlerinizi BeeCup mobil uygulamasından görüntüleyebilirsiniz.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;