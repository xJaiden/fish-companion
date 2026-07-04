const { getWeather } = require("./weatherService");
const { getSolunarData } = require("./solunarService");

async function getEnvironment(latitude, longitude) {

    // Get both services at the same time
    const [weather, solunar] = await Promise.all([
        getWeather(latitude, longitude),
        Promise.resolve(
            getSolunarData(latitude, longitude)
        )
    ]);

    return {
        weather,
        solunar
    };
}

module.exports = {
    getEnvironment
};