import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "i am at home alone" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
