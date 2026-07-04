function getRecommendedLocations(context) {
    const cover = context?.cover || "none";
    const waterbody = context?.waterbody || "pond";
    const wind = context?.weather?.wind?.speed || 0;
    const clarity = context?.clarity || "clear";

    let spots = [];

    if (cover === "grass") {
        spots.push("Grass edges", "Weedlines", "Inside grass pockets");
    }

    if (cover === "wood") {
        spots.push("Laydowns", "Shaded timber", "Stumps");
    }

    if (waterbody === "pond") {
        spots.push("Docks", "Shallow flats", "Drop-offs");
    }

    if (wind > 4) {
        spots.push("Wind-blown banks", "Choppy shorelines");
    }

    if (clarity === "muddy") {
        spots.push("Shallow warm water zones");
    }

    return [...new Set(spots)];
}

module.exports = { getRecommendedLocations };