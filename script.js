const input = document.getElementById("locationInput");
const button = document.getElementById("searchButton");
const locationElem = document.getElementById("location");
const tempElem = document.getElementById("temperature");
const descElem = document.getElementById("description");
const weatherInfo = document.querySelector(".weather-info");
const suggestionsContainer = document.getElementById("suggestions");

// Static list of some city names + their latitudes and longitudes for Open-Meteo API
const cityList = [
  { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867 },
  { name: "Ratnagiri", lat: 16.9902, lon: 73.3120 }
];

// Function to find city data by name (case insensitive)
function findCity(name) {
    return cityList.find(city => city.name.toLowerCase() === name.toLowerCase());
}

// Show suggestions dropdown
function showSuggestions(value) {
    suggestionsContainer.innerHTML = "";
    if (!value) return;
    const filteredCities = cityList
        .filter(city => city.name.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 7);
    filteredCities.forEach(city => {
        const div = document.createElement("div");
        div.textContent = city.name;
        div.classList.add("suggestion-item");
        div.addEventListener("click", () => {
            input.value = city.name;
            suggestionsContainer.innerHTML = "";
            fetchWeather(city);
        });
        suggestionsContainer.appendChild(div);
    });
}

// Reset weather display
function resetWeather() {
    locationElem.textContent = "";
    tempElem.textContent = "";
    descElem.textContent = "";
    weatherInfo.style.opacity = "0";
}

// Show weather info with a fade-in effect
function showWeather() {
    weatherInfo.style.opacity = "0";
    weatherInfo.style.display = "block";
    setTimeout(() => {
        weatherInfo.style.opacity = "1";
    }, 200);
}

// Fetch weather data from Open-Meteo API
async function fetchWeather(city) {
    resetWeather();
    tempElem.textContent = "Loading...";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data not found");
        const data = await response.json();

        locationElem.textContent = city.name;
        const temperatureC = data.current_weather.temperature;
        tempElem.textContent = `🌡️ ${temperatureC} °C`;

        const weatherCode = data.current_weather.weathercode;
        descElem.textContent = codeToDescription(weatherCode);
        showWeather();
    } catch (error) {
        tempElem.textContent = `Error: ${error.message}`;
    }
}

// Convert Open-Meteo weather codes to description text (simplified)
function codeToDescription(code) {
    const mapping = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };
    return mapping[code] || "Unknown weather";
}

// Event listeners for input and button
input.addEventListener("input", (e) => {
    showSuggestions(e.target.value);
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        const cityName = input.value.trim();
        suggestionsContainer.innerHTML = "";
        const city = findCity(cityName);
        if (city) {
            fetchWeather(city);
        } else {
            tempElem.textContent = "City not found in suggestions";
        }
    }
});

button.addEventListener("click", () => {
    const cityName = input.value.trim();
    suggestionsContainer.innerHTML = "";
    const city = findCity(cityName);
    if (city) {
        fetchWeather(city);
    } else {
        tempElem.textContent = "City not found in suggestions";
    }
});
