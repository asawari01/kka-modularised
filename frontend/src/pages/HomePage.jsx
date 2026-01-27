import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
import "../css/HomePage.css";
import apiService from "../services/apiService";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [geminiResult, setGeminiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await apiService.fetchHelloMessage();
        setBackendMessage(data.message);
      } catch (error) {
        console.error("Error fetching backend message:", error);
        setBackendMessage("Failed to fetch test message.");
      }
    };
    getMessage();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query) {
      setError("Please enter a question.");
      return;
    }

    console.log("Searching for:", query);

    setIsLoading(true);
    setGeminiResult("");
    setError(null);

    try {
      // Call the Gemini API
      const data = await apiService.postGeminiQuery(query);

      // Smart Intent Logic
      try {
        const parsedAnswer = JSON.parse(data.answer);

        switch (parsedAnswer.intent) {
          // --- CHANGED ---
          case "WEATHER":
            // We now also pass the duration, defaulting to 'default'
            const duration = parsedAnswer.duration || "default";
            console.log(
              `Redirecting to WeatherPage with city: ${parsedAnswer.city} and duration: ${duration}`
            );
            navigate("/weather", {
              state: {
                city: parsedAnswer.city,
                duration: duration,
              },
            });
            return;

          case "CROP_PRICES":
            console.log(
              `Redirecting to CropPricesPage with crop: ${parsedAnswer.crop}`
            );
            navigate("/cropPrices", { state: { crop: parsedAnswer.crop } });
            return;

          case "GOV_SCHEMES":
            console.log("Redirecting to GovSchemesPage");
            navigate("/governmentSchemes");
            return;

          default:
            console.log("Received unknown JSON, treating as text.");
            setGeminiResult(data.answer);
        }
      } catch (e) {
        // Not JSON, so it's a normal text answer
        console.log("Not a JSON intent, treating as normal answer.");

        if (data.answer.includes("I am an agricultural assistant")) {
          setError(data.answer);
        } else {
          setGeminiResult(data.answer);
        }
      }
    } catch (err) {
      console.error("Error fetching Gemini response:", err);
      setError("Sorry, I couldn't get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* This is your existing info section */}
      <div className="page-info-sec">
        <h1 className="title">Welcome to Kisaan Ki Aawaaz!</h1>
        <p className="info">
          Your one stop agriculture information solution. Look up anything
          related to agriculture. From current market prices to latest
          government schemes, we have got it all covered.
        </p>
      </div>

      {/* This is your existing main content section */}
      <div className="page-main-content">
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

        {/* This section is unchanged */}
        <div className="gemini-result-container">
          {isLoading && (
            <div className="gemini-loading">
              <div className="spinner"></div>
              <span>Thinking...</span>
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
