'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const collectionList = require("../data/collectionList.json");
const bufferEng = require("./bufferEngine.js");
const utilities = require("./utilities");
const _ = require('lodash');
const { create } = require("lodash");

const containsAllElements = (target, arr) => {
    return target.every(v => arr.includes(v));
}

const loadTagComboMedia = (options, showList, movieList) => {
    let candidateShows = [];
    let candidateMovies = [];
    if (options.shows && options.movies) {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
        candidateMovies = movieList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else if (options.shows) {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else if (options.movies) {
        candidateMovies = movieList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    } else {
        candidateShows = showList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
        candidateMovies = movieList.filter(clip => containsAllElements(options.TagsAND, clip.Tags));
    }
    return {
        shows: candidateShows,
        movies: candidateMovies,
    }
}

const loadTagMedia = (options, showList, movieList) => {
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

const parseBlocks = (blocks) => {
    let parsedBlocks = [];
    blocks.forEach(item => {
        let splitItem = item.split("::");
        parsedBlocks.push({
            "Title": splitItem[0],
            "Time": splitItem[1]
        })
    });
    return parsedBlocks;
}

const loadUniqueMoviesWithinDuration = (duration, movieList, previousMovies) => {
    let uniqueMovies = [];
    let moviesWithinDuration = movieList.filter(movie => movie.DurationLimit <= duration);
    moviesWithinDuration.forEach(movie => {
        if (previousMovies.indexOf(movie) === -1) {
            uniqueMovies.push(movie);
        }
    });
    return uniqueMovies;
}

const hasUniqueMoviesWithinDurationAvailable = (duration, movieList, previousMovies) => {
    let targetClips = loadUniqueMoviesWithinDuration(duration, movieList, previousMovies);
    return targetClips.length > 0;
}

const createProgression = (progression, type, selectedShow) => {
    if (!progression.filter(pitem => pitem.Title === type)[0].Shows
        .some(sitem => sitem.LoadTitle === selectedShow.LoadTitle)) {

        let episode = 1;

        if (options.progression === undefined && type !== "Collection") {
            episode = Math.floor(Math.random() * (selectedShow.EpisodeCount - 1))
        }

        progression.filter(pitem => pitem.Title === type)[0]
            .Shows.push({
                "LoadTitle": selectedShow.LoadTitle,
                "Episode": episode
            });
    }
}

const createProceduralBlockBuffer = (duration,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic) => {

    let items = [];

    let nonRepeatClips = bufferEng
        .selectNonRepeatProceduralBuffer(commercials,
            promos,
            shorts,
            music,
            previousCommercials,
            previousPromos,
            previousShorts,
            previousMusic);

    let selectedBuffer = bufferEng
        .streamBufferGenerator(duration,
            nonRepeatClips.Commercials,
            nonRepeatClips.Promos,
            nonRepeatClips.Shorts,
            nonRepeatClips.Music,
            blockPaths.DefaultPromo);

    let shuffledBuffer = bufferEng
        .bufferShuffle(selectedBuffer.selectedCommercials,
            selectedBuffer.selectedPromos,
            selectedBuffer.selectedShorts,
            selectedBuffer.selectedMusic);

    shuffledBuffer.forEach(clip => items.push(clip.path));
    return {
        "Items": items,
        "selectedCommercials": selectedBuffer.selectedCommercials,
        "selectedPromos": selectedBuffer.selectedPromos,
        "selectedShorts": selectedBuffer.selectedShorts,
        "selectedMusic": selectedBuffer.selectedMusic
    }
}

const createMovieBlock = (movies,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic) => {

    let createdBlock = {
        "Items": items,
        "Movie": selectedMovie,
        "Commercials": selectedBuffer.selectedCommercials,
        "Promos": selectedBuffer.selectedPromos,
        "Shorts": selectedBuffer.selectedShorts,
        "Music": selectedBuffer.selectedMusic,
    }

    let selectedMovie = movies[Math.floor(Math.random() * movies.length) | 0];
    let bufferDuration = selectedMovie.DurationLimit - selectedMovie.Duration;
    let createdBuffer = createProceduralBlockBuffer(bufferDuration,
        commercials,
        promos,
        shorts,
        music,
        previousCommercials,
        previousPromos,
        previousShorts,
        previousMusic)

    createdBlock.Items.push(selectedMovie.MoviePath);
    createdlock.Items.push(...createBuffer.Items);
    createdBlock.Commercials = createdBuffer.selectedCommercials;
    createdBlock.Promos = createdBuffer.selectedPromos;
    createdBlock.Shorts = createdBuffer.selectedShorts;
    createdBlock.Music = createdBuffer.selectedMusic;

    return createdBlock;
}

const createMultipleEpisodeBlock = (episodes,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic) => {

    let createdBlock = {
        "Items": new [],
        "Commercials": previousCommercials,
        "Promos": previousPromos,
        "Shorts": previousShorts,
        "Music": previousMusic,
    }

    episodes.forEach(ep => {
        let duration = 0;

        if (ep.Duration > 1800) {
            duration = ep.Duration % 1800;
        }
        else {
            duration = 1800 - ep.Duration;
        }

        let createdBuffer = createProceduralBlockBuffer(duration,
            commercials,
            promos,
            shorts,
            music,
            previousCommercials,
            previousPromos,
            previousShorts,
            previousMusic)

        createdBlock.Items.push(ep.EpisodePath);
        createdBlock.Items.push(...createdBuffer.Items);
        createdBlock.Commercials = createdBuffer.selectedCommercials;
        createdBlock.Promos = createdBuffer.selectedPromos;
        createdBlock.Shorts = createdBuffer.selectedShorts;
        createdBlock.Music = createdBuffer.selectedMusic;
    })

    return createdBlock;
}

const createShowBlock = (
    shows,
    commercials,
    promos,
    shorts,
    music,
    progression,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic,
    options) => {

    let createdBlock = {
        "Items": new [],
        "Commercials": new [],
        "Promos": new [],
        "Shorts": new [],
        "Music": new [],
    }

    let shows = shows
        .filter(show => show.DurationLimit <= currentDuration);
    if (currentDuration > 1800) {

        let selectedShow = shows[Math.floor(Math.random() * shows.length) | 0];

        createProgression(progression, "Procedural", selectedShow);

        let currentEpisode = progression.filter(pitem => pitem.Title === "Procedural")[0]
            .Shows.filter(sitem => sitem.LoadTitle === selectedShow.LoadTitle)[0].Episode;

        if (options.progression === undefined) {
            currentEpisode = Math.floor(Math.random() * (selectedShow.EpisodeCount - 1))
        }

        if (selectedShow.DurationLimit > 1800) {
            //Get Selected episode and increment duration
            //TODO: If no more episodes in list, restart series
            let selectedEpisode = selectedShow.Episodes[currentEpisode - 1];
            let bufferDuration = selectedEpisode.Duration % 1800;
            let createdBuffer = createProceduralBlockBuffer(bufferDuration,
                commercials,
                promos,
                shorts,
                music,
                previousCommercials,
                previousPromos,
                previousShorts,
                previousMusic)

            createdBlock.Items.push(selectedEpisode.EpisodePath);
            createdlock.Items.push(...createBuffer.Items);
            createdBlock.Commercials = createdBuffer.selectedCommercials;
            createdBlock.Promos = createdBuffer.selectedPromos;
            createdBlock.Shorts = createdBuffer.selectedShorts;
            createdBlock.Music = createdBuffer.selectedMusic;
        } else {
            //Get Selected episode and increment duration
            //TODO: If no more episodes in list, restart series
            //TODO: Get two episodes
            let selectedEpisodes = [
                selectedShow.Episodes[currentEpisode - 1]
            ];
            if (currentEpisode === selectedShow.EpisodeCount) {
                selectedEpisodes.push(selectedShow.Episodes[currentEpisode]);
            } else {
                selectedEpisodes.push(selectedShow.Episodes[0]);
            }
            let multiEpisodeBlock = createMultipleEpisodeBlock(selectedEpisodes,
                commercials,
                promos,
                shorts,
                music,
                previousCommercials,
                previousPromos,
                previousShorts,
                previousMusic)

            createdlock.Items.push(...multiEpisodeBlock.Items);
            createdBlock.Commercials = createdBuffer.selectedCommercials;
            createdBlock.Promos = createdBuffer.selectedPromos;
            createdBlock.Shorts = createdBuffer.selectedShorts;
            createdBlock.Music = createdBuffer.selectedMusic;
        }
    } else {
        let nonOverDurationShows = shows.filter(item => item.OverDuration === false && item.DurationLimit === 1800);
        let selectedShow = nonOverDurationShows[Math.floor(Math.random() * nonOverDurationShows.length) | 0];
        createProgression(progression, "Procedural", selectedShow);
        //get show episode using progression
        let currentEpisode = progression.filter(pitem => pitem.Title === "Procedural")[0]
            .Shows.filter(sitem => sitem.LoadTitle === selectedShow.LoadTitle)[0].Episode;
        if (options.progression === undefined) {
            currentEpisode = Math.floor(Math.random() * (selectedShow.EpisodeCount - 1))
        }
        //Get Selected episode and increment duration
        //TODO: If no more episodes in list, restart series
        let selectedEpisode = selectedShow.Episodes[currentEpisode - 1];
        let bufferDuration = 1800 - selectedEpisode.Duration
        let createdBuffer = createProceduralBlockBuffer(bufferDuration,
            commercials,
            promos,
            shorts,
            music,
            previousCommercials,
            previousPromos,
            previousShorts,
            previousMusic)

        createdBlock.Items.push(selectedEpisode.EpisodePath);
        createdBlock.Items.push(...createBuffer.Items);
        createdBlock.Commercials = createdBuffer.selectedCommercials;
        createdBlock.Promos = createdBuffer.selectedPromos;
        createdBlock.Shorts = createdBuffer.selectedShorts;
        createdBlock.Music = createdBuffer.selectedMusic;
    }

    return createdBlock;
}

exports.createProceduralBlock = (options, duration, shows, movies, commercials, promos, shorts, music, progression) => {
    if (!options.progression) {
        progression.push({
            "Title": "Procedural",
            "Type": "Procedural",
            "Shows": new []
        });
    } else if (!progression.some(progItem => progItem.Title === "Procedural")) {
        progression.push({
            "Title": "Procedural",
            "Type": "Procedural",
            "Shows": new []
        });
    }
    let selectedComboMedia = loadTagComboMedia(options, shows, movies);
    let selectedTagMedia = loadTagMedia(options, shows, movies);
    let tagComboClipsDuration = 0;
    let currentTagComboClipsDuration = 0;
    let createdBlock = {
        "Tags": new [],
        "MovieBlocks": new [],
        "ShowBlocks": new [],
        "Items": new []
    }

    let previousMovies = [];
    let previousCommercials = [];
    let previousPromos = [];
    let previousShorts = [];
    let previousMusic = [];

    if (options.tagsAnd && options.tagsOr) {
        tagComboClipsDuration = duration * .5;
    } else if (options.tagsAnd) {
        tagComboClipsDuration = duration * .75;
    }

    while (tagComboClipsDuration > currentTagComboClipsDuration) {
        let currentDuration = tagComboClipsDuration - currentTagComboClipsDuration;
        let coin = Math.random();
        if (coin < 0.5
            && hasUniqueMoviesWithinDurationAvailable(currentDuration,
                selectedComboMedia.movies,
                createdBlock.Movies)) {

            let moviesWithinDuration = loadUniqueMoviesWithinDuration(duration, movieList, previousMovies);

            let movieBlock = createMovieBlock(moviesWithinDuration,
                commercials,
                promos,
                shorts,
                music,
                previousCommercials,
                previousPromos,
                previousShorts,
                previousMusic);

            carryOver = sortedShow.DurationLimit - currentShowBlockDuration;
            createdBlock.MovieBlocks.push(movieBlock);
            createdBlock.Items.push(...movieBlock.Items)

            previousCommercials = movieBlock.Commercials;
            previousPromos = movieBlock.Promos;
            previousShorts = movieBlock.Shorts;
            previousMusic = movieBlock.Music;
        } else {
            let showsWithinDuration = shows
                .filter(show => show.DurationLimit <= currentDuration);

            let showBlock = createShowBlock(showsWithinDuration,
                commercials,
                promos,
                shorts,
                music,
                progression,
                previousCommercials,
                previousPromos,
                previousShorts,
                previousMusic);

            carryOver = sortedShow.DurationLimit - currentShowBlockDuration;
            createdBlock.MovieBlocks.push(showBlock);
            createdBlock.Items.push(...showBlock.Items)

            previousCommercials = showBlock.Commercials;
            previousPromos = showBlock.Promos;
            previousShorts = showBlock.Shorts;
            previousMusic = showBlock.Music;
        }
    }
    return createdBlock;
}

exports.createCollectionBlocks = (config, blocks, progression) => {
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream

    //Parse block requests into readable objects
    let parsedBlocks = parseBlocks(blocks);
    let blockListTimes = []

    //Create each collection block
    parsedBlocks.forEach(block => {
        blockListTimes.push({
            startTime: 0,
            endTime: 0
        });
        //Get object that contains all the information needed to create the selected block
        let blockPaths = collectionList.filter(item => item.Title === block.Title)[0];
        //Check if progression object exists for this block. If not create it and push it into the progression 
        //array
        if (!progression.some(progItem => progItem.Title === blockPaths.Title)) {
            progression.push({
                "Title": blockPaths.Title,
                "Type": "Collection",
                "Shows": new []
            });
        }
        //Get designated commercials for this specific block
        let blockCommercials = utilities.clipSelector(blockPaths.Commercials, "C");
        let blockPromos = utilities.clipSelector(blockPaths.Promos, "P");
        let previousCommercials = [];
        let previousPromos = [];
        let fillerShows = [];
        let carryOver = 0;
        //Create a block object to be populated with the show items in order and passed to the main stream for 
        //consumption
        let createdBlock = {
            "Title": blockPaths.Title,
            "Time": block.Time,
            "Duration": 0,
            "Tags": new [],
            "Items": new []
        }

        //Sort the shows of the selected block by their preselected sequence
        let sortedBlockShows = blockPaths.Shows.sort((a, b) => {
            return a.Sequence - b.Sequence;
        });


        let skipShow = false; /*This is a controller to determine if a show is populated in the block. If the show 
            runs longer than the alloted time block for that show by X seconds (set in config), skip the show 
            following it. Time remaining will be filled with filler shows and promos */

        /*
        -- Author note:: A good example of this is with the summer 2000 broadcast of Toonami with Tenchi Muyo. 
        Tenchi has a few episodes that are weirdly 45 minutes instead of 30 minutes randomly with no real rhyme 
        or reason. To handle this randomness, Toonami in it's original broadcast pulled the episode of Batman the 
        Animated series which usually followed Tenchi for that day only and populated the remainder of the 
        15 minutes that would have normally been Batman with Power Puff Girl episodes instead. This allowed 
        Toonami to keep the fidelity of a 3 hour block and decreasing dead time and keeping interest of the 
        audience while staying within theme (Toonami being a series of mostly violence driven animated shows 
        in which the only Cartoon Network licensed property that fit in the alloted time slot that was also 
        themed correctly was PPG)
        */

        //Start populating this block's run episodes
        sortedBlockShows.forEach(sortedShow => {
            //If skipShow is false
            if (!skipShow) {
                //Try to get the show from the show list of the matching load title
                let selectedShow = showList.filter(sli => sli.LoadTitle === sortedShow.LoadTitle)[0];

                //Check if next show should be skipped
                if (sortedShow.DurationLimit + 60 < selectedShow.Duration) {
                    skipShow = true;
                }
                //If the show is found
                if (selectedShow !== undefined) {

                    let currentShowBlockDuration = 0; /*This value is the cumulative duration of the show, 
                    selected bumpers and commercials.This number is used in conjunction with the show block 
                    duration limit on the Show item in the Collection object*/

                    //Add the carry over to the current show block duration to help stabilize the timing of the block
                    currentShowBlockDuration = currentShowBlockDuration + carryOver;

                    //If the show is the first show in the block, then the collection start bumper duration needs 
                    //to be added to the initial show block.
                    if (sortedBlockShows.findIndex(x => x.LoadTitle === sortedShow.LoadTitle) === 0) {
                        //Push block starter bumper into the block 
                        createdBlock.Items.push(blockPaths.StartBumper.Path);
                        currentShowBlockDuration = currentShowBlockDuration + blockPaths.StartBumper.Duration;
                    }

                    //If Show doesnt exist in the current collection progression. Add a tracking object as the
                    //first episode.
                    createProgression(progression, blockpaths.Type, selectedShow);

                    //Add show start bumper and increment duration
                    if (sortedShow.BumperStart.length > 0) {
                        let bumpStart = sortedShow
                            .BumperStart[Math.floor(Math.random() * sortedShow.BumperStart.length)];
                        createdBlock.Items.push(bumpStart.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpStart.Duration
                    }

                    //Get current episode number
                    let currentEpisode = progression.filter(pitem => pitem.Title === blockPaths.Title)[0]
                        .Shows.filter(sitem => sitem.LoadTitle === selectedShow.LoadTitle)[0].Episode;

                    //Get Selected episode and increment duration
                    //TODO: If no more episodes in list, restart series
                    let selectedEpisode = selectedShow.Episodes[currentEpisode - 1];
                    createdBlock.Items.push(selectedEpisode.EpisodePath);
                    currentShowBlockDuration = currentShowBlockDuration + selectedEpisode.Duration

                    //Add show end bumper and increment duration
                    if (sortedShow.BumperEnd.length > 0) {
                        let bumpEnd = sortedShow.BumperEnd[Math.floor(Math.random() * sortedShow.BumperEnd.length)];
                        createdBlock.Items.push(bumpEnd.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpEnd.Duration;
                    }

                    //Create buffer. Buffer consistency is based on whether or not the buffer is being created for the
                    //final show of the block
                    if (sortedBlockShows
                        .findIndex(x => x.LoadTitle === sortedShow.LoadTitle) + 1 === sortedBlockShows.length) {
                        createdBlock.Items.push(blockPaths.EndBumper.Path);
                        currentShowBlockDuration = currentShowBlockDuration + blockPaths.EndBumper.Duration;
                    }


                    let nonRepeatClips = bufferEng
                        .selectNonRepeatBuffer(blockCommercials, blockPromos, previousCommercials, previousPromos);

                    //TODO: Create Filler episode generation
                    let selectedBuffer = bufferEng
                        .bufferGenerator(sortedShow.DurationLimit - currentShowBlockDuration,
                            nonRepeatClips.Commercials,
                            nonRepeatClips.Promos,
                            fillerShows,
                            blockPaths.DefaultPromo);

                    previousCommercials = selectedBuffer.selectedCommercials;
                    previousPromos = selectedBuffer.selectedPromos;

                    currentShowBlockDuration = currentShowBlockDuration + selectedBuffer.duration;

                    let shuffledBuffer = bufferEng
                        .bufferShuffle(selectedBuffer.selectedCommercials,
                            selectedBuffer.selectedPromos,
                            selectedBuffer.selectedFillerShows);

                    shuffledBuffer.forEach(clip => createdBlock.Items.push(clip.path));
                    carryOver = sortedShow.DurationLimit - currentShowBlockDuration;

                    let tags = createdBlock.Tags;
                    tags.push(...selectedShow.Tags);
                    createdBlock.Tags = _.uniq(tags);
                } else {
                    throw `${sortedShow.LoadTitle} is not a show available in the the current show list`;
                }
            } else {
                //TODO: Filler shows and promos 

                skipShow = false;
            }
        });

        blockList.push(createdBlock);
    });
    let sortedBlockList = _.sortBy(blockList, block => block.Time);

    //TODO: check to make sure no blocks conflict with eachother in timing
    return sortedBlockList;
}