const { generateFishingReport } = require('./services/fishingReport');

(async () => {

    const report = await generateFishingReport({

        latitude: 37.231196,
        longitude: -80.611693,

        species: "largemouth",

        waterbody: "pond",

        clarity: "clear",

        cover: "grass"

    });

    console.dir(report, {
        depth: null
    });

})();
