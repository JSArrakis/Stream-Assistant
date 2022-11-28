'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");
const _ = require('lodash');

exports.constructStream = (config, destinationDirectory, options) => {

    let stream = [];
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their 
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream
    let selectedShows = []; //List of shows selected based on direct selections or tags
    let selectedMovies = []; //List of movies selected based on direct selections or tags
    let commercialList = []; //List of all commercials selected for the stream (this is agnostic to any commercials
    //in any selected block)
    let promoList = [];
    let fillerShowList = [];
    //TODO: Make commercials selectable by tags
    //TODO: Have commercials surrounding a movie or show themed appropriately
    let stagedProgression = []; //List of progression objects that contain the last episode that was played per show
    let masterProgression = []
    let proceduralEndTime = 0;
    //TODO: Make a 10-15 second JSArrakis promo
    let defaultPromo = {
        "path": "C:\\Users\\Main\\Desktop\\Bumpers\\Toonami\\15\\Default.mp4",
        "duration": 15
    };

    if (options.env) {
        defaultPromo = options.env.DefaultPromo;
    }


    if (options.blocks === undefined
        && options.events === undefined
        && options.adHocEvents === undefined
        && options.streamDuration === undefined) {
        proceduralEndTime = moment().startOf('day').add(1, "days").unix();
    }

    //Populate progression if progression file exists
    if (dirMan.directoryExists(destinationDirectory + "progression.json")) {
        let rawData = dirMan.readFile(destinationDirectory + "progression.json");
        stagedProgression = JSON.parse(rawData);
        masterProgression = JSON.parse(rawData);
    }
    //TODO: Set load of all commercials that are appropriate for the stream. In the interim load all commercials 
    //available. Set for v1.1
    if (!options.noCommercials) {
        commercialList = utilities.clipSelector(config.Commercials.nineties, "C");
        commercialList.push(...utilities.clipSelector(config.Commercials.aughts, "C"));
    }

    //Check if any collection blocks were requested
    //TODO: handle conflicting time points where a block might overlap another depending on duration of the block
    if (options.blocks) {
        blockList = blockEng.createCollectionBlocks(options, stagedProgression, masterProgression)
        proceduralEndTime = moment(blockList[0].Time, "HHmm").unix();
    }

    if (options.tagsAnd === undefined
        && options.tagsOR === undefined
        && options.blocks !== undefined) {
        let tempTagList = [];
        blockList.forEach(block => tempTagList.push(block.Tags));
        let uniqueBlockTags = _.uniq(tempTagList);
        //TODO: Create different combos of block tags for tagsAND to give a more streamlined experience
        options.tagsOR = uniqueBlockTags;
    }

    let rightNow = moment().unix();

    let streamDuration = proceduralEndTime - rightNow;
    if (streamDuration < 0) {
        throw "Start time of event or end time of duration needs to be in the future";
    }

    let interval = 1800;
    let preShowDuration = 0;
    let proceduralStreamDuration = 0;
    if (streamDuration / interval >= 1) {
        preShowDuration = streamDuration % interval;
        proceduralStreamDuration = streamDuration - preShowDuration;
    } else {
        preShowDuration = streamDuration;
    }

    let initialBuffer = bufferEng
        .streamBufferGenerator(
            preShowDuration,
            commercialList,
            promoList,
            [],
            [],
            defaultPromo
        );

    let shuffledBuffer = bufferEng
        .bufferShuffle(
            initialBuffer.selectedCommercials,
            initialBuffer.selectedPromos,
            initialBuffer.selectedShorts,
            initialBuffer.selectedMusic,
            defaultPromo
        );

    console.log(shuffledBuffer);

    shuffledBuffer.forEach(clip => stream.push(clip.path));

    // blockList.forEach(b => {
    //     stream.push(...b.Items)
    //     if (b.Type === "Procedural") {
    //         if (options.progression) {
    //             let shows = stagedProgression.filter(pitem => pitem.Title === b.Title)[0].Shows;
    //             masterProgression.filter(pitem => pitem.Title === b.Title)[0].Shows = shows;
    //         }
    //     } else {
    //         let shows = stagedProgression.filter(pitem => pitem.Title === b.Title)[0].Shows;
    //         masterProgression.filter(pitem => pitem.Title === b.Title)[0].Shows = shows;
    //     }
    // });

    // dirMan.createProgressionFile(destinationDirectory, masterProgression);

    return stream;
}