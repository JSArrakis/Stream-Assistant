'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const blockEng = require("./blockEngine.js");
const bufferEng = require("./bufferEngine.js");
const dirMan = require("./directoryManager.js");
const utilities = require("./utilities");

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
    //available
    if (!options.noCommercials) {
        commercialList = utilities.clipSelector(config.Commercials.nineties, "C");
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
    if (options.tags) {
        //Check if show or movie params were input
        if (options.shows && options.movies) {
            //Read the tags that were input into the command line
            //Grab Both Movies and Shows for Each Tag and append them to their respective arrays
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        } else if (options.shows) {
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
        } else if (options.movies) {
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        } else {
            //Read the tags that were input into the command line
            //Grab Both Movies and Shows for Each Tag and append them to their respective arrays
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        }
        //TODO: HANDLE THIS CORRECTLY
    } else if (options.tagsExplicit) {
        //Check if show or movie params were input
        if (options.shows && options.movies) {
            //Read the tags that were input into the command line
            //Grab Both Movies and Shows for Each Tag and append them to their respective arrays
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        } else if (options.shows) {
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
        } else if (options.movies) {
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        } else {
            //Read the tags that were input into the command line
            //Grab Both Movies and Shows for Each Tag and append them to their respective arrays
            options.tags.forEach(tag => {
                selectedShows.push(...showList.filter(show => show.Tags.includes(tag)));
            });
            options.tags.forEach(tag => {
                selectedMovies.push(...movieList.filter(movie => movie.Tags.includes(tag)));
            });
        }
    } else {

    }

    if (options.episodeCount || options.streamDuration) {
        //For shows check if number of episodes arg
        if (options.episodeCount) {
            let n = 0;
            //rotate shows with number of episodes ordered and load them into stream
            while (n < options.episodeCount) {
                selectedShows.forEach(show => {
                    //TODO: Push Start Bumper Based on Show Title compared to Bumper Location
                    stream.push(show.Episodes[n].EpisodePath);
                    //TODO: Push End Bumper Based on Show Title compared to Bumper Location
                    // let selectedCommercials = bufferEng.bufferGenerator()  (config, commercialList);
                    // selectedCommercials.forEach(item => stream.push(item.path));
                });
                n++;
            }
        } else {
            //rotate shows with number of episodes ordered and load them into stream
            while (currentDuration < options.streamDuration) {
                selectedShows.forEach(show => {
                    let episode = show.Episodes[n]
                    //TODO: Push Start Bumper Based on Show Title compared to Bumper Location
                    stream.push(episode.EpisodePath);
                    currentDuration = currentDuration + episode.Duration;
                    //TODO: Push End Bumper Based on Show Title compared to Bumper Location
                    if (!options.noCommercials) {
                        //TODO: Add 5 minutes of random commercials and stings
                        currentDuration = currentDuration + 5;
                    }
                });
                n++;
            }
        }
    }

    dirMan.createProgressionFile(destinationDirectory, progression);
    
    return stream;
}