function scoreHour(hour, context) {

    let score = 50; // baseline

    // -------------------------
    // TEMP (bass sweet spot)
    // -------------------------
    if (hour.temp >= 68 && hour.temp <= 85) score += 10;
    if (hour.temp > 90) score -= 15;

    // -------------------------
    // WIND (important for bass)
    // -------------------------
    if (hour.wind_speed >= 1 && hour.wind_speed <= 8) score += 10;
    if (hour.wind_speed > 12) score -= 10;

    // -------------------------
    // CLOUD COVER
    // -------------------------
    if (hour.clouds >= 40 && hour.clouds <= 90) score += 8;
    if (hour.clouds < 10) score -= 8;

    // -------------------------
    // RAIN (light rain = good)
    // -------------------------
    if (hour.pop >= 0.2 && hour.pop <= 0.6) score += 8;
    if (hour.pop > 0.7) score -= 10;

    // -------------------------
    // SOLUNAR BOOST
    // -------------------------
    score += (context.solunar.activityScore - 50) * 0.6;

    // -------------------------
    // TIME OF DAY BONUS
    // -------------------------
    const hourOfDay = new Date(hour.dt * 1000).getHours();

    // dawn / dusk peak feeding
    if ((hourOfDay >= 5 && hourOfDay <= 9) ||
        (hourOfDay >= 17 && hourOfDay <= 20)) {
        score += 12;
    }

    // midday slump
    if (hourOfDay >= 11 && hourOfDay <= 15) {
        score -= 5;
    }

    // clamp
    return Math.max(0, Math.min(100, score));
}

function buildFishingWindows(weather, context) {

    const hourly = weather.hourly;

    const scored = hourly.map(h => ({
        start: h.dt,
        score: scoreHour(h, context)
    }));

    const windows = [];
    let current = null;

    for (let i = 0; i < scored.length; i++) {

        const h = scored[i];

        if (h.score >= 70) {

            if (!current) {
                current = {
                    start: h.start,
                    end: h.start,
                    scores: [h.score]
                };
            } else {
                current.end = h.start;
                current.scores.push(h.score);
            }

        } else {
            if (current) {
                windows.push(current);
                current = null;
            }
        }
    }

    if (current) windows.push(current);

    return windows.map(w => {

        const avg =
            w.scores.reduce((a, b) => a + b, 0) / w.scores.length;

        return {
            start: new Date(w.start * 1000).toLocaleTimeString(),
            end: new Date(w.end * 1000).toLocaleTimeString(),
            score: Math.round(avg)
        };
    });
}

module.exports = {
    buildFishingWindows
};