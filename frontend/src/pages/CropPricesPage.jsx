import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
import apiService from "../services/apiService";
import "../css/CropPricesPage.css";

const CropPricesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [allRecords, setAllRecords] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Professional Currency Formatter
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    const redirectedCrop = location.state?.crop;
    if (redirectedCrop) {
      setSearchQuery(redirectedCrop);
      handleSearch(redirectedCrop, location.state?.location);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  /**
   * Safe Day Name Extractor
   * Converts "28/01/2026" -> "Wednesday"
   */
  const getDayName = (dateStr) => {
    try {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-IN", { weekday: "long" });
    } catch (e) {
      return "Market Day";
    }
  };

  const handleSearch = async (query, userLocation) => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setPriceData(null);
    setAllRecords([]);

    try {
      const records = await apiService.fetchCropPrices(query, userLocation);

      if (!records || records.length === 0) {
        setError(
          "No records found. Try searching for standard crops like 'Onion' or 'Cotton'.",
        );
        return;
      }

      /**
       * OPTIMIZED DATA NORMALIZATION
       * We use a 'Set' to filter for UNIQUE dates.
       * Since the backend sorts by Price DESC, the first record we encounter for any date
       * is automatically the Highest Price for that day.
       */
      const uniqueDates = [];
      const seenDates = new Set();

      for (const r of records) {
        if (!seenDates.has(r.arrival_date)) {
          uniqueDates.push(r);
          seenDates.add(r.arrival_date);
        }
      }

      setAllRecords(uniqueDates);

      // Extract Latest & Previous Data
      const latest = uniqueDates[0];
      const hasHistory = uniqueDates.length > 1;
      const prev = hasHistory ? uniqueDates[1] : latest;

      const todayVal = Number(latest.modal_price) || 0;
      const prevVal = Number(prev.modal_price) || 0;
      const diffVal = todayVal - prevVal;

      // Calculate Period Average
      const totalModal = uniqueDates.reduce(
        (sum, r) => sum + (Number(r.modal_price) || 0),
        0,
      );
      const avgVal = totalModal / uniqueDates.length;

      setPriceData({
        today: todayVal,
        yesterday: hasHistory ? prevVal : null,
        difference: hasHistory ? diffVal : 0,
        average: avgVal.toFixed(0),
        market: latest.market,
        district: latest.district,
        date: latest.arrival_date,
        min: latest.min_price,
        max: latest.max_price,
        hasHistory: hasHistory,
      });
    } catch (err) {
      console.error("Mandi Search Error:", err);
      setError("Market API is currently busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Ask for mandi rates for your crops!</h1>
        <p className="page-subtitle">Live Mandi Rates & Historical Trends</p>

        <div className="search-box">
          <VoiceInput
            setQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          <TextInput
            query={searchQuery}
            setQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="gemini-result-container">
        {loading && (
          <div className="gemini-loading">
            <div className="spinner"></div>
            <span>Analyzing historical trends...</span>
          </div>
        )}

        {error && (
          <div className="gemini-error">
            <p>{error}</p>
          </div>
        )}

        {priceData && (
          <div className="price-report-card">
            {/* 1. HEADER SECTION */}
            <div className="card-header">
              <div className="header-info">
                {/* NEW: Flex row to put Crop + Location side-by-side */}
                <div className="header-title-row">
                  <h3>{searchQuery.toUpperCase()}</h3>

                  {/* The Location Badge */}
                  <span className="location-suffix">
                    in {priceData.district}
                  </span>
                </div>

                {/* Specific Mandi Name below */}
                <span className="mandi-location">{priceData.market}</span>
              </div>

              <span className="report-date">UPDATED: {priceData.date}</span>
            </div>

            {/* 2. MAIN PRICE DISPLAY */}
            <div className="price-main-section">
              <div className="price-display">
                <span className="label">Current Modal Price</span>
                <span className="value">{formatCurrency(priceData.today)}</span>
                <span className="unit">/ Quintal</span>
              </div>

              {/* Trend Pill - Only shows if history exists */}
              <div
                className={`trend-indicator ${
                  priceData.difference >= 0 ? "up" : "down"
                } ${!priceData.hasHistory ? "hidden" : ""}`}
              >
                <span className="trend-icon">
                  {priceData.difference >= 0 ? "▲" : "▼"}
                </span>
                <span className="trend-text">
                  {formatCurrency(Math.abs(priceData.difference))} vs last
                  session
                </span>
              </div>
            </div>

            {/* 3. STATS GRID (Boxes for clear separation) */}
            <div className="price-stats-grid">
              <div className="stat-box">
                <span className="stat-label">Previous Session</span>
                <span className="stat-value">
                  {priceData.hasHistory
                    ? formatCurrency(priceData.yesterday)
                    : "Data Unavailable"}
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Period Average</span>
                <span className="stat-value">
                  {formatCurrency(priceData.average)}
                </span>
              </div>
            </div>

            {/* 4. HISTORY LIST (If available) */}
            {allRecords.length > 1 && (
              <div className="recent-history-section">
                <h4 className="history-title">Price Timeline</h4>
                <div className="recent-history-list">
                  {allRecords.slice(0, 5).map((record, index) => (
                    <div
                      key={index}
                      className="history-row"
                    >
                      <div className="history-date-group">
                        <span className="day-name">
                          {getDayName(record.arrival_date)}
                        </span>
                        <span className="history-date">
                          {record.arrival_date}
                        </span>
                      </div>
                      <span className="history-price">
                        {formatCurrency(record.modal_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FOOTER RANGE */}
            <div className="price-range-info">
              <p>
                Trading Range:
                <strong>{formatCurrency(priceData.min)}</strong>—
                <strong>{formatCurrency(priceData.max)}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPricesPage;
