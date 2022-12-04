'use strict';
const environs = require("../data/environments.json");
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");
const _ = require('lodash');


const loadTagCommercials = (tags, config) => {
    let commercials = [];
    if (tags.includes("christmas")) {
        commercials.push(...utilities.clipSelector(config.Commercials.christmas, "C"));
    }

    return commercials;
}

const loadTagShorts = (tags, config) => {
    let shorts = [];
    if (tags.includes("christmas")) {
        shorts.push(...utilities.clipSelector(config.Shorts.christmas, "S"));
    }

    return shorts;
}

const loadTagMusic = (tags, config) => {
    let music = [];
    if (tags.includes("christmas")) {
        music.push(...utilities.clipSelector(config.Music.christmas, "M"));
    }

    return music;
}

const proceduralMediaBlockConversion = (options,
    duration,
    shows,
    movies,
    commercials,
    promos,
    shorts,
    music,
    selectedCommercials,
    selectedMovies,
    selectedShorts,
    selectedMusic,
    defaultPromo,
    stagedProgression,
    masterProgression,
    initialTimePoint,
    previousTagEpisodes,
    previousMovies,
    injectedMovies) => {

    let blocks = [];
    let previousCommercials = selectedCommercials;
    let previousPromos = selectedMovies;
    let previousShorts = selectedShorts;
    let previousMusic = selectedMusic

    let blockItems = blockEng.createProceduralBlock(options,
        duration,
        shows,
        movies,
        stagedProgression,
        masterProgression,
        previousTagEpisodes,
        previousMovies,
        injectedMovies
    );

    let timepoint = initialTimePoint;

    blockItems.Items.forEach(item => {

        let createdBlock = {
            "Title": "Procedural",
            "Type": "Procedural",
            "MediaTitle": "",
            "Time": "None",
            "TimePoint": 0,
            "DurationLimit": 0,
            "Duration": 0,
            "Tags": [],
            "Items": [],
            "Programming": []
        }

        if (item.Type === "Movie") {

            createdBlock.MediaType = item.Type;
            createdBlock.DurationLimit = item.Movie.DurationLimit;
            createdBlock.Tags = item.Movie.Tags;
            createdBlock.MediaTitle = item.Movie.Title;
            createdBlock.Items.push(item.Movie.MoviePath);
            createdBlock.Duration = createdBlock.Duration + item.Movie.Duration;
            createdBlock.TimePoint = timepoint;

            let bufferDuration = item.Movie.DurationLimit - item.Movie.Duration;
            let buffer = bufferEng.createProceduralBlockBuffer(bufferDuration,
                commercials,
                promos,
                shorts,
                music,
                previousCommercials,
                previousPromos,
                previousShorts,
                previousMusic,
                defaultPromo
            );

            createdBlock.Items.push(...buffer.Items);
            createdBlock.Duration = createdBlock.Duration + buffer.Duration;
            createdBlock.Programming.push({
                mediaName: item.Movie.Title,
                mediaStartTime: timepoint
            })

            previousCommercials = buffer.selectedCommercials;
            previousPromos = buffer.selectedPromos;
            previousShorts = buffer.selectedShorts;
            previousMusic = buffer.selectedMusic;

            timepoint = timepoint + createdBlock.DurationLimit;

            blocks.push(createdBlock);

        } else {
            createdBlock.MediaType = item.Type;
            createdBlock.DurationLimit = item.Show.DurationLimit * item.Episodes.length;
            createdBlock.Tags = item.Show.Tags;
            createdBlock.MediaTitle = item.Show.Title;
            createdBlock.TimePoint = timepoint;
            item.Episodes.forEach(episode => {
                createdBlock.Items.push(episode.EpisodePath);
                createdBlock.Duration = createdBlock.Duration + episode.Duration;
                let bufferDuration = item.Show.DurationLimit - episode.Duration;
                if (bufferDuration < 0) {
                    bufferDuration = createdBlock.DurationLimit - episode.Duration;
                }
                let buffer = bufferEng.createProceduralBlockBuffer(bufferDuration,
                    commercials,
                    promos,
                    shorts,
                    music,
                    previousCommercials,
                    previousPromos,
                    previousShorts,
                    previousMusic,
                    defaultPromo
                );

                createdBlock.Items.push(...buffer.Items);
                createdBlock.Duration = createdBlock.Duration + buffer.Duration;
                createdBlock.Programming.push({
                    mediaName: item.Show.Title,
                    mediaStartTime: timepoint
                })

                previousCommercials = buffer.selectedCommercials;
                previousPromos = buffer.selectedPromos;
                previousShorts = buffer.selectedShorts;
                previousMusic = buffer.selectedMusic;

                timepoint = timepoint + createdBlock.DurationLimit;

                blocks.push(createdBlock);
            });

        }

    });

    return blocks;
}

const getEnvironment = (options, environs) => {
    let pick;

    if (options.env) {

        let envNum = parseInt(options.env);

        if (environs.filter(e => e.Environment === envNum) < 1) {
            throw "Environment " + options.env + " does not exist. Check Documentation."
        }

        pick = environs.filter(e => e.Environment === envNum)[0];

    } else {

        pick = environs.filter(e => e.Environment === 1)[0];

    }

    return pick

}

const loadDefaultPromos = (environment, tags) => {

    let promos = [];

    if (tags.includes("christmas")) {
        promos.push(...utilities.clipSelector(environment.ChristmasPromoPath, "P"))
    }

    if (promos < 1) {
        promos.push(...utilities.clipSelector(environment.PromoPath, "P"))
    }

    let sortedPromos = _.sortBy(promos, p => p.duration);
    let defaultPromo = sortedPromos[0];
    return {
        promos: promos,
        defaultPromo: defaultPromo,
    }

}

exports.constructStream = (config, destinationDirectory, options) => {

    let environment = getEnvironment(options, environs);
    let stream = [];
    let programming = [];
    let stagedStream = [];
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their 
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream
    let selectedShows = []; //List of shows selected based on direct selections or tags
    let selectedMovies = []; //List of movies selected based on direct selections or tags
    let commercials = []; //List of all commercials selected for the stream (this is agnostic to any commercials
    //in any selected block)
    let promos = [];
    let shorts = [];
    let music = [];
    let previousMovies = [];
    let previousTagEpisodes = [];
    let previousCommercials = [];
    let previousPromos = [];
    let previousShorts = [];
    let previousMusic = [];
    let injectedMovies = []
    //TODO: shows surrounding movies should share tags v3
    //TODO: Have commercials surrounding a movie or show themed appropriately v2
    let stagedProgression = []; //List of progression objects that contain the last episode that was played per show
    let masterProgression = []
    let proceduralEndTime = 0;
    //TODO: Make a 10-15 second JSArrakis promo
    let environmentPromos = loadDefaultPromos(environment, options.tagsOR);
    let defaultPromo = environmentPromos.defaultPromo;
    promos.push(...environmentPromos.promos);

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

    if (options.movies && options.movies.length > 0) {
        options.movies.forEach(mt => {
            let movie = movieList.filter(item => item.LoadTitle === mt);
            if (movie.length > 0) {
                injectedMovies.push(movie[0]);
            } else {
                throw mt + " does not exist as a load title. Check Documentation";
            }
        });
    }

    if (!options.noCommercials) {
        //TODO: v2 Make this smarter : 
        //check if tag commercials conglomerate duration can cover 15 % of the total duration of the stream
        //if not add additional commercials
        commercials = utilities.clipSelector(config.Commercials.nineties, "C");
        commercials.push(...utilities.clipSelector(config.Commercials.aughts, "C"));
        commercials.push(...loadTagCommercials(options.tagsOR, config, "C"));
    }

    shorts.push(...loadTagShorts(options.tagsOR, config, "S"));
    music.push(...loadTagMusic(options.tagsOR, config, "M"));


    //Check if any collection blocks were requested
    //TODO: handle conflicting time points where a block might overlap another depending on duration of the block v1.1
    if (options.blocks) {
        let createdBlocks = blockEng.createCollectionBlocks(options, stagedProgression, masterProgression, promos, defaultPromo);
        blockList.push(...createdBlocks.collectionBlocks);
        proceduralEndTime = moment(blockList[blockList.length - 1].Time, "HHmm").unix();
        previousCommercials = createdBlocks.selectedCommercials;
        previousPromos = createdBlocks.selectedPromos;
        previousShorts = createdBlocks.selectedShorts;
        previousMusic = createdBlocks.selectedMusic;
    }

    if (options.endTime) {
        let setEndTime = parseInt(options.endTime);
        if (setEndTime > proceduralEndTime) {
            proceduralEndTime = setEndTime;
        }
    }

    if (options.tagsAND === undefined
        && options.tagsOR === undefined
        && options.blocks !== undefined) {
        let tempTagList = [];
        blockList.forEach(block => tempTagList.push(...block.Tags));
        let uniqueBlockTags = _.uniq(tempTagList);
        //TODO: Create different combos of block tags for tagsAND to give a more streamlined experience v2
        options.tagsOR = uniqueBlockTags;
    }


    //TODO: Show and movie selection that have times from commandline has to happen here to create first time point v1.1

    let sortedBlockList = _.sortBy(blockList, block => block.TimePoint);
    let rightNow = moment().unix();

    let firstTimePoint = proceduralEndTime;

    if (blockList.length > 0) {
        firstTimePoint = moment(sortedBlockList[0].Time, "HHmm").unix();
    }
    //TODO: Event blocks v1.2

    let initialBufferDuration = firstTimePoint - rightNow;
    if (initialBufferDuration < 0) {
        throw "Time of first block, event or end time of stream needs to be in the future";
    }

    let interval = 1800;
    let preShowDuration = 0;
    let initialProceduralBlockDuration = 0;
    if (initialBufferDuration / interval >= 1) {
        preShowDuration = initialBufferDuration % interval;
        initialProceduralBlockDuration = initialBufferDuration - preShowDuration;
    } else {
        preShowDuration = initialBufferDuration;
    }

    let firstBlockStartTime = rightNow + preShowDuration;

    console.log("Total Time In Seconds: ", proceduralEndTime - rightNow);

    let initialBuffer = bufferEng.createProceduralBlockBuffer(preShowDuration,
        commercials,
        promos,
        shorts,
        music,
        previousCommercials,
        previousPromos,
        previousShorts,
        previousMusic,
        defaultPromo
    )
    stream.push(...initialBuffer.Items);
    previousCommercials = initialBuffer.selectedCommercials;
    previousPromos = initialBuffer.selectedPromos;
    previousShorts = initialBuffer.selectedShorts;
    previousMusic = initialBuffer.selectedMusic;

    console.log("First Media Start Time: ", rightNow + initialBuffer.Duration);

    if (initialProceduralBlockDuration > 0) {
        let constructedBlocks = proceduralMediaBlockConversion(options,
            initialProceduralBlockDuration,
            showList,
            movieList,
            commercials,
            promos,
            shorts,
            music,
            previousCommercials,
            previousPromos,
            previousShorts,
            previousMusic,
            defaultPromo,
            stagedProgression,
            masterProgression,
            firstBlockStartTime,
            previousTagEpisodes,
            previousMovies,
            injectedMovies
        )
        stagedStream.push(...constructedBlocks);
    }

    sortedBlockList.forEach(block => {
        stagedStream.push(block);
        //TODO: create procedural buffer between timepoints v1.1
    });

    stagedStream.forEach(item => {
        stream.push(...item.Items);
        programming.push(...item.Programming);
    });

    // console.log(stagedStream);
    console.log(programming);
    dirMan.createScheduleFile(destinationDirectory, programming);

    if (options.progression) {

        stagedProgression.forEach(block => {
            masterProgression.filter(pitem => pitem.Title === block.Title)[0].Shows = block.Shows;
        });

    } else {

        let collectionBlocks = stagedProgression.filter(pitem => pitem.Type === "Collection");
        collectionBlocks.forEach(block => {
            masterProgression.filter(pitem => pitem.Title === block.Title)[0].Shows = block.Shows;
        });

    }

    dirMan.createProgressionFile(destinationDirectory, masterProgression);

    return stream;
}