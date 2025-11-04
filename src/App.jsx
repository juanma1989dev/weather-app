import { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import "./App.css";

const initialState = {
  loading: false,
  data: {},
  error: false,
};

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState(initialState);

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      const city = input.trim();

      if (city.length === 0) {
        return alert("Ingresa una ciudad para realizar la búsqueda.");
      }

      setWeather({ ...initialState, loading: true });

      try {
        const res = await axios.get("http://api.weatherstack.com/current", {
          params: {
            access_key: apiKey,
            query: city,
          },
        });

        // Weatherstack devuelve 200 incluso si hay error, validamos manualmente
        if (res.data.success === false || !res.data.location) {
          throw new Error(res.data.error?.info || "Ciudad no encontrada");
        }

        setWeather({
          data: res.data,
          loading: false,
          error: false,
        });
        setInput("");
      } catch (err) {
        console.error("Error:", err);
        setWeather({ ...initialState, error: true });
      }
    }
  };

  return (
    <div className="App">
      <div className="weather-app">
        <h1 className="title">🌦 Weather</h1>

        <div className="city-search">
          <input
            type="search"
            value={input}
            className="city"
            placeholder="Escribe una ciudad y presiona Enter"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Loader */}
        {weather.loading && (
          <div className="loader">
            <Oval color="#00bfff" height={70} width={70} />
          </div>
        )}

        {/* Error */}
        {weather.error && (
          <div className="error-message">
            <span>❌ Ciudad no encontrada o error en la búsqueda.</span>
          </div>
        )}

        {/* Resultado */}
        {weather.data?.location && !weather.error && !weather.loading && (
          <div className="weather-card">
            <h2>{weather.data.location.name}</h2>
            <h3>{weather.data.location.country}</h3>
            <div className="temp">{weather.data.current.temperature}°C</div>
            <p>{weather.data.current.weather_descriptions[0]}</p>
            <img
              src={weather.data.current.weather_icons[0]}
              alt="Weather Icon"
              className="weather-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
