function normalizeWeather(weather) {
    const current = weather.current;

    return {
        temp: current.temperature,
        feelsLike: current.feelsLike,
        humidity: current.humidity,

        pressure: weather.pressure?.current ?? current.pressure,
        pressureTrend: weather.pressure?.trend ?? "Stable",

        windSpeed: weather.wind?.speed ?? 0,
        windGust: weather.wind?.gust ?? 0,
        windDirection: weather.wind?.direction ?? "N",

        cloudCover: current.cloudCover ?? 0,
        uvIndex: current.uvIndex ?? 0,
        visibility: current.visibility ?? 10,

        condition: weather.conditions?.main ?? "Clear",
        precipitationChance: weather.precipitation?.chance ?? 0
    };
}

function normalizeSolunar(solunar) {
    return {
        moonPhase: solunar.moon.phase,
        illumination: solunar.moon.illumination,
        activityScore: solunar.activityScore,
        majorWindow: solunar.majorPeriod,
        minorWindow: solunar.minorPeriod
    };
}

function buildFishingSignals(weather, solunar, location) {
    const w = normalizeWeather(weather);
    const s = normalizeSolunar(solunar);

    return {
        weather: w,
        solunar: s,
        location,

        // precomputed shared signals
        isLowLight:
            w.cloudCover > 60 || w.uvIndex < 2,

        isWindy:
            w.windSpeed > 8,

        isStablePressure:
            w.pressureTrend === "Stable"
    };
}

module.exports = {
    normalizeWeather,
    normalizeSolunar,
    buildFishingSignals
};