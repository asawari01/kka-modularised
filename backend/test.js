import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.DATA_GOV_KEY;
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

console.log("------------------------------------------------");
console.log("🔍 DIAGNOSTIC TEST");
console.log("------------------------------------------------");

if (!API_KEY) {
  console.error("❌ CRITICAL: DATA_GOV_KEY is missing in .env file!");
  process.exit(1);
} else {
  console.log(`✅ API Key loaded: ${API_KEY.substring(0, 4)}...`);
}

const testConnection = async () => {
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=5`;

  console.log("\n📡 Attempt 1: Simple Request (No Headers)...");
  try {
    const res = await axios.get(url, { timeout: 10000 });
    console.log(`✅ SUCCESS! Status: ${res.status}`);
    console.log(`📊 Records Found: ${res.data.records.length}`);
    return; // Exit if success
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    if (error.response)
      console.log(
        `   Server responded: ${error.response.status} ${error.response.statusText}`,
      );
  }

  console.log("\n📡 Attempt 2: With User-Agent Header...");
  try {
    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json",
      },
    });
    console.log(`✅ SUCCESS! Status: ${res.status}`);
    console.log(`📊 Records Found: ${res.data.records.length}`);
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    if (error.response)
      console.log(
        `   Server responded: ${error.response.status} ${error.response.statusText}`,
      );
  }
};

testConnection();
