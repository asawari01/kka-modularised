import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import "../css/VoiceInput.css";
// IMPORT THE HOOK
import { useLanguage } from "../context/LanguageContext";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
// Create the instance outside to persist it, but we config it inside
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;

const VoiceInput = ({ setQuery, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const finalTranscriptRef = useRef("");

  // GET CURRENT LANGUAGE CODE (e.g., 'mr-IN')
  const { t } = useLanguage();

  useEffect(() => {
    // UPDATE LANGUAGE DYNAMICALLY
    recognition.lang = t.langCode;
    console.log("Voice Input set to:", t.langCode);

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setQuery(finalTranscript + interimTranscript);
      finalTranscriptRef.current = finalTranscript;
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscriptRef.current) {
        onSearch(finalTranscriptRef.current);
      }
    };

    // Cleanup
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
    };
  }, [setQuery, onSearch, t.langCode]); // Re-run if language changes

  const handleToggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      finalTranscriptRef.current = "";
      setQuery("");
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Mic Error:", error);
      }
    }
  };

  return (
    <div className="voice-search-box">
      <button
        onClick={handleToggleListening}
        className={`mic-btn ${isListening ? "listening" : ""}`}
        title="Tap to Speak"
      >
        <FaMicrophone className="mic-icon" />
      </button>
    </div>
  );
};

export default VoiceInput;
