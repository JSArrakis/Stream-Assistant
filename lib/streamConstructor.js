'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");
const _ = require('lodash');

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

    if (options.tagsAnd === undefined && options.tagsOR === undefined) {
        let tempTagList = [];
        blockList.forEach(block => tempTagList.push(block.Tags));
        let uniqueBlockTags = _.uniq(tempTagList);
        //TODO: Create different combos of block tags for tagsAND to give a more streamlined experience
        options.tagsOR = uniqueBlockTags;
    }

    //Things with AND tags get selected first up to 75% of the duration at a start if there are that many clips
    //to be selected
    if (options.tagsAND) {
        //Get all shows that fit all tags
        let clips = loadTagComboClips(options);
    }

    if (options.tagsOR) {
        let clips = loadTagClips(options);
        selectedMovies = clips.movies;
        selectedShows = clips.shows;
    }

    let rightNow = moment().unix();

    if (options.streamDuration && (options.blocks || options.events)) {
        //TODO: check if assigned block times conflict with Stream Duration
    } else if (options.streamDuration) {

    } else {
        /*TODO: 
            Todo count backwards from first start time and fill with shows and movies with their own
            buffers until you get to a point where the remainder buffer time before the first start time
            is less than the shortest time for a show or movie
        */
        let firstBlockStartTime = moment(blockList[0].Time, "HHmm").unix();
        let firstBufferDuration = firstBlockStartTime - rightNow;
        //TODO: Select the buffer clips correctly
        let firstBuffer = bufferEng
            .streamBufferGenerator(firstBufferDuration,
                commercialList,
                promoList,
                selectedShows,
                selectedMovies);
        let shuffledBuffer = bufferEng.bufferShuffle(
            firstBuffer.selectedCommercials,
            firstBuffer.selectedPromos,
            firstBuffer.selectedFillerShows);
        shuffledBuffer.forEach(clip => stream.push(clip.path));
        blockList.forEach(b => {
            progression.filter(pitem => pitem.Title = b.Title)[0]
                .Shows.forEach(sitem => sitem.Episode++);
            stream.push(...b.Items)
        });
    }

    dirMan.createProgressionFile(destinationDirectory, progression);

    return stream;
}