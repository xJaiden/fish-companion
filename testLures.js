const { getRecommendedLures } = require('./engine/recommendations/lures');

const result = getRecommendedLures({
    clarity: "muddy",
    waterbody: "pond",
    cover: "grass"
});

console.log(result);