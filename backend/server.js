import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes.js";
// --- NEW ---
import geminiRoutes from "./routes/geminiRoutes.js"; // 1. Import the new router

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json()); // This is crucial for the gemini route

// --- Test Routes ---
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "i am at home alone" });
});

// --- API Routes ---
app.use("/api/weather", weatherRoutes);
// --- NEW ---
app.use("/api/gemini", geminiRoutes); // 2. Tell Express to use the new router

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
