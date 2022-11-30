'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");
const moment = require("moment");
const _ = require('lodash');

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
    initialTimePoint) => {

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
        masterProgression
    );

    let timepoint = initialTimePoint;

    blockItems.Items.forEach(item => {

        let createdBlock = {
            "Title": "Procedural",
            "Type": "Procedural",
            "MediaTitle": "",
            "Time": "None", //TODO: Set this based on the calculated procedural block start time
            "TimePoint": 0,
            "DurationLimit": 0,
            "Duration": 0,
            "Tags": [],
            "Items": []
        }

        if (item.Type === "Movie") {

            createdBlock.MediaType = item.Type;
            createdBlock.DurationLimit = item.Movie.DurationLimit;
            createdBlock.Tags = item.Movie.Tags;
            createdBlock.MediaTitle = item.Movie.Title;
            createdBlock.Items.push(item.Movie.MoviePath);
            createdBlock.Duration = createdBlock.Duration + item.Movie.Duration;
            createdBlock.TimePoint = timepoint;

            timepoint = timepoint + createdBlock.DurationLimit;

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

            previousCommercials = buffer.selectedCommercials;
            previousPromos = buffer.selectedPromos;
            previousShorts = buffer.selectedShorts;
            previousMusic = buffer.selectedMusic;

            blocks.push(createdBlock);

        } else {

            createdBlock.MediaType = item.Type;
            createdBlock.DurationLimit = item.Show.DurationLimit * item.Episodes.length;
            createdBlock.Tags = item.Show.Tags;
            createdBlock.MediaTitle = item.Show.Title;
            createdBlock.TimePoint = timepoint;

            timepoint = timepoint + createdBlock.DurationLimit;

            item.Episodes.forEach(episode => {
                createdBlock.Items.push(episode.EpisodePath);
                createdBlock.Duration = createdBlock.Duration + episode.Duration;
                console.log("////////////////////////////////////////////////");
                console.log(episode);
                console.log("////////////////////////////////////////////////");
                console.log("item.Show.DurationLimit", item.Show.DurationLimit);
                console.log("createdBlock.DurationLimit", createdBlock.DurationLimit);
                console.log("episode.Duration", episode.Duration);
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

                previousCommercials = buffer.selectedCommercials;
                previousPromos = buffer.selectedPromos;
                previousShorts = buffer.selectedShorts;
                previousMusic = buffer.selectedMusic;

                blocks.push(createdBlock);
            });

        }

    });

    return blocks;
}

exports.constructStream = (config, destinationDirectory, options) => {

    let stream = [];
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their 
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream
    let selectedShows = []; //List of shows selected based on direct selections or tags
    let selectedMovies = []; //List of movies selected based on direct selections or tags
    let commercials = []; //List of all commercials selected for the stream (this is agnostic to any commercials
    //in any selected block)
    let promos = [];
    let shorts = [];
    let music = [];
    let previousCommercials = [];
    let previousPromos = [];
    let previousShorts = [];
    let previousMusic = []
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
        commercials = utilities.clipSelector(config.Commercials.nineties, "C");
        commercials.push(...utilities.clipSelector(config.Commercials.aughts, "C"));
    }

    //Check if any collection blocks were requested
    //TODO: handle conflicting time points where a block might overlap another depending on duration of the block
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
        //TODO: yes
    }

    if (options.tagsAnd === undefined
        && options.tagsOR === undefined
        && options.blocks !== undefined) {
        let tempTagList = [];
        blockList.forEach(block => tempTagList.push(...block.Tags));
        let uniqueBlockTags = _.uniq(tempTagList);
        //TODO: Create different combos of block tags for tagsAND to give a more streamlined experience
        options.tagsOR = uniqueBlockTags;
    }

    //TODO: Show and movie selection from commandline has to happen here

    let sortedBlockList = _.sortBy(blockList, block => block.Time);
    let rightNow = moment().unix();
    let firstTimePoint = proceduralEndTime;
    if (blockList.length > 0) {
        firstTimePoint = moment(sortedBlockList[0].Time, "HHmm").unix();
    }

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

    let stagedStream = [];

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
            firstBlockStartTime
        )

        console.log(constructedBlocks);
    }

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