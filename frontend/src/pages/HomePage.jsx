import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import VoiceInput from "../components/VoiceInput";
import "../css/HomePage.css";
import apiService from "../services/apiService";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [backendMessage, setBackendMessage] = useState("");

  console.log("Current Query State:", searchQuery);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const data = await apiService.fetchHelloMessage();
        setBackendMessage(data.message);
      } catch (error) {
        console.error("Error fetching backend message:", error);
        setBackendMessage("Failed to fetch backend message.");
      }
    };
    getMessage();
  }, []);

  return (
    <div className="page-content">
      <div className="page-info-sec">
        <h1 className="title">Welcome to Kisaan Ki Aawaaz!</h1>
        <p className="info">
          Your one stop agriculture information solution. Look up anything
          related to agriculture. From current market prices to latest
          government schemes, we have got it all covered.
        </p>
        <p className="api-test-message">
          <b>Test Message from Server:</b> {backendMessage}
        </p>
      </div>

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
      </div>
    </div>
  );
};

export default HomePage;
