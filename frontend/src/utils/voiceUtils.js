/**
 * Global TTS function to read out data
 * @param {string} text - The string to speak
 * @param {string} lang - 'en', 'hi', or 'mr'
 */
export const speak = (text, lang) => {
  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Map our app codes to browser voice codes
  const voiceMap = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
  };

  utterance.lang = voiceMap[lang] || "en-IN";
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};
