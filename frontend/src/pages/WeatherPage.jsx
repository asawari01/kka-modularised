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
  MapPin, // New Icon for chips
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
  if (iconMap[iconCode]) return iconMap[iconCode];
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
  const [displayMode, setDisplayMode] = useState("default");

  const location = useLocation();
  const navigate = useNavigate();

  // NEW: Quick Access Cities (Major Agriculture Hubs)
  const POPULAR_CITIES = [
    "Mumbai",
    "Pune",
    "Nashik",
    "Nagpur",
    "Akola",
    "Amravati",
  ];

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

  useEffect(() => {
    const redirectedCity = location.state?.city;
    const redirectedDuration = location.state?.duration || "default";

    if (redirectedCity) {
      setSearchQuery(redirectedCity);
      setDisplayMode(redirectedDuration);
      fetchData(redirectedCity);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setDisplayMode("default");
    fetchData(query);
  };

  // NEW: Handle Chip Click
  const handleCityClick = (city) => {
    setSearchQuery(city);
    handleSearch(city);
  };

  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Check Your Local Weather</h1>
        <p className="page-subtitle">
          Real-time forecasts to help you plan your farming activities.
        </p>
      </div>

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

      {/* --- NEW: EMPTY STATE SECTION (Shown when no data) --- */}
      {!loading && !weatherData && !error && (
        <div className="quick-actions-section">
          <span className="section-label">Popular Locations</span>

          <div className="chips-container">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                className="city-chip"
                onClick={() => handleCityClick(city)}
              >
                <MapPin size={16} /> {city}
              </button>
            ))}
          </div>

          <div className="weather-tips-card">
            <div className="tip-header">
              <CloudRain
                size={24}
                color="#0288d1"
              />
              <span>Farming Forecast Tip</span>
            </div>
            <p className="tip-text">
              Planning to spray fertilizers? Always check the{" "}
              <span className="highlight-text">Wind Speed</span> first. High
              winds (greater than 15 km/h) can cause drift and waste your
              expensive inputs.
            </p>
          </div>
        </div>
      )}

      {/* --- RESULTS SECTION --- */}
      <div className="weather-results-container">
        {loading && (
          <div className="gemini-loading">
            <div className="spinner"></div>
            <span>Fetching forecast...</span>
          </div>
        )}

        {error && <div className="weather-error">{error}</div>}

        {weatherData && (
          <div className="weather-cards-grid">
            {/* Card 1: Today's Summary */}
            {(displayMode === "default" || displayMode === "today") && (
              <div className="weather-card today-summary-card">
                <div className="card-header">
                  <span>TODAY'S OVERVIEW</span>
                  <span>
                    {weatherData.name} • {formatDate(weatherData.current.dt)}
                  </span>
                </div>
                <div className="card-content-row">
                  <WeatherIcon
                    iconCode={weatherData.daily[0].weather.icon}
                    size={75}
                  />
                  <div className="card-content-col">
                    <p className="weather-summary-text">
                      {weatherData.daily[0].summary}
                    </p>
                    <div className="temp-range">
                      <span className="high-temp">
                        High: {weatherData.daily[0].temp.max.toFixed(0)}°
                      </span>
                      <span className="low-temp">
                        Low: {weatherData.daily[0].temp.min.toFixed(0)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Current Conditions */}
            {(displayMode === "default" || displayMode === "today") && (
              <div className="weather-card current-weather-card">
                <div className="card-header">
                  <span>CURRENT CONDITIONS</span>
                  <span>{formatTime(weatherData.current.dt)}</span>
                </div>
                <div className="current-weather-main">
                  <div className="current-weather-temp">
                    <WeatherIcon
                      iconCode={weatherData.current.weather[0].icon}
                      size={90}
                    />
                    <div className="temp-col">
                      <span className="temp-value">
                        {weatherData.current.temp.toFixed(0)}°
                      </span>
                      <span className="temp-realfeel">
                        Feels like {weatherData.current.feels_like.toFixed(0)}°
                      </span>
                    </div>
                  </div>
                  <div className="current-weather-details">
                    <div className="detail-row">
                      <span className="detail-label">
                        <Wind size={18} /> Wind
                      </span>
                      <span>
                        {mpsToKmh(weatherData.current.wind_speed)} km/h
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <Droplet size={18} /> Humidity
                      </span>
                      <span>{weatherData.current.humidity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: 5-Day Forecast */}
            {(displayMode === "default" || displayMode === "5-day") && (
              <div className="weather-card forecast-card">
                <div className="card-header">
                  <span>5-DAY FORECAST</span>
                </div>
                <div className="forecast-list">
                  {weatherData.daily.slice(0, 5).map((day) => (
                    <div
                      className="forecast-day"
                      key={day.dt}
                    >
                      <span className="forecast-day-date">
                        {new Date(day.dt * 1000).toDateString() ===
                        new Date(Date.now() + 86400000).toDateString()
                          ? "Tomorrow"
                          : formatDate(day.dt)}
                      </span>
                      <div className="forecast-icon-wrapper">
                        <WeatherIcon
                          iconCode={day.weather.icon}
                          size={35}
                        />
                      </div>
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
