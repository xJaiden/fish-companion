const axios = require("axios");
require("dotenv").config();

async function getHourlyForecast(latitude, longitude) {
    return axios.get(
        "https://api.openweathermap.org/data/4.0/onecall/timeline/1h",
        {
            params: {
                lat: latitude,
                lon: longitude,
                units: "imperial",
                appid: process.env.OPENWEATHER_API_KEY
            },
            timeout: 10000
        }
    );
}

module.exports = {
    getHourlyForecast
};