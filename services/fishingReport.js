const { getWeather } = require("./weatherService");
const { getSolunarData } = require("./solunarService");
const { getRecommendedColors } = require("../engine/recommendations/colors");
const { getRecommendedLocations } = require("../engine/recommendations/locations");
const { getRecommendedLures } = require("../engine/recommendations/lures");
const { buildGlobalFishingScore } = require("../engine/scoring/globalFishingScorer");
const { buildFishingWindows } = require("../engine/windows");

async function generateFishingReport(options = {}) {
    const latitude = options.latitude ?? 37.231196;
    const longitude = options.longitude ?? -80.611693;
    const weather = await getWeather(latitude, longitude);
    const solunar = getSolunarData(latitude, longitude, new Date());

    const context = {
        latitude,
        longitude,
        species: options.species,
        waterbody: options.waterbody,
        clarity: options.clarity,
        cover: options.cover,

        weather,
        solunar
    };
    const windows = buildFishingWindows(context);
    const colors = getRecommendedColors(context);
    const lures = getRecommendedLures(context);
    const locations = getRecommendedLocations(context);
    const scoreObj = buildGlobalFishingScore(context);

    const score = scoreObj.score;
    console.log(score)


    let recommendation = "";

    if (score >= 80) {
        recommendation = "Excellent conditions. Fish aggressively around cover and shallow structure.";
    } else if (score >= 60) {
        recommendation = "Good conditions. Expect steady bite near structure and transitions.";
    } else if (score >= 40) {
        recommendation = "Fair conditions. Slow down and fish deeper or shaded areas.";
    } else {
        recommendation = "Tough conditions. Focus on finesse and low-light areas.";
    }

    return {
    location: { latitude, longitude },

    species: options.species,
    waterbody: options.waterbody,
    clarity: options.clarity,
    cover: options.cover,
    weather,
    solunar,
    windows,
    score,
    lures,
    colors,
    locations,
    recommendation,

    summary: `Fishing conditions for ${options.species || "fish"} at a ${options.waterbody || "waterbody"}.`
};
}

module.exports = { generateFishingReport };