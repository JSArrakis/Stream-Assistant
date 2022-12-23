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
const { getVideoDurationInSeconds } = require('get-video-duration')

const areOverlapping = (A, B) => {
    if (B.start < A.start) {
        return B.finish > A.start;
    }
    else {
        return B.start < A.finish;
    }
}

const checkForConflictingTimePoints = (blocks) => {
    blocks.forEach(blockOne => {
        let firstBlock = {
            start: blockOne.TimePoint,
            finish: blockOne.TimePoint + blockOne.DurationLimit
        }
        let otherBlocks = blocks.filter(block => block.Title !== blockOne.Title);
        otherBlocks.forEach(blockTwo => {
            let secondBlock = {
                start: blockTwo.TimePoint,
                finish: blockTwo.TimePoint + blockTwo.DurationLimit
            }
            if (areOverlapping(firstBlock, secondBlock)) {
                throw "Collections " + blockOne.Title + " and " + blockTwo.Title + " were set with conflicting start times for their respective durations."
            }
        });
    });

}

const loadTagCommercials = (tags, config) => {
    let commercials = [];
    if (tags && tags.includes("christmas")) {
        commercials.push(...utilities.clipSelector(config.Commercials.christmas, "C"));
    }

    return commercials;
}

const loadTagShorts = (tags, config) => {
    let shorts = [];
    if (tags && tags.includes("christmas")) {
        shorts.push(...utilities.clipSelector(config.Shorts.christmas, "S"));
    }

    return shorts;
}

const loadTagMusic = (tags, config) => {
    let music = [];
    if (tags && tags.includes("christmas")) {
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
        injectedMovies,
        initialTimePoint
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
                mediaStartTime: timepoint,
                createdBy: "Procedural Block"
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
            let iterator = 0;

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
                    mediaStartTime: timepoint,
                    createdBy: "Procedural Block"
                })

                previousCommercials = buffer.selectedCommercials;
                previousPromos = buffer.selectedPromos;
                previousShorts = buffer.selectedShorts;
                previousMusic = buffer.selectedMusic;

                timepoint = timepoint + item.Show.DurationLimit;
            });
            blocks.push(createdBlock);
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

    if (tags && tags.includes("christmas")) {
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

exports.constructStream = async (config, destinationDirectory, options) => {

    await getVideoDurationInSeconds("C:\\Users\\Main\\Desktop\\Commercials\\ChristmasCommercials\\73\\Coca-Cola Classic Christmas 90's TVC-(480p).mp4").then((duration) => {
        console.log(Math.round(duration))
    });

    let environment = getEnvironment(options, environs);
    let stream = [];
    let programming = [];
    let stagedStream = [];
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their 
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream
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
    //TODO: v1.4 Shows surrounding movies should share tags if possible
    //TODO: v1.4 Have commercials surrounding a movie or show themed appropriately
    let stagedProgression = []; //List of progression objects that contain the last episode that was played per show
    let masterProgression = []
    let proceduralEndTime = 0;
    //TODO: vX Make a 10-15 second JSArrakis promo
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
            if (!mt.includes("::")) {
                let movie = movieList.filter(item => item.LoadTitle === mt);
                if (movie.length > 0) {
                    injectedMovies.push(movie[0]);
                } else {
                    throw mt + " does not exist as a load title. Check Documentation";
                }
            }
        });
    }

    if (!options.noCommercials) {
        //TODO: v1.3 Make this smarter : 
        //check if tag commercials conglomerate duration can cover 15 % of the total duration of the stream
        //if not add additional commercials
        commercials = utilities.clipSelector(config.Commercials.nineties, "C");
        commercials.push(...utilities.clipSelector(config.Commercials.aughts, "C"));
        commercials.push(...loadTagCommercials(options.tagsOR, config, "C"));
    }

    shorts.push(...loadTagShorts(options.tagsOR, config, "S"));
    music.push(...loadTagMusic(options.tagsOR, config, "M"));

    if (options.movies) {
        let createdBlocks = blockEng.createScheduledMovieBlocks(options, movieList, commercials, promos, shorts, music, defaultPromo);
        blockList.push(...createdBlocks.movieBlocks);
        previousCommercials = createdBlocks.selectedCommercials;
        previousPromos = createdBlocks.selectedPromos;
        previousShorts = createdBlocks.selectedShorts;
        previousMusic = createdBlocks.selectedMusic;
    }

    //Check if any collection blocks were requested
    if (options.blocks) {
        let createdBlocks = blockEng.createCollectionBlocks(options, stagedProgression, masterProgression, promos, defaultPromo);
        blockList.push(...createdBlocks.collectionBlocks);
        previousCommercials = createdBlocks.selectedCommercials;
        previousPromos = createdBlocks.selectedPromos;
        previousShorts = createdBlocks.selectedShorts;
        previousMusic = createdBlocks.selectedMusic;
    }

    if (options.tagsAND === undefined
        && options.tagsOR === undefined
        && options.blocks !== undefined) {
        let tempTagList = [];
        blockList.forEach(block => tempTagList.push(...block.Tags));
        let uniqueBlockTags = _.uniq(tempTagList);
        //TODO: v1.2 Create different combos of block tags for tagsAND to give a more streamlined experience
        options.tagsOR = uniqueBlockTags;
    }

    let sortedBlockList = [];
    if (blockList.length > 0) {
        sortedBlockList = _.sortBy(blockList, block => block.TimePoint);
        proceduralEndTime = sortedBlockList[blockList.length - 1].TimePoint;
        if (options.endTime) {
            let setEndTime = parseInt(options.endTime);
            if (setEndTime > proceduralEndTime) {
                proceduralEndTime = setEndTime;
            }
        }

    } else if (options.endTime) {
        proceduralEndTime = parseInt(options.endTime);
    }

    checkForConflictingTimePoints(sortedBlockList);

    let rightNow = moment().unix();

    let firstTimePoint = proceduralEndTime;

    if (blockList.length > 0) {
        firstTimePoint = sortedBlockList[0].TimePoint;
    }
    //TODO: v1.2 Event blocks

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

    //PRESHOW INITIAL BUFFER
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

    //PRESHOW
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

    let blockIterator = 0
    sortedBlockList.forEach(block => {

        stagedStream.push(block);

        let duration = 0;
        if (blockIterator + 1 <= sortedBlockList.length - 1) {
            duration = sortedBlockList[blockIterator + 1].TimePoint - (block.TimePoint + block.Duration);
        } else {

            duration = proceduralEndTime - (block.TimePoint + block.Duration);
        }

        if (duration > 0) {
            let constructedBlocks = proceduralMediaBlockConversion(options,
                duration,
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
                block.TimePoint + block.Duration,
                previousTagEpisodes,
                previousMovies,
                injectedMovies
            )
            stagedStream.push(...constructedBlocks);
        }
        blockIterator++;
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