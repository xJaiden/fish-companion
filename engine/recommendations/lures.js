function getRecommendedLures(context) {
    const clarity = context?.clarity || "clear";
    const cover = context?.cover || "none";
    const wind = context?.weather?.wind?.speed || 0;

    let lures = [];

    if (cover === "grass") {
        lures.push("Texas Rig", "Wacky Rig", "Frog");
    }

    if (cover === "wood") {
        lures.push("Jig", "Texas Rig", "Creature Bait");
    }

    if (clarity === "clear") {
        lures.push("Wacky Rig", "Ned Rig", "Drop Shot");
    }

    if (clarity === "muddy") {
        lures.push("Spinnerbait", "Chatterbait", "Squarebill Crankbait");
    }

    if (wind > 4) {
        lures.push("Spinnerbait", "Swim Jig");

    }

    return [...new Set(lures)];
}

module.exports = { getRecommendedLures };