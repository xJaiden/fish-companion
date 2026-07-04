const {
    getCurrentWeather
} = require("./openWeather/current");

const {
    getHourlyForecast
} = require("./openWeather/hourly");

const {
    getDailyForecast
} = require("./openWeather/daily");

const {
    hPaToInHg,
    degreesToDirection,
    unixToTime,
    calculatePressureTrend,
    calculateDaylightRemaining,
    moonPhaseToName
} = require("./openWeather/formatter");

async function getWeather(latitude, longitude) {

    // Download everything in parallel
    const [currentRes, hourlyRes, dailyRes] =
        await Promise.all([
            getCurrentWeather(latitude, longitude),
            getHourlyForecast(latitude, longitude),
            getDailyForecast(latitude, longitude)
        ]);

    const current = currentRes.data.data[0];
    const hourly = hourlyRes.data.data;
    const daily = dailyRes.data.data;

    return {

        current: {

            temperature: current.temp,

            feelsLike: current.feels_like,

            humidity: current.humidity,

            dewPoint: current.dew_point,

            visibility:
                Number((current.visibility / 1609.34).toFixed(1)),

            uvIndex: current.uvi,

            cloudCover: current.clouds

        },

        pressure: {

            current:
                hPaToInHg(current.pressure),

            trend:
                calculatePressureTrend(hourly)

        },

        wind: {

            speed:
                current.wind_speed,

            gust:
                current.wind_gust ?? current.wind_speed,

            direction:
                degreesToDirection(current.wind_deg)

        },

        sun: {

            sunrise:
                unixToTime(current.sunrise),

            sunset:
                unixToTime(current.sunset),

            daylightRemaining:
                calculateDaylightRemaining(current.sunset)

        },

        moon: {

            phase:
                moonPhaseToName(daily[0].moon_phase),

            moonrise:
                unixToTime(daily[0].moonrise),

            moonset:
                unixToTime(daily[0].moonset)

        },

        conditions: {

            main:
                current.weather[0].main,

            description:
                current.weather[0].description

        },

        precipitation: {

            chance:
                hourly[0].pop,

            rain:
                daily[0].rain ?? 0

        },

        hourly,

        daily

    };

}

module.exports = {
    getWeather
};