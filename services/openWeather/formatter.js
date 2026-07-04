function hPaToInHg(hPa) {
    return Number((hPa * 0.02953).toFixed(2));
}

function degreesToDirection(deg) {
    const dirs = [
        "N","NNE","NE","ENE",
        "E","ESE","SE","SSE",
        "S","SSW","SW","WSW",
        "W","WNW","NW","NNW"
    ];
    return dirs[Math.round(deg / 22.5) % 16];
}

function unixToTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

function calculateDaylightRemaining(sunsetUnix) {
    const now = Date.now();
    const sunset = sunsetUnix * 1000;

    const diff = sunset - now;

    if (diff <= 0) return "0h 0m";

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    return `${hours}h ${minutes}m`;
}

function calculatePressureTrend(hourly) {
    if (!hourly || hourly.length < 2) return "Unknown";

    const now = hourly[0].pressure;
    const future = hourly[2]?.pressure ?? hourly[1].pressure;

    const diff = future - now;

    if (diff > 1) return "Rising";
    if (diff < -1) return "Falling";
    return "Stable";
}

function moonPhaseToName(phase) {
    // OpenWeather gives 0–1 value
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    return "Waning Crescent";
}

module.exports = {
    hPaToInHg,
    degreesToDirection,
    unixToTime,
    calculateDaylightRemaining,
    calculatePressureTrend,
    moonPhaseToName
};