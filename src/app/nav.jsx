"use client";
import { useState } from "react";
import libro from "./libro";

export default function VoiceSearchBar() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  let recognition;

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
  
    if (!recognition) {
      recognition = new window.webkitSpeechRecognition();
      recognition.lang = "es-ES";
      recognition.continuous = false;
      recognition.interimResults = false;
  
      recognition.onresult = (event) => {
        setQuery(event.results[0][0].transcript);
      };
  
      recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
      };
  
      recognition.onend = () => {
        setListening(false);
      };
    }
  
    // Si el reconocimiento está en curso, detenerlo
    if (listening) {
      recognition.stop();
    } else {
      recognition.abort();  // Esto asegura que el reconocimiento no esté en otro estado cuando inicie
      recognition.start();
    }
  
    setListening(!listening);
  };

  return (
    <div className="nav-container">
    <nav className="search-container">
      <input
        type="text"
        className="input-nav"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className={`p-2 rounded-md ${listening ? "bg-red-500" : "bg-blue-500"}`}
        onClick={handleVoiceSearch}
      >
        🎤
      </button>
    </nav>
    </div>
  );
}
