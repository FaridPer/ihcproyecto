"use client";
import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaEye } from "react-icons/fa";
import Link from "next/link";

export default function VoiceSearchBar() {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState([]);
  const audioRefs = useRef({});
  const [playingTrack, setPlayingTrack] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetch("/api/search?q=") // Dejar la query vacía para obtener todos
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      })
      .catch((err) => console.error("Error al obtener los libros:", err));
  }, []);
  

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome");
      return;
    }
  
    // 🛑 Si ya existe una instancia, detenerla antes de crear una nueva
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null; 
    }
  
    // Crear una nueva instancia de reconocimiento
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = "es-ES";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
  
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      
      // 🛑 Reiniciar la consulta antes de asignar un nuevo valor
      setQuery(""); 
      setTimeout(() => setQuery(transcript), 100);
    };
    
    
    
  
    recognitionRef.current.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
    };
  
    recognitionRef.current.onend = () => {
      setListening(false);
      recognitionRef.current = null; // 🛑 Eliminar la instancia después de finalizar
    };
  
    recognitionRef.current.start();
    setListening(true);
  };
  

  useEffect(() => {
    // 🛑 Pausar y reiniciar cualquier audio en reproducción antes de cambiar resultados
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  
    setPlayingTrack(null);  // Resetear estado de reproducción
  }, [results]);
  
  console.log(Object.keys(audioRefs.current));


  useEffect(() => {
    if (query.length > 2) {
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          // 🛑 DETENER AUDIOS ACTIVOS
          Object.values(audioRefs.current).forEach((audio) => {
            if (audio) {
              audio.pause();
              audio.currentTime = 0; // Reiniciar audio
            }
          });
  
          // 🛑 LIMPIAR REFERENCIAS ANTIGUAS
          Object.keys(audioRefs.current).forEach(key => {
            delete audioRefs.current[key];
          });
  
          setPlayingTrack(null); // Resetear estado de reproducción
          setResults(data);
        })
        .catch((err) => console.error("Error en la búsqueda:", err));
    } else {
      setResults([]);
    }
  }, [query]);
  
  const togglePlayPause = (index) => {
    const audio = audioRefs.current[index];
  
    if (!audio) return; // Si no hay referencia, no hacer nada
  
    if (playingTrack === index) {
      if (!audio.paused) {
        audio.pause();
        setPlayingTrack(null); 
      } else {
        audio.play();
        setPlayingTrack(index);
      }
    } else {
      // 🔥 Detener cualquier otro audio en reproducción
      Object.values(audioRefs.current).forEach((audioEl) => {
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
          audioEl.currentTime = 0;
        }
      });
  
      audio.play();
      setPlayingTrack(index);
    }
  };
  
  
  

  return (
    <div>
      <nav className="nav-container">
        <div className="search-container">
          <input
            type="text"
            className="input-nav"
            placeholder="Escribe o presiona el botón para grabar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className={`p-2 rounded-md ${listening ? "bg-red-500" : "bg-blue-500"}`}
            onClick={handleVoiceSearch}
          >
            🎤
          </button>
        </div>
      </nav>

      <main>
        {results.length > 0 && (
          <div className="search-results">
            {results.map((item, index) => (
              <div key={index} className="result-item">
                <h3>{item.name}</h3>
                <img alt={`Portada de: ${item.name}`} src={`/libros/${item.image}`} />
                <audio 
                      ref={(el) => {
                        if (el) {
                          audioRefs.current[index] = el; 
                        } else {
                          delete audioRefs.current[index]; // 🛑 Elimina referencias nulas
                        }
                      }} 
                      preload="none"
                    >
                      <source src={`/libros/${item.audio}`} type="audio/mpeg" />
                      Tu navegador no soporta audio.
                </audio>

                <div className="menu">
                  <div id="player-container">
                    <button 
                      onClick={() => togglePlayPause(index)} 
                      className="play-button"
                    >
                      {playingTrack === index && !audioRefs.current[index]?.paused ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                  <div className="read-container">
                    <button className="read-button">
                    <Link href={`/libros/${item.archive}`}>
                      <FaEye />
                    </Link>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
