import React, { useState, useEffect, useRef} from "react";
import { FaMicrophone } from 'react-icons/fa'
import '../css/VoiceInput.css'


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = 'en-US';

const VoiceInput = ({ setQuery, onSearch }) => {
    const [ isListening, setIsListening ] = useState(false);

    const finalTranscriptRef = useRef('');

    useEffect(() => {

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = 0; i < event.results.length; i++){
                const transcriptPart  = event.results[i][0].transcript;
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

        return () => {
            recognition.onresult = null;
            recognition.onend = null;
        };
    }, [setQuery, onSearch]);

    const handleToggleListening = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            finalTranscriptRef.current = '';
            setQuery('');
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <div className="voice-search-box">
            <button
                onClick={handleToggleListening}
                className={`mic-btn ${isListening ? 'listening' : ''}`}
            >
                <FaMicrophone className="mic-icon"/>
            </button>
        </div>
    );
};

export default VoiceInput;

