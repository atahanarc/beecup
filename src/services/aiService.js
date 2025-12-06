import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// API Anahtarını .env'den al
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

// Servisi başlat
export const initAI = () => {
    if (API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY);
        // Listeden kontrol ettik, hesabınızda bu model aktif:
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    } else {
        console.error("Gemini API Key bulunamadı!");
    }
};

// Menü ve Lokasyon bilgisini çekip "System Prompt" oluşturur
const getSystemPrompt = async () => {
    let productsText = "";
    let locationsText = "";

    try {
        // 1. Ürünleri Çek
        if (db) {
            const prodSnap = await getDocs(collection(db, "products"));
            const products = prodSnap.docs.map(d => d.data());
            productsText = products.map(p => `- ${p.name} (${p.cat}): ${p.desc} - ${p.price} TL`).join("\n");

            // 2. Lokasyonları Çek
            const locSnap = await getDocs(collection(db, "locations"));
            const locations = locSnap.docs.map(d => d.data());
            locationsText = locations.map(l => `- ${l.name} (${l.status}): ${l.description}`).join("\n");
        }
    } catch (e) {
        console.error("AI Context hatası:", e);
    }

    return `
    Sen "BeeCup Asistan" adında, yardımsever, neşeli ve emoji kullanan bir yapay zeka asistanısın.
    Amacın BeeCup müşterilerine menüden öneriler yapmak ve şubeler hakkında bilgi vermek.
    
    TONUN: Samimi, enerjik, kısa ve net cevaplar veren biri. "Kanka" deme ama "Dostum" da deme, tatlı bir dil kullan.
    
    KURALLAR:
    1. Sadece BeeCup ile ilgili soruları cevapla. Genel kültür veya kodlama sorularına "Ben sadece kahve ve tatlılardan anlarım ☕" de.
    2. Rakiplerden (Starbucks, Nero vb.) asla bahsetme.
    3. Fiyat sorulursa menüdeki fiyatı söyle.
    
    İŞTE BEECUP MENÜSÜ:
    ${productsText}
    
    İŞTE ŞUBELERİMİZ:
    ${locationsText}
    
    Müşteri sana şimdi bir şey soracak. Ona göre en iyi cevabı üret.
    `;
};

// Mesaj gönderme fonksiyonu
export const sendMessageToGemini = async (userMessage, chatHistory = []) => {
    if (!model) initAI();
    if (!model) return "Bağlantı hatası: AI servisi başlatılamadı.";

    try {
        // Geçmiş konuşmaları formatla (Gemini formatı: role: 'user' | 'model')
        const history = chatHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // System Prompt'u en başa "user" gibi ekleyelim
        const systemInstruction = await getSystemPrompt();

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemInstruction }]
                },
                {
                    role: "model",
                    parts: [{ text: "Anlaşıldı! Ben BeeCup Asistanım ve müşterilere yardımcı olmaya hazırım. ☕✨ Menü ve şube bilgilerine hakimim. Soruları bekliyorum!" }]
                },
                ...history
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Hatası:", error);
        return "Şu an kahvem döküldü, birazdan tekrar dener misin? 😅 (Hata: " + error.message + ")";
    }
};
