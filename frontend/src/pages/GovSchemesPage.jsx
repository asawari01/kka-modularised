import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // FIXED: Added missing import
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
// IMPORT THE DATA MODULE
import { SCHEMES_DATA, STATES_LIST } from "../data/schemesData";
import "../css/GovSchemesPage.css";

const GovSchemesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All India"); // Default to Central Schemes
  const [filteredSchemes, setFilteredSchemes] = useState([]);

  const location = useLocation();

  const CATEGORIES = [
    "All",
    "Income Support",
    "Subsidy",
    "Insurance",
    "Credit",
    "Infrastructure",
  ];

  // Run filtering whenever any input changes
  useEffect(() => {
    filterSchemes(searchQuery, activeCategory, selectedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeCategory, selectedState]);

  const filterSchemes = (query, category, state) => {
    const lowerQuery = query ? query.toLowerCase() : "";

    const filtered = SCHEMES_DATA.filter((scheme) => {
      // 1. STATE LOGIC:
      // If "All India" is selected -> Show "All India" (Central) schemes.
      // If a specific state is selected -> Show schemes for THAT state + "All India" schemes.
      const stateMatch =
        state === "All India"
          ? scheme.state === "All India"
          : scheme.state === state || scheme.state === "All India";

      // 2. TEXT SEARCH LOGIC
      const textMatch =
        scheme.name.toLowerCase().includes(lowerQuery) ||
        scheme.benefits.toLowerCase().includes(lowerQuery) ||
        scheme.state.toLowerCase().includes(lowerQuery) ||
        scheme.category.toLowerCase().includes(lowerQuery);

      // 3. CATEGORY FILTER
      const categoryMatch = category === "All" || scheme.category === category;

      return stateMatch && textMatch && categoryMatch;
    });

    setFilteredSchemes(filtered);
  };

  useEffect(() => {
    // Check if we were redirected with a specific search term (e.g., "drip irrigation")
    if (location.state?.searchQuery) {
      const autoQuery = location.state.searchQuery;
      setSearchQuery(autoQuery); // Fill the input box

      // We call filterSchemes directly here or rely on the dependency array of the first useEffect.
      // Since setSearchQuery updates state, the first useEffect will trigger automatically.

      // Clear state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Government Schemes</h1>
        <p className="page-subtitle">
          Find comprehensive government aid from Central & State authorities.
        </p>

        {/* --- CONTROL PANEL --- */}
        <div className="search-box">
          <VoiceInput
            setQuery={handleSearch}
            onSearch={handleSearch}
          />
          <TextInput
            query={searchQuery}
            setQuery={handleSearch}
            onSearch={handleSearch}
          />
        </div>

        <div className="filters-container">
          {/* STATE DROPDOWN */}
          <div className="state-select-wrapper">
            <label htmlFor="state-select">Select Location:</label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="state-dropdown"
            >
              {STATES_LIST.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="scheme-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      <div className="gemini-result-container">
        <div className="schemes-grid">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="scheme-card"
              >
                <div className="scheme-header">
                  {/* Badge Logic: Blue for Central, Orange for State */}
                  <span
                    className={`scheme-badge ${
                      scheme.state === "All India" ? "central" : "state"
                    }`}
                  >
                    {scheme.authority}
                  </span>
                  <span className="scheme-state-tag">📍 {scheme.state}</span>
                </div>

                <h3 className="scheme-name">{scheme.name}</h3>

                <div className="scheme-body">
                  <div className="info-row">
                    <span className="info-label">💰 Benefit:</span>
                    <span className="info-text">{scheme.benefits}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">✅ Eligibility:</span>
                    <span className="info-text">{scheme.eligibility}</span>
                  </div>
                </div>

                <div className="scheme-footer">
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn"
                  >
                    View Details ↗
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>
                No schemes found for <strong>{selectedState}</strong> matching "
                {searchQuery}".
              </p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setSelectedState("All India");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovSchemesPage;
