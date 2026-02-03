import express from "express";

import axios from "axios";

const router = express.Router();

router.get("/prices", async (req, res) => {
  const { crop, location } = req.query;

  const apiKey = process.env.GOV_API_KEY;

  const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";

  // 1. LOWER LIMIT: 400 is safer than 1000 but still gets ~3 days of history

  const LIMIT = 400;

  const cleanCrop = crop; // Gemini handles the cleaning now

  let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=${LIMIT}&filters[commodity]=${encodeURIComponent(cleanCrop)}`;

  if (location && location !== "null") {
    url += `&filters[district]=${encodeURIComponent(location)}`;
  }

  // 2. RETRY LOGIC: If the server hangs up (ECONNRESET), try again up to 3 times

  let attempts = 0;

  const maxAttempts = 3;

  let success = false;

  while (attempts < maxAttempts && !success) {
    try {
      attempts++;

      console.log(`Attempt ${attempts}: Fetching data...`);

      const response = await axios.get(url, { timeout: 10000 }); // 10s timeout

      const records = response.data.records || [];

      // Sort: Newest Date + Highest Price

      const sorted = records.sort((a, b) => {
        const dateA = new Date(a.arrival_date.split("/").reverse().join("-"));

        const dateB = new Date(b.arrival_date.split("/").reverse().join("-"));

        if (dateB - dateA !== 0) return dateB - dateA;

        return Number(b.modal_price) - Number(a.modal_price);
      });

      res.json(sorted);

      success = true; // Exit loop
    } catch (error) {
      console.error(
        `Attempt ${attempts} failed: ${error.code || error.message}`,
      );

      // If it's the last attempt, send the error to the frontend

      if (attempts === maxAttempts) {
        res

          .status(500)

          .json({ error: "Government server is busy. Please try again." });
      } else {
        // Wait 1 second before retrying

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
});

export default router;
