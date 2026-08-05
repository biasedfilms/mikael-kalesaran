// ========================================
// PROJECT XANDRO
// WEATHER MODULE
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const weatherIcon = document.getElementById("weather-icon");

const weatherTemp = document.getElementById("weather-temp");

const weatherCity = document.getElementById("weather-city");


// ========================================
// STATE
// ========================================

let userLatitude = null;

let userLongitude = null;

const defaultWeather = {

    icon: "☀",

    temperature: "--°",

    city: "Loading..."

};


// ========================================
// STORAGE
// ========================================

function loadCachedWeather() {

    const cached = load("weather", defaultWeather);

    weatherIcon.textContent = cached.icon;

    weatherTemp.textContent = cached.temperature;

    weatherCity.textContent = cached.city;

}


function saveWeather() {

    save("weather", {

        icon: weatherIcon.textContent,

        temperature: weatherTemp.textContent,

        city: weatherCity.textContent

    });

}


// ========================================
// LOCATION
// ========================================

function getLocation() {

    if (!navigator.geolocation) {

        useFallbackLocation();

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            userLatitude = position.coords.latitude;

            userLongitude = position.coords.longitude;

            fetchWeather();

        },

        () => {

            useFallbackLocation();

        }

    );

}


function useFallbackLocation() {

    userLatitude = 1.4748;

    userLongitude = 124.8421;

    fetchWeather();

}


// ========================================
// WEATHER API
// ========================================

async function fetchWeather() {

    if (!CONFIG.OPENWEATHER_API_KEY) {

        console.error("OpenWeather API key is missing.");

        return;

    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&units=metric&appid=${CONFIG.OPENWEATHER_API_KEY}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log("Weather:", data);

        if (data.cod && Number(data.cod) !== 200) {

            console.error(data.message);

            return;

        }

        weatherTemp.textContent =
            `${Math.round(data.main.temp)}°`;

        weatherCity.textContent =
            data.name;

        weatherIcon.textContent =
            getWeatherIcon(data.weather[0].icon);

        saveWeather();

    }

    catch (error) {

        console.error("Weather fetch failed:", error);

        weatherIcon.textContent = "⚠";

        weatherTemp.textContent = "--°";

        weatherCity.textContent = "Offline";

    }

}


// ========================================
// ICONS
// ========================================

function getWeatherIcon(iconCode) {

    const icons = {

        "01d": "☀",
        "01n": "🌙",

        "02d": "🌤",
        "02n": "🌤",

        "03d": "☁",
        "03n": "☁",

        "04d": "☁",
        "04n": "☁",

        "09d": "🌧",
        "09n": "🌧",

        "10d": "🌦",
        "10n": "🌧",

        "11d": "⛈",
        "11n": "⛈",

        "13d": "❄",
        "13n": "❄",

        "50d": "🌫",
        "50n": "🌫"

    };

    return icons[iconCode] || "☁";

}


// ========================================
// INIT
// ========================================

function initWeather() {

    loadCachedWeather();

    getLocation();

}