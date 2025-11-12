// --- Central API Service ---

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Reusable helper for API requests.
 * @param {string} endpoint - API endpoint (e.g., "/api/hello")
 * @param {object} [options] - fetch options (method, headers, body)
 * @returns {Promise<any>} - JSON response
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      // Throw error if response is not successful
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
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

export default { fetchHelloMessage };
