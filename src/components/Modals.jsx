import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Briefcase, Users, MapPin, FileText, Info, CheckCircle, MessageSquare } from 'lucide-react';

// --- BAĞLANTILAR ---
import { auth, db } from '../firebase';
import { useAppContext, CONFIG } from '../context/AppContext';

// --- FIREBASE & EMAIL ---
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    setPersistence,
    browserSessionPersistence,
    GoogleAuthProvider,     // <-- EKLENDİ: Google Girişi için
    signInWithRedirect,     // <-- EKLENDİ: Google Redirect için
    GoogleAuthProvider
} from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// --- 1. AUTH MODAL (GİRİŞ / KAYIT / GOOGLE / ŞİFRE) ---
export const AuthModal = () => {
    const { authModalType, setAuthModalType } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!authModalType) return null;

    // --- GOOGLE İLE GİRİŞ FONKSİYONU ---
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // Popup yerine REDIRECT kullanıyoruz (Mobil uyumluluğu için)
            const provider = new GoogleAuthProvider();
            await signInWithRedirect(auth, provider);
            // Sayfa yenileneceği için modal'ı kapatmaya gerek yok, dönüşte AppContext yakalayacak
        } catch (e) {
            console.error(e);
            setError("Google ile giriş başlatılamadı: " + e.message);
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!auth) return;
        setLoading(true);
        setError('');

        try {
            await setPersistence(auth, browserSessionPersistence);

            if (authModalType === 'login') {
                // Giriş Yap
                await signInWithEmailAndPassword(auth, email, password);
            }
            else if (authModalType === 'register') {
                // Kayıt Ol
                const cred = await createUserWithEmailAndPassword(auth, email, password);

                // İsim bilgisini güncelle
                await updateProfile(cred.user, { displayName: fullName });

                // --- HOŞ GELDİN MAİLİ ---
                if (CONFIG.emailJs.publicKey) {
                    emailjs.send(
                        CONFIG.emailJs.serviceId,
                        CONFIG.emailJs.templateWelcome,
                        {
                            to_name: fullName,
                            to_email: email,
                            message: "BeeCup ailesine hoş geldin! Seni aramızda gördüğümüz için çok mutluyuz."
                        },
                        CONFIG.emailJs.publicKey
                    ).catch(err => console.error("Mail hatası:", err));
                }
            }
            else if (authModalType === 'reset') {
                // Şifre Sıfırla
                await sendPasswordResetEmail(auth, email);
                alert("Şifre sıfırlama bağlantısı e-postana gönderildi! Lütfen spam kutunu da kontrol et.");
            }

            setAuthModalType(null);
        } catch (e) {
            console.error("Auth Hatası:", e);
            // Hata mesajlarını kullanıcı dostu yapalım
            let msg = e.message;
            if (msg.includes("invalid-credential")) msg = "E-posta veya şifre hatalı.";
            if (msg.includes("email-already-in-use")) msg = "Bu e-posta zaten kullanımda.";
            if (msg.includes("weak-password")) msg = "Şifre en az 6 karakter olmalı.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#132A13]/60 backdrop-blur-sm" onClick={() => setAuthModalType(null)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-md relative shadow-2xl border border-white/50 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={() => setAuthModalType(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-full">
                    <X size={20} />
                </button>

                <div className="text-center mb-8 mt-2">
                    <h2 className="text-3xl font-bold text-[#132A13] font-serif mb-2">
                        {authModalType === 'login' ? "Tekrar Hoş Geldin" : authModalType === 'register' ? "Aramıza Katıl" : "Şifremi Unuttum"}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">
                        {authModalType === 'login' ? "Hesabına giriş yap ve sipariş ver." : "Doğal lezzet dünyasına adım at."}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* GOOGLE İLE GİRİŞ BUTONU (Sadece Giriş ve Kayıt ekranında) */}
                    {authModalType !== 'reset' && (
                        <>
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all hover:shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Google ile Devam Et
                            </button>
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Veya E-posta ile</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                        </>
                    )}

                    {authModalType === 'register' && (
                        <input
                            type="text"
                            placeholder="Adın Soyadın"
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-all text-[#132A13] placeholder-gray-400 font-medium"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="E-posta Adresin"
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-all text-[#132A13] placeholder-gray-400 font-medium"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    {authModalType !== 'reset' && (
                        <input
                            type="password"
                            placeholder="Şifren"
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-all text-[#132A13] placeholder-gray-400 font-medium"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm text-center p-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                            <Info size={16} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-[#4F772D] text-white py-4 rounded-xl font-bold hover:bg-[#3E6024] shadow-lg shadow-green-900/10 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (authModalType === 'login' ? "Giriş Yap" : authModalType === 'register' ? "Kayıt Ol" : "Sıfırlama Linki Gönder")}
                    </button>

                    <div className="flex justify-center gap-4 text-sm text-gray-500 pt-2 font-medium">
                        {authModalType === 'login' && <button onClick={() => setAuthModalType('register')} className="hover:text-[#4F772D] hover:underline">Hesap oluştur</button>}
                        {authModalType === 'login' && <button onClick={() => setAuthModalType('reset')} className="hover:text-[#4F772D] hover:underline">Şifremi unuttum</button>}
                        {authModalType !== 'login' && <button onClick={() => setAuthModalType('login')} className="hover:text-[#4F772D] hover:underline">Giriş yap</button>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- 2. KURUMSAL TALEP MODALI (Full Form & Validation) ---
export const OfficeRequestModal = () => {
    const { isOfficeModalOpen, setIsOfficeModalOpen } = useAppContext();
    const [formData, setFormData] = useState({ company: '', contact: '', email: '', phone: '', employees: '', district: '' });
    const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'

    if (!isOfficeModalOpen) return null;

    const handleSubmit = async () => {
        // Validation: Boş alan kontrolü
        if (!formData.company || !formData.email || !formData.phone) {
            alert("Lütfen zorunlu alanları doldurunuz.");
            return;
        }

        setStatus('loading');
        try {
            // 1. Firestore'a Kaydet
            if (db) {
                await addDoc(collection(db, 'office_requests'), {
                    ...formData,
                    createdAt: new Date()
                });
            }

            // 2. EmailJS ile Yöneticiye Bildirim Gönder
            if (CONFIG.emailJs.publicKey) {
                await emailjs.send(
                    CONFIG.emailJs.serviceId,
                    CONFIG.emailJs.templateFeedback, // Feedback şablonu kullanılabilir
                    {
                        from_name: `${formData.contact} (${formData.company})`,
                        from_email: formData.email,
                        message: `KURUMSAL TALEP: \nÇalışan: ${formData.employees}, \nBölge: ${formData.district}, \nTel: ${formData.phone}`,
                        to_email: CONFIG.adminEmail
                    },
                    CONFIG.emailJs.publicKey
                );
            }

            setStatus('success');
            // 3 saniye sonra kapat ve formu temizle
            setTimeout(() => {
                setStatus(null);
                setIsOfficeModalOpen(false);
                setFormData({ company: '', contact: '', email: '', phone: '', employees: '', district: '' });
            }, 3000);

        } catch (e) {
            console.error("Talep Hatası:", e);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOfficeModalOpen(false)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-lg relative shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={() => setIsOfficeModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-full">
                    <X size={24} />
                </button>

                <div className="text-center mb-8 mt-2">
                    <div className="w-16 h-16 bg-[#F0F5ED] rounded-full flex items-center justify-center text-[#4F772D] mx-auto mb-4 border border-[#4F772D]/20 shadow-sm">
                        <Briefcase size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#132A13] font-serif">BeeCup'ı Ofisine İste</h2>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Ofisiniz için sağlıklı, taze ve teknolojik otomat çözümü.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-[#132A13] mb-2">Talebiniz Alındı!</h3>
                        <p className="text-gray-500">En kısa sürede kurumsal ekibimiz sizinle iletişime geçecektir.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Firma Adı*</label>
                                <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Yetkili*</label>
                                <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-posta*</label>
                                <input type="email" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Telefon*</label>
                                <input type="tel" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Çalışan Sayısı</label>
                                <div className="relative">
                                    <Users size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="number" className="w-full p-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.employees} onChange={e => setFormData({ ...formData, employees: e.target.value })} />
                                </div>
                            </div>
                            <div className="relative space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Semt / İlçe</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="text" className="w-full p-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                            className="w-full bg-[#132A13] text-white py-4 rounded-xl font-bold hover:bg-black transition-all mt-4 flex justify-center items-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Gönderiliyor...</> : "Talep Oluştur"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- 3. GÖRÜŞ / ÖNERİ MODALI ---
export const FeedbackModal = () => {
    const { isFeedbackModalOpen, setIsFeedbackModalOpen } = useAppContext();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null);

    if (!isFeedbackModalOpen) return null;

    const handleSubmit = async () => {
        if (!formData.name || !formData.message || !formData.email) {
            alert("Lütfen tüm alanları doldurunuz.");
            return;
        }

        setStatus('loading');
        try {
            // Firestore
            if (db) {
                await addDoc(collection(db, 'feedbacks'), {
                    ...formData,
                    createdAt: new Date()
                });
            }

            // EmailJS
            if (CONFIG.emailJs.publicKey) {
                await emailjs.send(
                    CONFIG.emailJs.serviceId,
                    CONFIG.emailJs.templateFeedback,
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        message: `GÖRÜŞ/ÖNERİ: ${formData.message}`,
                        to_email: CONFIG.adminEmail
                    },
                    CONFIG.emailJs.publicKey
                );
            }

            setStatus('success');
            setTimeout(() => {
                setStatus(null);
                setIsFeedbackModalOpen(false);
                setFormData({ name: '', email: '', message: '' });
            }, 3000);

        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-lg relative shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={() => setIsFeedbackModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-full">
                    <X size={24} />
                </button>

                <div className="text-center mb-6 mt-2">
                    <div className="w-16 h-16 bg-[#F0F5ED] rounded-full flex items-center justify-center text-[#4F772D] mx-auto mb-4 border border-[#4F772D]/20 shadow-sm">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#132A13] font-serif">Görüşlerin Değerli</h2>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Sizden gelen her öneri, BeeCup deneyimini mükemmelleştirmemiz için bir fırsat.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-10">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-[#132A13] mb-2">Teşekkürler!</h3>
                        <p className="text-gray-500">Görüşleriniz bize ulaştı. İlginiz için teşekkür ederiz.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adınız Soyadınız*</label>
                            <input type="text" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">E-posta*</label>
                            <input type="email" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mesajınız*</label>
                            <textarea rows="4" className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#4F772D] focus:bg-white transition-colors resize-none" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                            className="w-full bg-[#132A13] text-white py-4 rounded-xl font-bold hover:bg-black transition-all mt-4 flex justify-center items-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Gönderiliyor...</> : "Görüş Bildir"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- 4. YASAL METİNLER MODALI ---
export const LegalModal = () => {
    const { legalModalType, setLegalModalType } = useAppContext();
    const LEGAL_TEXTS = {
        kvkk: {
            title: "KVKK Aydınlatma Metni",
            content: "BeeCup olarak kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') kapsamında, verileriniz yalnızca hizmet sunumu, sipariş takibi ve yasal yükümlülükler çerçevesinde işlenmektedir. Verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla paylaşılmaz. Detaylı bilgi almak için bizimle iletişime geçebilirsiniz."
        },
        privacy: {
            title: "Gizlilik Politikası",
            content: "BeeCup web sitesini ve mobil uygulamasını kullanarak gizlilik politikamızı kabul etmiş sayılırsınız. Kullanıcı deneyimini geliştirmek için çerezler (cookies) kullanılmaktadır. Ödeme bilgileriniz BeeCup sunucularında saklanmaz, güvenli ödeme altyapısı (Masterpass, Iyzico vb.) üzerinden şifreli olarak işlenir."
        },
        terms: {
            title: "Kullanım Koşulları",
            content: "Bu platformdaki tüm görseller, içerikler, logolar ve marka hakları BeeCup'a aittir. İzinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır. BeeCup, fiyat ve ürün içeriklerinde önceden haber vermeksizin değişiklik yapma hakkını saklı tutar."
        }
    };

    if (!legalModalType) return null;
    const currentData = LEGAL_TEXTS[legalModalType] || { title: "Bilgi", content: "İçerik bulunamadı." };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setLegalModalType(null)}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-3xl max-w-2xl w-full relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={() => setLegalModalType(null)} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 rounded-full">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-[#132A13] mb-6 flex items-center gap-3 font-serif border-b border-gray-100 pb-4">
                    <FileText size={24} className="text-[#4F772D]" /> {currentData.title}
                </h2>

                <div className="text-gray-600 text-sm leading-relaxed h-72 overflow-y-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                    {currentData.content}
                </div>

                <div className="mt-6 text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                    <Info size={14} /> Bu metin bilgilendirme amaçlıdır.
                </div>
            </motion.div>
        </div>
    );
};