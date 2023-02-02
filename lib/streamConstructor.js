'use strict';
const environs = require("../data/environments.json");
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const shortList = require("../data/shortList.json");
const commercialList = require("../data/commercialList.json");
const musicList = require("../data/musicList.json");
const collectionList = require("../data/collectionList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");
const _ = require('lodash');

const parseBlocks = (blocks) => {
    let parsedBlocks = [];
    blocks.forEach(item => {
        let splitItem = item.split("::");
        parsedBlocks.push({
            "Title": splitItem[0],
            "Time": parseInt(splitItem[1]),
        })
    });
    return parsedBlocks;
}

const areOverlapping = (A, B) => {
    if (B.start < A.start) {
        return B.finish > A.start;
    }
    else {
        return B.start < A.finish;
    }
}

const checkForConflictingTimePoints = (items) => {
    items.forEach(itemOne => {
        let firstItem = {
            start: itemOne.Time,
            finish: itemOne.Time + itemOne.DurationLimit
        }
        let otherItems = items.filter(otherItem => otherItem.Title !== itemOne.Title);
        otherItems.forEach(itemTwo => {
            let secondItem = {
                start: itemTwo.TimePoint,
                finish: itemTwo.TimePoint + itemTwo.DurationLimit
            }
            if (areOverlapping(firstItem, secondItem)) {
                throw "Items " + itemOne.Title + " and " + itemTwo.Title + " were set with conflicting start times for their respective durations."
            }
        });
    });

}

const checkForConflictingTimePoints2 = (blocks) => {
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
                throw "Items " + blockOne.Title + " and " + blockTwo.Title + " were set with conflicting start times for their respective durations."
            }
        });
    });

}

const loadHolidayCommercials = (tags) => {
    let commercials = [];
    if (tags && tags.includes("christmas")) {
        commercials.push(...commercialList.filter(comm => comm.tags.includes("christmas")));
    }

    if (tags && tags.includes("halloween")) {
        commercials.push(...commercialList.filter(comm => comm.tags.includes("halloween")));
    }

    return commercials;
}

const loadHolidayShorts = (tags) => {
    let shorts = [];
    if (tags && tags.includes("christmas")) {
        shorts.push(...shortList.filter(short => short.tags.includes("christmas")));
    }

    if (tags && tags.includes("halloween")) {
        shorts.push(...shortList.filter(short => short.tags.includes("halloween")));
    }

    return shorts;
}

const loadHolidayMusic = (tags, config) => {
    let music = [];
    if (tags && tags.includes("christmas")) {
        music.push(...musicList.filter(music => music.tags.includes("christmas")));
    }

    if (tags && tags.includes("halloween")) {
        music.push(...musicList.filter(music => music.tags.includes("halloween")));
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
    injectedMovies,
    tags) => {

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

        let mediaBTags = [];

        let itemIndex = blockItems.Items.indexOf(item);

        if (itemIndex < blockItems.Items.length - 1) {
            let nextMedia = blockItems.Items[itemIndex + 1];
            if (nextMedia.Type === "Movie") {
                mediaBTags = nextMedia.Movie.Tags;
            } else {
                mediaBTags = nextMedia.Show.Tags;
            }
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
                defaultPromo,
                tags,
                item.Movie.Tags,
                mediaBTags
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
                    defaultPromo,
                    tags,
                    item.Show.Tags,
                    mediaBTags
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
    if (options.env) {
        let envNum = parseInt(options.env);

        if (environs.filter(e => e.Environment === envNum) < 1) {
            throw "Environment " + options.env + " does not exist. Check Documentation."
        }

        return environs.filter(e => e.Environment === envNum)[0];
    } else {

        return environs.filter(e => e.Environment === 1)[0];
    }
}

const loadEnvironmentPromos = (environment, tags) => {

    let promos = [];

    if (tags && tags.includes("christmas")) {
        promos.push(...utilities.clipSelector(environment.ChristmasPromoPath, "P"))
    }

    if (tags && tags.includes("halloween")) {
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

const getMedia = (mediaTitle, time, mediaList, type) => {
    let media = mediaList.filter(item => item.LoadTitle === mediaTitle);
    if (media.length > 0) {
        return {
            "Media": media[0],
            "Time": time,
            "Type": type
        }
    } else {
        throw mediaTitle + " does not exist as a load title. Check Documentation";
    }
}
/**
 * 
 * @param {Array} options Array of user entered values parsed from commandline translated by Commander package 
 */
const stageSelecteddMedia = (options) => {

    /**
    * @param {Array} scheduledMedia List of media scheduled by the user
    * @param {Array} injectedMedia Movies selected by user without a specific time scheduled by the user
    * @param {number} endItem Unix Timestamp that is the selected end time of the stream.If no end time for the stream is selected, then the stream end will be set as the last selected main media time + duration + proceeding buffer duration
    * If no specific main media is selected endTime is set as the end of the current day.
    * End time can be set as any time in the future as long as it is set on the 30 minute or hour time point, and isnt the next closest 30 minute or hour time point to the current time
    */
    let stagedMedia = {
        scheduledMedia: [],
        injectedMedia: [],
        endTime: 0
    }

    //Set End time to tomorrow at 12:00 AM if no specific timepoints are selected
    if (options.blocks === undefined
        && options.endTime === undefined
        && options.movies === undefined) {
        stagedMedia.endTime = moment().startOf('day').add(1, "days").unix();
    }

    //Movies selected by user without a specific time scheduled by the user
    let injectedMedia = [];

    //Get and sort movies to their appropriate lists for building the stream
    if (options.movies) {
        options.movies.forEach(mt => {
            if (!mt.includes("::")) {
                injectedMedia.push(getMedia(mt, 0, movieList, "M"));
            } else {
                let splitItem = item.split("::");
                stagedMedia.scheduledMedia.push(getMedia(splitItem[0], parseInt(splitItem[1]), movieList, "M"));
            }
        });
    }

    //Get collection blocks and put them in scheduled list
    if (options.blocks) {
        options.blocks.forEach(item => {
            let splitItem = item.split("::");
            stagedMedia.scheduledMedia.push(getMedia(splitItem[0], parseInt(splitItem[1]), collectionList, "C"));
        });
    }

    //Sort scheduled media to order it by time ascending and set end time as 
    if (stagedMedia.scheduledMedia.length > 0) {
        stagedMedia.scheduledMedia = _.sortBy(stagedMedia.scheduledMedia, media => media.Time);
        let lastScheduledMedia = stagedMedia.scheduledMedia[stagedMedia.scheduledMedia.length - 1];
        stagedMedia.endTime = lastScheduledMedia.Time + lastScheduledMedia.DurationLimit;
    }

    checkForConflictingTimePoints(stagedMedia.scheduledMedia);

    //Set Endtime 
    if (options.endTime) {
        let selectedEndTime = parseInt(options.endTime);
        if (selectedEndTime > stagedMedia.endTime) {
            stagedMedia.endTime = selectedEndTime;
        } else {
            throw "Selected End Time occurs before last time selected for movie or collection"
        }
    }

    return stagedMedia;
}

//Deprecated, replace
exports.constructStream = async (config, environment, destinationDirectory, options, progression) => {

    //Constructed stream array in order to be returned by function
    let stream = [];

    //TODO: v1.4 Unscheduled media surrounding movies should share tags if possible
    let scheduledMedia = stageSelecteddMedia(options);

    //Programming schedule list in order
    let programming = [];

    //List of specifically catgeorized media related to media categorized in media DB which has already played during the stream
    //Commercials, Shorts and Music are only cumulative for every other "Main" media selection (shows and movies) in order to keep viewing fresh and unrepetitive
    //Tag Episodes are related to specific episodes that have already played and will reset when the end of tag episodes for a specific show has finished. This is usually related to holiday tag viewing
    let previousMedia = {
        movies: [],
        tagEpisodes: [],
        commercials: [],
        shorts: [],
        music: []
    }

    //Promos pulled from the config file that correspond to the specific environment for which the stream is being created
    let promos = loadEnvironmentPromos(environment, options.tagsOR);

    //TODO: v1.4 Unscheduled media surrounding movies should share tags if possible

    //TODO: vX Make a 10-15 second JSArrakis promo
    let environmentPromos = loadEnvironmentPromos(environment, options.tagsOR);

    //If no tags are selected by user then tags are generated from injected media and scheduled media
    if (options.tagsAND === undefined
        && options.tagsOR === undefined) {

        let tagList = [];
        let mergedMedia = injectedMedia;
        mergedMedia.push(...scheduledMedia);
        mergedMedia.forEach(mediaObj => {
            tagList.push(...mediaObj.Media.Tags)
        });
        options.tagsOR = _.uniq(tagList);
        //TODO: v1.4 Create different combos of block tags for tagsAND to give a more streamlined experience
    }

    let rightNow = moment().unix();

    let firstTimePoint = proceduralEndTime;

    if (blockList.length > 0) {
        firstTimePoint = sortedBlockList[0].TimePoint;
    }
    //TODO: v1.4 Event blocks

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
        defaultPromo,
        options.tagsOR
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
            injectedMovies,
            options.tagsOR
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
                injectedMovies,
                options.tagsOR
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
    console.log("Here!");
    return stream;
}