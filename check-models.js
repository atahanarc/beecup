import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const API_KEY = process.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

async function listModels() {
    console.log("Fetching available models...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Write to file
        fs.writeFileSync("models.json", JSON.stringify(data, null, 2));
        console.log("Done. Written to models.json");

    } catch (error) {
        console.error("❌ CONNECTION ERROR:", error);
    }
}

listModels();
