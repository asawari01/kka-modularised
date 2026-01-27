import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
import apiService from "../services/apiService";
import "../css/WeatherPage.css";
import {
  Wind,
  Droplet,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
} from "lucide-react";

// --- Helper Functions (Unchanged) ---
const mpsToKmh = (mps) => (mps * 3.6).toFixed(1);
const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};
const WeatherIcon = ({ iconCode, size }) => {
  const iconMap = {
    "01d": (
      <Sun
        size={size}
        color="#f97316"
      />
    ),
    "01n": (
      <Moon
        size={size}
        color="#6b7280"
      />
    ),
    "02d": (
      <Sun
        size={size}
        style={{ opacity: 0.8 }}
      />
    ),
    "02n": (
      <Moon
        size={size}
        style={{ opacity: 0.8 }}
      />
    ),
    "03d": (
      <Cloud
        size={size}
        color="#6b7280"
      />
    ),
    "03n": (
      <Cloud
        size={size}
        color="#6b7280"
      />
    ),
    "04d": (
      <Cloud
        size={size}
        color="#4b5563"
      />
    ),
    "04n": (
      <Cloud
        size={size}
        color="#4b5563"
      />
    ),
    "09d": (
      <CloudRain
        size={size}
        color="#3b82f6"
      />
    ),
    "09n": (
      <CloudRain
        size={size}
        color="#3b82f6"
      />
    ),
    "10d": (
      <CloudRain
        size={size}
        color="#3b82f6"
      />
    ),
    "10n": (
      <CloudRain
        size={size}
        color="#3b82f6"
      />
    ),
    "11d": (
      <Zap
        size={size}
        color="#f59e0b"
      />
    ),
    "11n": (
      <Zap
        size={size}
        color="#f59e0b"
      />
    ),
    "13d": (
      <CloudSnow
        size={size}
        color="#0ea5e9"
      />
    ),
    "13n": (
      <CloudSnow
        size={size}
        color="#0ea5e9"
      />
    ),
    "50d": (
      <Cloud
        size={size}
        color="#9ca3af"
      />
    ),
    "50n": (
      <Cloud
        size={size}
        color="#9ca3af"
      />
    ),
  };
  if (iconMap[iconCode]) {
    return iconMap[iconCode];
  }
  return (
    <img
      src={`http://openweathermap.org/img/wn/${iconCode}@2x.png`}
      alt="weather icon"
      style={{ width: size, height: size }}
    />
  );
};

// --- The Main Component ---
const WeatherPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- NEW: State to control what cards to show ---
  const [displayMode, setDisplayMode] = useState("default"); // 'default', 'today', '5-day'

  const location = useLocation();
  const navigate = useNavigate();

  // --- NEW: Refactored search logic into its own function ---
  // This function ONLY fetches data.
  const fetchData = async (query) => {
    if (!query) {
      setError("Please enter a city name.");
      return;
    }
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await apiService.fetchWeather(query);
      console.log("Weather data received:", data);
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      if (err.message && err.message.includes("404")) {
        setError(`City not found: ${query}. Please try again.`);
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED: useEffect now reads duration and calls fetchData ---
  useEffect(() => {
    const redirectedCity = location.state?.city;
    // Get the duration from the state, or use 'default'
    const redirectedDuration = location.state?.duration || "default";

    if (redirectedCity) {
      console.log(
        `WeatherPage received city: ${redirectedCity} and duration: ${redirectedDuration}`
      );
      setSearchQuery(redirectedCity);
      setDisplayMode(redirectedDuration); // Set the display mode
      fetchData(redirectedCity); // Call the fetch function

      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]); // Removed fetchData from deps to avoid re-runs

  // --- UPDATED: This is now for MANUAL search from the search bar ---
  // It resets the display mode to 'default' and calls fetchData.
  const handleSearch = (query) => {
    setSearchQuery(query);
    setDisplayMode("default"); // Manual search always shows default view
    fetchData(query);
  };

  return (
    <div className="page-content">
      {/* 1. SEARCH SECTION (Unchanged) */}
      <div className="page-main-content">
        <h1 className="page-title">Check Your Local Weather</h1>
        <p className="page-subtitle">
          Enter a city to get weather details relevant for agriculture.
        </p>
      </div>

      {/* Note: onSearch now calls handleSearch (the manual search) */}
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

      {/* 2. RESULTS SECTION (UPDATED with conditional logic) */}
      <div className="weather-results-container">
        {loading && <div className="weather-loading">Loading...</div>}
        {error && <div className="weather-error">{error}</div>}

        {weatherData && (
          <div className="weather-cards-grid">
            {/* --- Card 1: Today's Summary --- */}
            {/* Show if mode is 'default' OR 'today' */}
            {(displayMode === "default" || displayMode === "today") && (
              <div className="weather-card today-summary-card">
                <div className="card-header">
                  <span>TODAY'S WEATHER</span>
                  <span>
                    {weatherData.name} - {formatDate(weatherData.current.dt)}
                  </span>
                </div>
                <div className="card-content-row">
                  <WeatherIcon
                    iconCode={weatherData.daily[0].weather.icon}
                    size={75}
                  />
                  <div className="card-content-col">
                    <p>{weatherData.daily[0].summary}</p>
                    <p>
                      <b>Hi: {weatherData.daily[0].temp.max.toFixed(1)}°</b>
                    </p>
                    <p>
                      <b>Lo: {weatherData.daily[0].temp.min.toFixed(1)}°</b>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --- Card 2: Current Weather --- */}
            {/* Show if mode is 'default' OR 'today' */}
            {(displayMode === "default" || displayMode === "today") && (
              <div className="weather-card current-weather-card">
                <div className="card-header">
                  <span>CURRENT WEATHER</span>
                  <span>{formatTime(weatherData.current.dt)}</span>
                </div>
                {/* ... (rest of card 2 is unchanged) ... */}
                <div className="current-weather-main">
                  <div className="current-weather-temp">
                    <WeatherIcon
                      iconCode={weatherData.current.weather[0].icon}
                      size={100}
                    />
                    <div className="temp-col">
                      <span className="temp-value">
                        {weatherData.current.temp.toFixed(1)}°
                        <span className="temp-unit">C</span>
                      </span>
                      <span className="temp-realfeel">
                        RealFeel® {weatherData.current.feels_like.toFixed(1)}°
                      </span>
                    </div>
                  </div>
                  <div className="current-weather-details">
                    <div className="detail-row">
                      <span className="detail-label">
                        <Wind size={18} />
                        <span>Wind</span>
                      </span>
                      <span>
                        {mpsToKmh(weatherData.current.wind_speed)} km/h
                      </span>
                    </div>
                    {weatherData.current.wind_gust && (
                      <div className="detail-row">
                        <span className="detail-label">
                          <Wind
                            size={18}
                            style={{ opacity: 0.7 }}
                          />
                          <span>Wind Gusts</span>
                        </span>
                        <span>
                          {mpsToKmh(weatherData.current.wind_gust)} km/h
                        </span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">
                        <Droplet size={18} />
                        <span>Humidity</span>
                      </span>
                      <span>{weatherData.current.humidity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Card 3: 5-Day Forecast (UPGRADED) --- */}
            {/* Show if mode is 'default' OR '5-day' */}
            {(displayMode === "default" || displayMode === "5-day") && (
              <div className="weather-card forecast-card">
                <div className="card-header">
                  <span>5-DAY FORECAST</span>
                </div>
                {/* --- NEW LOOP --- */}
                {/* This maps over the first 5 days and creates a list */}
                <div className="forecast-list">
                  {weatherData.daily.slice(0, 5).map((day) => (
                    <div
                      className="forecast-day"
                      key={day.dt}
                    >
                      <span className="forecast-day-date">
                        {/* Show "Tomorrow" for the second day, else the date */}
                        {new Date(day.dt * 1000).toDateString() ===
                        new Date(Date.now() + 86400000).toDateString()
                          ? "Tomorrow"
                          : formatDate(day.dt)}
                      </span>
                      <WeatherIcon
                        iconCode={day.weather.icon}
                        size={40}
                      />
                      <span className="forecast-day-temp">
                        <b>{day.temp.max.toFixed(0)}°</b> /{" "}
                        {day.temp.min.toFixed(0)}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
