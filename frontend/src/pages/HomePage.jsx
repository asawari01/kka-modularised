import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
import "../css/HomePage.css";
import apiService from "../services/apiService";
import { Lightbulb } from "lucide-react";
// IMPORT THE HOOK
import { useLanguage } from "../context/LanguageContext";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [geminiResult, setGeminiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET TRANSLATIONS
  const { t } = useLanguage();

  const navigate = useNavigate();

  // --- TIP OF THE DAY (Static for now, can be translated later) ---
  const TIPS = [
    "Rotate your crops (e.g., Soybean → Wheat) to replenish soil Nitrogen naturally.",
    "Water your crops early in the morning to reduce evaporation loss.",
    "Test your soil pH every 3 years to save money on unnecessary fertilizers.",
    "Mulching can reduce water usage by up to 30% in dry seasons.",
  ];

  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    setDailyTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query) {
      setError(t.home.placeholder);
      return;
    }

    setIsLoading(true);
    setGeminiResult("");
    setError(null);

    try {
      const data = await apiService.postGeminiQuery(query);

      try {
        // Parse the JSON string received from backend
        const parsedAnswer = JSON.parse(data.answer);

        console.log("Parsed Intent:", parsedAnswer);

        switch (parsedAnswer.intent) {
          case "WEATHER":
            const duration = parsedAnswer.duration || "default";
            navigate("/weather", {
              state: { city: parsedAnswer.city, duration: duration },
            });
            break;

          case "CROP_PRICES":
            const loc =
              parsedAnswer.location === "null" ? null : parsedAnswer.location;
            navigate("/cropPrices", {
              state: { crop: parsedAnswer.crop, location: loc },
            });
            break;

          case "GOV_SCHEMES":
            navigate("/governmentSchemes", {
              state: { searchQuery: parsedAnswer.search_term || "" },
            });
            break;

          case "GENERAL_INFO":
            // Show the translated answer directly on Home Page
            setGeminiResult(parsedAnswer.answer);
            break;

          default:
            // Fallback for unexpected intents
            setGeminiResult(JSON.stringify(parsedAnswer));
        }
      } catch (e) {
        console.error("JSON Parsing failed:", e);
        // If it's not JSON, just show the text (Safety net)
        setGeminiResult(data.answer);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(t.home.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-info-sec">
        {/* TRANSLATED TITLE & SUBTITLE */}
        <h1 className="title">{t.home.title}</h1>
        <p className="info">{t.home.subtitle}</p>
      </div>

      <div className="page-main-content">
        <div className="search-box">
          {/* We will update VoiceInput next to accept 'lang' */}
          <VoiceInput
            setQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          <TextInput
            query={searchQuery}
            setQuery={setSearchQuery}
            onSearch={handleSearch}
            placeholder={t.home.placeholder} // TRANSLATED PLACEHOLDER
          />
        </div>

        {!geminiResult && !isLoading && !error && (
          <div className="suggestions-section">
            <div className="daily-tip-card">
              <div className="tip-header">
                <Lightbulb
                  size={24}
                  color="#f59e0b"
                />
                <span>{t.home.tipTitle}</span>
              </div>
              <p className="tip-content">{dailyTip}</p>
            </div>
          </div>
        )}

        <div className="gemini-result-container">
          {isLoading && (
            <div className="gemini-loading">
              <div className="spinner"></div>
              <span>{t.home.loading}</span>
            </div>
          )}
          {error && (
            <div className="gemini-error">
              <p>{error}</p>
            </div>
          )}
          {geminiResult && (
            <div className="gemini-answer">
              <p>{geminiResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
