function getMoonPhase(date = new Date()) {

    const synodicMonth = 29.53058867;

    const baseNewMoon = new Date("2000-01-06T18:14:00Z");

    const diff = date - baseNewMoon;

    const days = diff / (1000 * 60 * 60 * 24);

    const phase = (days % synodicMonth) / synodicMonth;

    return phase;
}

function getMoonIllumination(phase) {

    // 0 = new moon, 0.5 = full moon, 1 = new moon
    const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

    return illumination * 100;
}

function getSolunarData(latitude, longitude, date = new Date()) {

    const phase = getMoonPhase(date);
    const illumination = Math.round(getMoonIllumination(phase));

    const hour = date.getHours();

    let activity = 50;

    // Moon influence
    if (illumination >= 70) activity += 15;
    if (illumination <= 20) activity += 10;

    // Phase influence
    if (phase < 0.1) activity += 10;      // New moon
    if (phase > 0.4 && phase < 0.6) activity += 5; // Full moon

    // Time of day (solunar behavior approximation)
    if (hour >= 5 && hour <= 9) activity += 15;
    if (hour >= 17 && hour <= 20) activity += 20;
    if (hour >= 22 || hour <= 2) activity -= 10;

    activity = Math.max(0, Math.min(100, activity));

    return {
        moon: {
            phase: phase < 0.5 ? "Waxing" : "Waning",
            illumination
        },

        activityScore: activity,

        majorPeriod: {
            start: "6:00 AM",
            end: "9:00 AM"
        },

        minorPeriod: {
            start: "5:30 PM",
            end: "8:30 PM"
        }
    };
}

module.exports = {
    getSolunarData
};