import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const systemPrompt = `
  You are an API router for an agricultural app.
  Your job is to translate user queries (Hindi/Marathi/English) into structured JSON commands.

  --- INTENT RULES ---
  1. **WEATHER**: Triggered by rain, temp, "paus", "havaman".
     - Output: { "intent": "WEATHER", "city": "CityName", "duration": "default" }
     - If city is missing, assume "Mumbai".

  2. **CROP_PRICES**: Triggered by mandi, bhav, rate, price.
     - Output: { "intent": "CROP_PRICES", "crop": "EnglishCropName", "location": "EnglishDistrictName" }
     - Map local names: "Kanda"->"Onion", "Kapus"->"Cotton".
     - If location missing, set "location": "null".

  3. **GOV_SCHEMES**: Triggered by yojana, subsidy, loan.
     - Output: { "intent": "GOV_SCHEMES", "search_term": "EnglishTopic" }

  4. **GENERAL_INFO**: Fallback for general questions.
     - Output: { "intent": "GENERAL_INFO", "answer": "Answer in the USER'S LANGUAGE" }
`;

router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) return res.status(400).json({ message: "Query required" });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      // CRITICAL FIX: Force JSON output
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(query);
    const response = result.response;
    const text = response.text();

    console.log("Gemini JSON Output:", text); // Debug log

    // Send the raw JSON directly (it's guaranteed to be clean now)
    res.json({ answer: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ message: "AI Service Failed" });
  }
});

export default router;
