import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a new router instance
const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

router.get("/", async (req, res) => {
  const { city } = req.query;

  // --- DEBUGGING LINES REMOVED ---

  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }
  if (!API_KEY) {
    console.error("OpenWeather API key is missing from .env");
    return res
      .status(500)
      .json({ message: "Server configuration error: API key missing" });
  }

  try {
    // --- Step 1: Geocoding (Same as before) ---
    const geoResponse = await fetch(
      `${GEO_API_URL}?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (!geoResponse.ok) {
      throw new Error(`Geocoding API failed: ${geoResponse.statusText}`);
    }

    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      return res.status(404).json({ message: `City not found: ${city}` });
    }

    const { lat, lon, name } = geoData[0];

    // --- Step 2: Fetch Current and Forecast data IN PARALLEL ---
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      // Call 1: Get CURRENT weather
      fetch(
        `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      ),
      // Call 2: Get 5-DAY forecast
      fetch(
        `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      ),
    ]);

    if (!currentWeatherResponse.ok) {
      throw new Error(
        `Current Weather API failed: ${currentWeatherResponse.statusText}`
      );
    }
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API failed: ${forecastResponse.statusText}`);
    }

    const currentWeatherData = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();

    // --- Step 3: Transform Data ---
    const responseData = {
      name: name, // The city name from geocoding
      current: {
        dt: currentWeatherData.dt,
        temp: currentWeatherData.main.temp,
        feels_like: currentWeatherData.main.feels_like,
        humidity: currentWeatherData.main.humidity,
        wind_speed: currentWeatherData.wind.speed,
        wind_gust: currentWeatherData.wind.gust,
        weather: currentWeatherData.weather,
      },
      // Process the 5-day/3-hour forecast to find daily summaries
      daily: processDailyForecast(forecastData.list),
    };

    // --- Success ---
    res.json(responseData);
  } catch (error) {
    console.error("Error in /api/weather route:", error.message);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

/**
 * Helper function to process the 3-hour forecast list into daily summaries.
 */
function processDailyForecast(forecastList) {
  const dailyData = {};

  for (const item of forecastList) {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // Get YYYY-MM-DD

    if (!dailyData[date]) {
      // If this is the first entry for this day
      dailyData[date] = {
        dt: item.dt,
        temp: {
          min: item.main.temp_min,
          max: item.main.temp_max,
        },
        weather: item.weather[0], // Use the first weather entry
        // A simple summary. OpenWeather doesn't provide a daily "summary" in this API.
        summary: `Forecast: ${
          item.weather[0].main
        } with temps around ${item.main.temp.toFixed(0)}°C.`,
      };
    } else {
      // Update min/max temps for the day
      dailyData[date].temp.min = Math.min(
        dailyData[date].temp.min,
        item.main.temp_min
      );
      dailyData[date].temp.max = Math.max(
        dailyData[date].temp.max,
        item.main.temp_max
      );
    }
  }

  // Return just the values as an array, which is what the frontend expects
  return Object.values(dailyData);
}

// Export the router
export default router;
