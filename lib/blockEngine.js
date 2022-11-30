'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const collectionList = require("../data/collectionList.json");
const bufferEng = require("./bufferEngine.js");
const utilities = require("./utilities");
const _ = require('lodash');

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

const incrementProgression = (progression, progressionTitle, show) => {
    progression.filter(pitem => pitem.Title === progressionTitle)[0].Shows
        .filter(fshow => fshow.LoadTitle === show.LoadTitle)
        .forEach(sitem => {
            if (sitem.Episode === show.EpisodeCount) {
                sitem.Episode = 1;
            } else {
                sitem.Episode++;
            }
        });
}

const createProgression = (options, progression, block, selectedShow) => {
    if (!progression.filter(pitem => pitem.Title === block.Title)[0].Shows
        .some(sitem => sitem.LoadTitle === selectedShow.LoadTitle)) {
        let episode = 1;
        if (options.progression === undefined && block.Type !== "Collection") {
            episode = Math.floor(Math.random() * (selectedShow.EpisodeCount - 1)) + 1;
        }

        progression.filter(pitem => pitem.Title === block.Title)[0]
            .Shows.push({
                "LoadTitle": selectedShow.LoadTitle,
                "Episode": episode
            });
    }
}

const getMovie = (movies) => {

    let selectedMovie = movies[Math.floor(Math.random() * movies.length) | 0];

    return {
        "Type": "Movie",
        "Movie": selectedMovie,
    }

}

const createMultipleEpisodeBlock = (selectedShow,
    progression) => {

    let selectedEpisodes = [
        selectedShow.Episodes[currentEpisode - 1]
    ];

    if (currentEpisode === selectedShow.EpisodeCount) {
        selectedEpisodes.push(selectedShow.Episodes[currentEpisode]);
    } else {
        selectedEpisodes.push(selectedShow.Episodes[0]);
    }

    selectedEpisodes.forEach(episode => {
        incrementProgression(progression, progressionTitle, selectedShow);
    });

    return {
        "Episodes": selectedEpisodes,
    }
}

const getShow = (
    shows,
    duration,
    progression,
    options,
    block) => {

    let show;
    let episodes = [];

    let showsWithinDuration = shows
        .filter(show => show.DurationLimit <= duration);

    if (duration > 1800) {
        console.log("///////////////// OVER 1800")
        show = showsWithinDuration[Math.floor(Math.random() * showsWithinDuration.length) | 0];

        createProgression(options, progression, block, show);

        let currentEpisode = progression.filter(pitem => pitem.Title === "Procedural")[0]
            .Shows.filter(sitem => sitem.LoadTitle === show.LoadTitle)[0].Episode;

        if (show.DurationLimit > 1800) {

            //Get Selected episode and increment duration
            let selectedEpisode = show.Episodes[currentEpisode - 1];
            incrementProgression(progression, "Procedural", show);

            episodes.push(selectedEpisode);

        } else {

            //Get Selected episode and increment duration
            let selectedEpisodes = [
                show.Episodes[currentEpisode - 1]
            ];

            if (currentEpisode === show.EpisodeCount) {
                selectedEpisodes.push(show.Episodes[currentEpisode]);
            } else {
                selectedEpisodes.push(show.Episodes[0]);
            }

            episodes.push(...selectedEpisodes);

            selectedEpisodes.forEach(episode => {
                incrementProgression(progression, "Procedural", show);
            });
        }
    } else {
        console.log("///////////////// UNDER 1800")
        let halfHourShows = showsWithinDuration.filter(item => item.DurationLimit === 1800);
        let nonOverDurationShows = halfHourShows.filter(item => item.OverDuration === false);
        show = nonOverDurationShows[Math.floor(Math.random() * nonOverDurationShows.length) | 0];
        createProgression(options, progression, block, show);

        //get show episode using progression
        let currentEpisode = progression.filter(pitem => pitem.Title === "Procedural")[0]
            .Shows.filter(sitem => sitem.LoadTitle === show.LoadTitle)[0].Episode;

        //Get Selected episode and increment duration
        let selectedEpisode = show.Episodes[currentEpisode - 1];
        incrementProgression(progression, "Procedural", show);
        episodes.push(selectedEpisode);
    }
    return {
        "Type": "Show",
        "Show": show,
        "Episodes": episodes
    };
}

const selectMedia = (options,
    media,
    mediaDuration,
    initialMovies,
    block,
    progression) => {

    let movies = [];
    let shows = [];
    let currentDuration = 0;
    let previousMovies = initialMovies;

    while (mediaDuration > currentDuration) {
        let duration = mediaDuration - currentDuration;

        //Flip the coin, heads is a movie, tails is a show (except when there arent any movies left that fit the criteria, then its always a show)
        let coin = Math.random();
        if (coin < 0.5
            && hasUniqueMoviesWithinDurationAvailable(duration,
                media.movies,
                previousMovies)) {

            let moviesWithinDuration = loadUniqueMoviesWithinDuration(duration, media.movies, previousMovies);
            let movieBlock = getMovie(moviesWithinDuration);

            movies.push(movieBlock);
            previousMovies.push(movieBlock);
            currentDuration = currentDuration + movieBlock.Movie.DurationLimit;

        } else {

            let showsWithinDuration = media.shows
                .filter(show => show.DurationLimit <= duration);

            let showBlock = getShow(showsWithinDuration,
                duration,
                progression,
                options,
                block);

            shows.push(showBlock);
            currentDuration = currentDuration + (showBlock.Show.DurationLimit * showBlock.Episodes.length);

        }
    }
    return {
        "Movies": movies,
        "Shows": shows
    }
}

exports.createProceduralBlock = (options,
    duration,
    shows,
    movies,
    stagedProgression,
    masterProgression) => {

    let createdBlock = {
        "Title": "Procedural",
        "Type": "Procedural",
        "Time": 0,
        "Duration": 0,
        "Tags": [],
        "Items": []
    };

    let progressionObject = {
        "Title": "Procedural",
        "Type": "Procedural",
        "Shows": []
    };

    if (!options.progression) {
        if (stagedProgression.filter(progItem => progItem.Title === "Procedural").length < 1) {
            stagedProgression.push(progressionObject);
            masterProgression.push(progressionObject);
        } else {
            stagedProgression.filter(pitem => pitem.Title === "Procedural")[0].Shows = [];
        }
    } else if (stagedProgression.filter(progItem => progItem.Title === "Procedural").length < 1) {
        stagedProgression.push(progressionObject);
        masterProgression.push(progressionObject);
    }


    let comboMediaDuration = 0;

    let selectedShows = [];
    let selectedMovies = [];
    let items = [];

    if (options.tagsAnd && options.tagsOr) {
        let calculation = Math.floor(duration * .5)
        let tempRemainder = calculation % 1800;
        comboMediaDuration = calculation + tempRemainder;
    } else if (options.tagsAnd) {
        let calculation = Math.floor(duration * .75)
        let tempRemainder = calculation % 1800;
        comboMediaDuration = calculation + tempRemainder;
    }

    let selectedComboMedia = {
        shows: [],
        movies: [],
    }
    let comboMedia = {
        "Movies": [],
        "Shows": []
    }
    let selectedTagMedia = loadTagMedia(options, shows, movies);

    if (comboMediaDuration > 0) {
        selectedComboMedia = loadTagComboMedia(options, shows, movies);
        comboMedia = selectMedia(options,
            selectedComboMedia,
            comboMediaDuration,
            selectedMovies,
            createdBlock,
            stagedProgression
        );
    }

    let tagMedia = selectMedia(options,
        selectedTagMedia,
        duration - comboMediaDuration,
        selectedMovies,
        createdBlock,
        stagedProgression
    );

    selectedMovies.push(...comboMedia.Movies);
    selectedMovies.push(...tagMedia.Movies);
    selectedShows.push(...comboMedia.Shows);
    selectedShows.push(...tagMedia.Shows);
    items.push(...comboMedia.Movies);
    items.push(...tagMedia.Movies);
    items.push(...comboMedia.Shows);
    items.push(...tagMedia.Shows);

    let shuffledItems = _.shuffle(items);

    return {
        "Items": shuffledItems,
        "Movies": selectedMovies,
        "Shows": selectedShows
    }
}

exports.createCollectionBlocks = (options, stagedProgression, masterProgression, streamPromos, streamDefaultPromo) => {
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream

    //Parse block requests into readable objects
    let parsedBlocks = parseBlocks(options.blocks);

    let previousCommercials = [];
    let previousPromos = [];
    let previousShorts = [];
    let previousMusic = [];

    //Create each collection block
    parsedBlocks.forEach(block => {
        //Get object that contains all the information needed to create the selected block
        let blockPaths = collectionList.filter(item => item.Title === block.Title)[0];
        //Check if progression object exists for this block. If not create it and push it into the progression 
        //array
        if (!stagedProgression.some(progItem => progItem.Title === blockPaths.Title)) {
            stagedProgression.push({
                "Title": blockPaths.Title,
                "Type": "Collection",
                "Shows": []
            });
            masterProgression.push({
                "Title": blockPaths.Title,
                "Type": "Collection",
                "Shows": []
            });
        }
        //Get designated commercials for this specific block
        let blockCommercials = utilities.clipSelector(blockPaths.Commercials, "C");
        let blockPromos = utilities.clipSelector(blockPaths.Promos, "P");
        let blockShorts = [];
        let blockMusic = [];
        let carryOver = 0;
        //Create a block object to be populated with the show items in order and passed to the main stream for 
        //consumption
        let createdBlock = {
            "Title": blockPaths.Title,
            "Type": "Collection",
            "Time": block.Time,
            "DurationLimit": blockPaths.Duration,
            "Duration": 0,
            "Tags": [],
            "Items": []
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

                //If the show is found
                if (selectedShow !== undefined) {

                    let currentShowBlockDuration = 0; /*This value is the cumulative duration of the show, 
                    selected bumpers, commercials, shorts and music.This number is used in conjunction with the show block 
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
                    createProgression(options, stagedProgression, createdBlock, selectedShow);

                    //Add show start bumper and increment duration
                    if (sortedShow.BumperStart.length > 0) {
                        let bumpStart = sortedShow
                            .BumperStart[Math.floor(Math.random() * sortedShow.BumperStart.length)];
                        createdBlock.Items.push(bumpStart.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpStart.Duration
                    }

                    //Get current episode number
                    let currentEpisode = stagedProgression.filter(pitem => pitem.Title === blockPaths.Title)[0]
                        .Shows.filter(sitem => sitem.LoadTitle === selectedShow.LoadTitle)[0].Episode;

                    //Get Selected episode and increment duration
                    let selectedEpisode = selectedShow.Episodes[currentEpisode - 1];
                    //Check if next show should be skipped
                    if (selectedShow.DurationLimit < selectedEpisode.Duration) {
                        skipShow = true;
                    }
                    createdBlock.Items.push(selectedEpisode.EpisodePath);
                    incrementProgression(stagedProgression, blockPaths.Title, selectedShow);
                    currentShowBlockDuration = currentShowBlockDuration + selectedEpisode.Duration

                    //Add show end bumper and increment duration
                    if (sortedShow.BumperEnd.length > 0 && !skipShow) {
                        let bumpEnd = sortedShow.BumperEnd[Math.floor(Math.random() * sortedShow.BumperEnd.length)];
                        createdBlock.Items.push(bumpEnd.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpEnd.Duration;
                    }

                    let promos = blockPromos;
                    let defaultPromo = blockPaths.DefaultPromo;

                    //Create buffer. Buffer consistency is based on whether or not the buffer is being created for the
                    //final show of the block
                    if (sortedBlockShows
                        .findIndex(x => x.LoadTitle === sortedShow.LoadTitle) + 1 === sortedBlockShows.length) {
                        createdBlock.Items.push(blockPaths.EndBumper.Path);
                        currentShowBlockDuration = currentShowBlockDuration + blockPaths.EndBumper.Duration;
                        promos = streamPromos;
                        defaultPromo = streamDefaultPromo;
                    }

                    let selectedBuffer = bufferEng
                        .createProceduralBlockBuffer(sortedShow.DurationLimit - currentShowBlockDuration,
                            blockCommercials,
                            promos,
                            blockShorts,
                            blockMusic,
                            previousCommercials,
                            previousPromos,
                            previousShorts,
                            previousMusic,
                            defaultPromo
                        );

                    previousCommercials = selectedBuffer.selectedCommercials;
                    previousPromos = selectedBuffer.selectedPromos;
                    previousShorts = selectedBuffer.selectedShorts;
                    previousMusic = selectedBuffer.selectedMusic;

                    currentShowBlockDuration = currentShowBlockDuration + selectedBuffer.Duration;

                    createdBlock.Items.push(...selectedBuffer.Items);
                    carryOver = currentShowBlockDuration - sortedShow.DurationLimit;

                    createdBlock.Duration = createdBlock.Duration + currentShowBlockDuration;

                    let tags = createdBlock.Tags;
                    tags.push(...selectedShow.Tags);
                    createdBlock.Tags = _.uniq(tags);
                } else {
                    throw `${sortedShow.LoadTitle} is not a show available in the the current show list`;
                }
            } else {

                let currentShowBlockDuration = 0; /*This value is the cumulative duration of the show, 
                    selected bumpers, commercials, shorts and music.This number is used in conjunction with the show block 
                    duration limit on the Show item in the Collection object*/

                //Add the carry over to the current show block duration to help stabilize the timing of the block
                currentShowBlockDuration = currentShowBlockDuration + carryOver;
                let selectedBuffer = bufferEng
                    .createProceduralBlockBuffer(sortedShow.DurationLimit - currentShowBlockDuration,
                        blockCommercials,
                        blockPromos,
                        blockShorts,
                        blockMusic,
                        previousCommercials,
                        previousPromos,
                        previousShorts,
                        previousMusic,
                        blockPaths.DefaultPromo
                    );

                previousCommercials = selectedBuffer.selectedCommercials;
                previousPromos = selectedBuffer.selectedPromos;
                previousShorts = selectedBuffer.selectedShorts;
                previousMusic = selectedBuffer.selectedMusic;
                createdBlock.Items.push(...selectedBuffer.Items);
                carryOver = currentShowBlockDuration - sortedShow.DurationLimit;

                createdBlock.Duration = createdBlock.Duration + currentShowBlockDuration;

                skipShow = false;
            }
        });

        blockList.push(createdBlock);
    });

    let sortedBlockList = _.sortBy(blockList, block => block.Time);

    //TODO: check to make sure no blocks conflict with eachother in timing
    return {
        "collectionBlocks": sortedBlockList,
        "selectedCommercials": previousCommercials,
        "selectedPromos": previousPromos,
        "selectedShorts": previousShorts,
        "selectedMusic": previousMusic
    };
}