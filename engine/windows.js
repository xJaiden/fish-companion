function formatHour(dt) {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

function scoreHour(hour, solunar) {
    let score = 50;

    const hourNum = new Date(hour.dt * 1000).getHours();

    // solunar boost
    if (solunar?.activityScore >= 80) score += 20;
    else if (solunar?.activityScore >= 60) score += 10;

    // prime fishing windows
    if (hourNum >= 5 && hourNum <= 9) score += 15;
    if (hourNum >= 17 && hourNum <= 20) score += 20;
    if (hourNum >= 22 || hourNum <= 2) score -= 10;

    // UV
    if ((hour.uvi ?? 0) <= 2) score += 5;
    if ((hour.uvi ?? 0) >= 8) score -= 5;

    // clouds
    if (hour.clouds >= 40 && hour.clouds <= 80) score += 5;

    return Math.max(0, Math.min(100, score));
}

function buildFishingWindows(context) {
    const hourly =
        context?.weather?.hourly ??
        context?.weather?.data ??   // 👈 IMPORTANT fallback for OneCall variants
        [];

    const solunar = context?.solunar;

    if (!Array.isArray(hourly)) return [];

    const windows = hourly.map(h => ({
        time: formatHour(h.dt),
        score: scoreHour(h, solunar)
    }));

    return windows
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(w => ({
            start: w.time,
            end: w.time,
            score: Math.round(w.score)
        }));
}

module.exports = {
    buildFishingWindows
};