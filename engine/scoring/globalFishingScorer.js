function buildGlobalFishingScore(context) {
    const weather = context.weather?.current || {};
    const wind = context.weather?.wind?.speed || 0;
    const cloud = context.weather?.current?.cloudCover || 0;
    const pressure = context.weather?.pressure?.current || 30;
    const clarity = context.clarity || "clear";
    const cover = context.cover || "none";
    const solunarScore = context.solunar?.activityScore || 50;

    let score = 50;

    if (wind < 2) score += 5;
    else if (wind < 5) score += 2;
    else score -= 5;

    if (pressure >= 30 && pressure <= 30.3) score += 5;
    else if (pressure > 30.3) score -= 3;

    if (cloud >= 50 && cloud <= 90) score += 8;
    else if (cloud < 20) score -= 5;

    if (clarity === "stained") score += 5;
    if (clarity === "muddy") score += 10;
    if (clarity === "clear") score -= 3;

    if (cover === "grass" || cover === "wood") score += 8;
    if (cover === "rock") score += 5;

    score += (solunarScore - 50) * 0.6;

    score = Math.max(0, Math.min(100, score));

    return {
        score: Math.round(score * 10) / 10
    };
}

module.exports = { buildGlobalFishingScore };