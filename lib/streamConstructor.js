'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");

const containsAllElements = (target, arr) => {
    return target.every(v => arr.includes(v));
}

const loadTagComboClips = (options) => {
    let candidateShows = [];
    let candidateMovies = [];
    //Get all shows that fit all tags
    if (options.shows && options.movies) {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
        candidateMovies = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else if (options.shows) {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else if (options.movies) {
        candidateMovies = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
        candidateMovies = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    }
    return {
        shows: candidateShows,
        movies: candidateMovies,
    }
}

const loadTagClips = (options) => {
    let candidateShows = [];
    let candidateMovies = [];
    if (options.shows && options.movies) {
        options.tagsOR.forEach(tag => {
            candidateShows.push(...showList.filter(show => show.Tags.includes(tag)));
        });
        options.tagsOR.forEach(tag => {
            candidateMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
        });
    } else if (options.shows) {
        options.tagsOR.forEach(tag => {
            candidateShows.push(...showList.filter(show => show.Tags.includes(tag)));
        });
    } else if (options.movies) {
        options.tagsOR.forEach(tag => {
            candidateMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
        });
    } else {
        options.tagsOR.forEach(tag => {
            candidateShows.push(...showList.filter(show => show.Tags.includes(tag)));
        });
        options.tagsOR.forEach(tag => {
            candidateMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
        });
    }
    return {
        shows: candidateShows,
        movies: candidateMovies,
    }
}

exports.constructStream = (config, destinationDirectory, options) => {

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
    let progression = []; //List of progression objects that contain the last episode that was played per show
    let stream = [];

    //Create progression master json if it doesnt exist
    if (dirMan.directoryExists(destinationDirectory + "progression.json")) {
        let rawData = dirMan.readFile(destinationDirectory + "progression.json");
        progression = JSON.parse(rawData);
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
        blockList = blockEng.createCollectionBlocks(config, options.blocks, progression)
    }

    //TODO: Figure out block timing magic
    blockList.forEach(b => {
        progression.filter(pitem => pitem.Title = b.Title)[0]
            .Shows.forEach(sitem => sitem.Episode++);
        stream.push(...b.Items)
    });

    //Things with Explicit tags get selected first up to 75% of the duration at a start if there are that clips
    //to be selected
    if (options.tagsAND) {
        //Get all shows that fit all tags
        let clips = loadTagComboClips(options);
    }

    if (options.tagsOR) {
        let clips = loadTagClips(options);
    }

    let rightNow = moment().unix();

    if (options.streamDuration && (options.blocks || options.events)) {
        //TODO: check if assigned block times conflict with Stream Duration
    } else if(options.streamDuration) {

    } else {
        let firstBlockStartTime = moment(blockList[0].Time, "HHmm").unix();
        let firstBufferDuration = firstBlockStartTime - rightNow;
        bufferEng.streamBufferGenerator(firstBufferDuration, commercialList, promoList, fillerShowList, { /* TODO: */})
        blockList.forEach(b => {
            progression.filter(pitem => pitem.Title = b.Title)[0]
                .Shows.forEach(sitem => sitem.Episode++);
            stream.push(...b.Items)
        });
    }

    dirMan.createProgressionFile(destinationDirectory, progression);

    return stream;
}