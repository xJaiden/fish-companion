function getRecommendedColors(context) {
    const clarity = context?.clarity || "clear";
    const cover = context?.cover || "none";
    const wind = context?.weather?.wind?.speed || 0;
    const cloud = context?.weather?.current?.cloudCover || 0;

    let colors = [];

    if (clarity === "clear") {
        colors.push("Natural Shad", "Green Pumpkin");
    }

    if (clarity === "stained") {
        colors.push("Watermelon Red", "Junebug");
    }

    if (clarity === "muddy") {
        colors.push("Black & Blue", "Chartreuse", "Firecraw");
    }

    if (cover === "grass") {
        colors.push("Green Pumpkin", "Watermelon Red");
    }

    if (cloud > 60) {
        colors.push("Darker profiles (Black/Blue)");
    }

    if (wind > 4) {
        colors.push("High contrast colors (White/Chartreuse)");
    }

    return [...new Set(colors)];
}

module.exports = { getRecommendedColors };