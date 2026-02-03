// --- Central API Service ---
// Handles all backend communication.

// 1. Define backend base URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Reusable helper for API requests.
 * @param {string} endpoint - API endpoint (e.g., "/api/hello")
 * @param {object} [options] - fetch options (method, headers, body)
 * @returns {Promise<any>} - JSON response
 * Fetches live crop price data for a specific commodity.
 * @param {string} crop - The crop name (e.g., "Onion")
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      // Throw error if response is not successful
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`,
      );
    }

    // Handle 204 No Content (which has no body)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error in apiRequest:", error);
    // Propagate error for component-level handling
    throw error;
  }
};

// --- API Functions ---

/**
 * Fetches hello message from /api/hello.
 */
const fetchHelloMessage = () => {
  return apiRequest("/api/hello");
};

/**
 * Fetches weather data for a given city.
 * @param {string} city - The city name (e.g., "London")
 */
const fetchWeather = (city) => {
  // Encodes the city name for safe use in a URL
  const encodedCity = encodeURIComponent(city);
  // This calls GET /api/weather?city=London
  return apiRequest(`/api/weather?city=${encodedCity}`);
};

/**
 * --- NEW ---
 * Posts a query to the Gemini backend route.
 * @param {string} query - The user's search query
 */
const postGeminiQuery = (query) => {
  return apiRequest("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }), // Send in the format { "query": "..." }
  });
};

const fetchCropPrices = (crop) => {
  const encodedCrop = encodeURIComponent(crop);
  // This calls GET /api/crops/prices?crop=Onion
  return apiRequest(`/api/crops/prices?crop=${encodedCrop}`);
};

// --- CHANGED ---
// Export all functions as properties of a single default object
export default {
  fetchHelloMessage,
  fetchWeather,
  postGeminiQuery,
  fetchCropPrices,
};
