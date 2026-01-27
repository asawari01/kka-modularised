import React, { useState, useEffect } from "react";
// Import hooks to read the redirect state
import { useLocation, useNavigate } from "react-router-dom";

// Import your reusable components
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
// We'll need the API service later
// import apiService from '../services/apiService';

// We'll need a CSS file later
// import '../css/CropPricesPage.css';

const CropPricesPage = () => {
  // --- NEW: State to hold the crop name ---
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState(null);

  // --- NEW: Get location and navigate objects ---
  const location = useLocation();
  const navigate = useNavigate();

  // --- NEW: useEffect to check for redirected search ---
  useEffect(() => {
    // Check if we were redirected from HomePage with a crop
    const redirectedCrop = location.state?.crop;

    if (redirectedCrop) {
      console.log(`CropPricesPage received crop: ${redirectedCrop}`);
      // Set the search bar text
      setSearchQuery(redirectedCrop);
      // Automatically run the search
      handleSearch(redirectedCrop);

      // IMPORTANT: Clear the state from location
      // This prevents a loop if the user refreshes the page
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]); // Depend on location.state

  /**
   * Main search handler for this page.
   * --- PLACEHOLDER ---
   * We will connect this to a real crop prices API in the future.
   */
  const handleSearch = async (query) => {
    if (!query) {
      setError("Please enter a crop name.");
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    setError(null);
    setPriceData(null); // Clear old data

    console.log(`Searching for crop prices for: ${query}`);

    // --- FUTURE: ---
    // try {
    //   const data = await apiService.fetchCropPrices(query);
    //   setPriceData(data);
    // } catch (err) {
    //   setError('Failed to fetch crop prices.');
    // } finally {
    //   setLoading(false);
    // }

    // --- TEMPORARY PLACEHOLDER ---
    // We'll simulate a 1-second API call
    setTimeout(() => {
      setLoading(false);
      // For now, just show a placeholder message
      setPriceData(`(Placeholder: Data for "${query}" will be shown here)`);
    }, 1000);
  };

  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Crop Market Prices</h1>
        <p className="page-subtitle">
          Search for the latest mandi prices for your crop.
        </p>

        {/* This page has its own search bar */}
        <div className="search-box">
          <VoiceInput
            setQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          <TextInput
            query={searchQuery} // This will be pre-filled on redirect
            setQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* This is the results container for this page */}
      <div className="gemini-result-container">
        {" "}
        {/* We can reuse this CSS class */}
        {loading && (
          <div className="gemini-loading">
            {" "}
            {/* Reusing CSS */}
            <div className="spinner"></div>
            <span>Fetching prices...</span>
          </div>
        )}
        {error && (
          <div className="gemini-error">
            {" "}
            {/* Reusing CSS */}
            <p>{error}</p>
          </div>
        )}
        {priceData && (
          <div className="gemini-answer">
            {" "}
            {/* Reusing CSS */}
            <p>{priceData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPricesPage;
