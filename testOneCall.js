require("dotenv").config();

const axios = require("axios");

(async () => {
    try {
        const response = await axios.get(
            "https://api.openweathermap.org/data/4.0/onecall/current",
            {
                params: {
                    lat: 37.231196,
                    lon: -80.611693,
                    units: "imperial",
                    appid: process.env.OPENWEATHER_API_KEY
                }
            }
        );

        console.log(response.data);

    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data || err.message);
    }
})();