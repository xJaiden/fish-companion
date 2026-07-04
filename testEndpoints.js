require("dotenv").config();
const axios = require("axios");

const BASE = "https://api.openweathermap.org/data/4.0/onecall";

const endpoints = [
    "current",
    "timeline/1h",
    "timeline/1day"
];

(async () => {

    for (const endpoint of endpoints) {

        try {

            const res = await axios.get(`${BASE}/${endpoint}`, {
                params: {
                    lat: 37.231196,
                    lon: -80.611693,
                    units: "imperial",
                    appid: process.env.OPENWEATHER_API_KEY
                }
            });

            console.log(`\n===== ${endpoint.toUpperCase()} =====`);

            console.log(Object.keys(res.data));

            if (res.data.data) {
                console.log(
                    "First object keys:",
                    Object.keys(res.data.data[0])
                );
            }

        } catch (err) {

            console.log(`\n===== ${endpoint.toUpperCase()} FAILED =====`);

            console.log(err.response?.status);

            console.log(err.response?.data);

        }

    }

})();