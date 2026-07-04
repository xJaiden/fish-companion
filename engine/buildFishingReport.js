const { GlobalFishingScorer } = require("./scoring/globalFishingScorer");

// your existing modules
const { getLocationRecommendations } = require("./recommendations/locations");
const { getLureRecommendations } = require("./recommendations/lures");
const { getColorRecommendations } = require("./recommendations/colors");

function buildFishingReport(context) {
    const scorer = new GlobalFishingScorer();

    // -------------------
    // GET RAW RECOMMENDATIONS
    // -------------------
    const locationRecs = getLocationRecommendations(context);
    const lureRecs = getLureRecommendations(context);
    const colorRecs = getColorRecommendations(context);

    // -------------------
    // ADD TO GLOBAL SCORER
    // -------------------
    scorer.addBatch(locationRecs);
    scorer.addBatch(lureRecs);
    scorer.addBatch(colorRecs);

    // -------------------
    // OUTPUT FINAL REPORT
    // -------------------
    const ranked = scorer.getRanked();

    return {
        location: context.location,
        species: context.species,
        score: ranked[0]?.score ?? 0,

        topLocations: scorer.getByType("location").slice(0, 3),
        topLures: scorer.getByType("lure").slice(0, 3),
        topColors: scorer.getByType("color").slice(0, 3),

        fullRanked: ranked
    };
}

module.exports = { buildFishingReport };