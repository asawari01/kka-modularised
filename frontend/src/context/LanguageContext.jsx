import React, { createContext, useState, useContext } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to English ('en')
  const [language, setLanguage] = useState("en");

  // Helper to get the translation object for the current language
  const t = translations[language];

  // Function to switch language
  const switchLanguage = (langCode) => {
    setLanguage(langCode);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 👇 THIS IS THE LINE THAT IS LIKELY MISSING OR INCORRECT
export const useLanguage = () => useContext(LanguageContext);
