
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/aiService';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Selam! 👋 Ben BeeCup Asistan. Sana nasıl yardımcı olabilirim? Hangi kahveyi seversin?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // AI Cevabı
        const botResponseText = await sendMessageToGemini(input, messages);

        const botMsg = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* CHAT PENCERESİ */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-100"
                    >
                        {/* HEADER */}
                        <div className="bg-[#132A13] p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sparkles size={18} className="text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">BeeCup Asistan</h3>
                                    <p className="text-[10px] text-gray-300 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Çevrimiçi
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* MESAJLAR */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 text-sm rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-[#4F772D] text-white rounded-tr-none'
                                            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-[#4F772D]" />
                                        <span className="text-xs text-gray-400">Yazıyor...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* INPUT */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Bir şeyler sor..."
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#4F772D]/20 outline-none text-gray-700"
                                />
                                <button
                                    type="submit"
                                    disabled={!input || loading}
                                    className="bg-[#132A13] text-white p-2 rounded-xl hover:bg-[#4F772D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AÇMA BUTONU */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-[#132A13] p-4 rounded-full text-white shadow-xl hover:shadow-2xl hover:bg-[#4F772D] transition-all flex items-center justify-center group"
                >
                    <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                </motion.button>
            )}
        </div>
    );
};

export default ChatWidget;
