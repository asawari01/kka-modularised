import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Create a new router instance
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(
    "Gemini API key is missing. Please add GEMINI_API_KEY to your backend/.env file."
  );
}

// Initialize the GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * --- UPDATED System Prompt ---
 * This guides the AI to stay on topic AND to classify all new intents.
 */
const systemPrompt = `
  You are "Kisaan Ki Aawaaz," a helpful AI assistant for farmers and agricultural experts. 
  Your primary goal is to provide accurate, concise, and relevant information about agriculture. 
  
  Please adhere to these rules:

  1.  **Handle Off-Topic Questions:** If a question is clearly *not* related to agriculture (e.g., "Who won the world cup?"), you must politely decline. Respond with: "I am an agricultural assistant and can only answer questions related to farming and agriculture."

  2.  --- INTENT CLASSIFICATION RULES ---
  Your most important job is to classify the user's intent. Analyze the query and respond with *only* a JSON string if it matches one of the following "tool" or "navigational" intents.
  ABSOLUTELY DO NOT wrap the JSON response in Markdown backticks (\`\`\`) or any other text.

  3.  **WEATHER Intent (Tool):**
      * If the query is for the weather in a *specific location*.
      * You must also determine the requested timeframe or 'duration'.
      * Possible durations are: "today", "5-day", or "default" (if no specific time is mentioned).
      * The free API only supports 5 days. If the user asks for "6 days" or "15 days", classify it as "5-day".
      *
      * Examples:
      * - User Query: "weather in pune" -> Your Response: {"intent": "WEATHER", "city": "Pune", "duration": "default"}
      * - User Query: "today's weather noida" -> Your Response: {"intent": "WEATHER", "city": "Noida", "duration": "today"}
      * - User Query: "pune's weather tonight" -> Your Response: {"intent": "WEATHER", "city": "Pune", "duration": "today"}
      * - User Query: "5 day forecast for delhi" -> Your Response: {"intent": "WEATHER", "city": "Delhi", "duration": "5-day"}
      * - User Query: "15 day weather in noida" -> Your Response: {"intent": "WEATHER", "city": "Noida", "duration": "5-day"}

  4.  **CROP_PRICES Intent (Tool):**
      * If the query is for the *market price* of a *specific crop*.
      * Response: {"intent": "CROP_PRICES", "crop": "Crop Name"}
      * Example: {"intent": "CROP_PRICES", "crop": "Wheat"}

  6.  **GOV_SCHEMES Intent (Navigational):**
      * If the query is a request to *navigate to* the government schemes page.
      * Response: {"intent": "GOV_SCHEMES"}

  7.  **GENERAL_INFO Intent (Default):**
      * If the query is a *general question* that does NOT match any of the intents above (e.g., "how to grow rice", "what is a good fertilizer", "will it rain this month?"), you must answer it normally.
      * Do NOT output JSON. Provide a helpful, concise answer as an agricultural expert.
`;

/**
 * POST /api/gemini
 * Receives a query, sends it to Gemini for classification/answering.
 */
router.post("/", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "City parameter is required" });
  }
  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ message: "Server configuration error: API key missing" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(query);
    const response = result.response;
    let text = response.text();

    // --- NEW, ROBUST CLEANING LOGIC ---
    // 1. Trim whitespace/newlines first for clean string manipulation
    text = text.trim();

    // 2. Remove "```json" and "```" wrappers from the AI's response
    if (text.startsWith("```json")) {
      text = text.substring(7); // Remove the "```json" prefix
    }
    if (text.startsWith("```")) {
      text = text.substring(3); // Remove the "```" prefix
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3); // Remove the "```" suffix
    }

    // 3. Final trim to remove any remaining inner whitespace/newlines
    text = text.trim();
    // Now, 'text' is either a clean JSON string or a normal text answer.

    // --- Success ---
    // Send the *cleaned* text to the frontend
    res.json({ answer: text });
  } catch (error) {
    console.error("Error in /api/gemini route:", error.message);
    res.status(500).json({ message: "Failed to get response from AI" });
  }
});

// Export the router
export default router;
