'use strict';
const commander = require("commander");
const { exec } = require("child_process");

exports.execPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            if (err) return reject(err);
            resolve(stdout);
        });
    });
}

//Set, select and route input params from run
exports.parseCommandLineArgs = () => {
    commander
        .option("--test", "Runs StreamAssistant as a test, overriding folder and file reset safeguards when running \
        in test folders.+")
        .option("--shows, [shows...]", "List of shows to select for stream construction. No spaces in name. Either \
        this option --movies or --tags is required")
        .option("--movies, [movies...]", "List of movies to select for stream construction. No spaces in name. Either \
        this option --shows or --tags is required")
        .option("--tags, <tags...>", "List of tags to select for stream construction. No spaces in name. Either this \
        option --shows or --movies is required. Additional --tags can be used for expanding tag criteria either shows \
        or movies selected. All tags are individually cumulative to the list generated. When shows or movies are used \
        as arguments and not flags, those shows or movies become additive overrides to the list")
        .option("--tagsExplicit, <tagsExplicit...>", "The same functionality as the tags argument, however tags are an \
        AND operator, not an OR")
        .option("--streamDuration, <streamDuration>", "An integer value. Each increment of 1 represents 30 minutes of \
        stream time. Eg: 3 = 1 hour and 30 minutes and 10 = 5 hours")
        .option("--movieCount, <movieCount>", "How many movies to enqueue. The number of movies selected has the \
        ability to extend past stream duration values if set; In this case StreamAssistant will attempt to pick the \
        last video that has the shortest duration from the remaining unselected videos. This will remove any series \
        episodes that were not from explicitly selected series")
        .option("--episodeCount, <episodeCount>", "This option will load a number of episodes equal to the value input. \
        If a stream duration value is also input this will override the duration length and remove any non-selected \
        series or movies")
        .option("--progression", "When enabled, this option will continue the progression of the last episode played \
        from the series selected from previous streams where the progression flag was used.")
        .option("--movie-filler", "Attempts to fill space in between movies with bumpers, splash screens, and \
        commercials. StreamAssistant will attempt to do this already if shows are selected as well. This option \
        when selected will attempt to fill 5 minutes between movies overriding the duration argument.")
        .option("--randomMovies", "This will randomly select an assortment of movies from all categories.")
        .option("--randomShows", "This will randomly select an assortment of shows and episodes from all categories.")
        .option("--orderConfiguration, <orderConfiguration>", "This is movie to show ratio if both movies and shows \
        have been selected. Format will be either s2m1 or m1s2 , depending if movies or shows first. Any number can \
        be put for either shows or movies and it will keep the pattern based on movie count, episode count and duration")
        .option("--startTime, <startTime>", "Military time value of when the first episode should start based on your \
        local time. ")
        .option("--noCommercials", "Turns off loading of all commercials in the stream")
        .option("--blocks, <blocks...>", "This creates a specific block based on preset collection blocks created by \
        the author. See documentation for details. All blocks have progression and it cannot be turned off. \
        Progression JSON will have to be edited manually for episode changes")
        .parse(process.argv);
    //TODO: Add all options logical checks
    let options = commander.opts();
    if (options.blocks) {
        //check if block param is in correct format
        options.blocks.forEach(cand => {
            if (!(/^[a-zA-Z0-9_]*::[0-9]{4}$/gmi.test(cand))) {
                throw new Error("Any blocks submitted must conform to the format of Title::Time e.g. Toonami2k::1600 \
                where Title is the title of the block you wish to create and Time is the time in 24 time for your \
                system's local time. See the param --BlockList for all possible blocks available with their \
                descriptions.");
            }
        })
        //TODO: Create checker to make sure selected Block is an available block	
    }
    if (!(options.blocks
        || options.shows
        || options.movies
        || options.tags
        || options.tagsExplicit
        || options.randomMovies
        || options.randomShows)) {
        throw new Error("Must include arguments for blocks, shows, movies or tags. Check documentation for details \
        or check (whatever help thing I implement)");
    }
    if (!(options.tags || options.tagsExplicit)) {
        if (options.shows && options.shows.length < 1) {
            throw new Error("When invoking the shows argument without tags, you must add arguments for which show \
            load names or aliases to run");
        }
        if (options.shows && options.shows.length < 1) {
            throw new Error("When invoking the shows argument without tags, you must add arguments for which show \
            load names or aliases to run");
        }
    }
    if (!(options.streamDuration || options.movieCount || options.episodeCount || options.blocks)) {
        throw new Error("The stream must be set up with either a episode or movie count or a stream duration");
    } else {
        if (options.movieCount && !options.movies) {
            throw new Error("Movie flag or argument needs to be passed if movieCount argument is invoked");
        }
        if (options.episodeCount && !options.shows) {
            throw new Error("Shows flag or argument needs to be passed if episodeCount argument is invoked");
        }
    }

    if (!options.streamDuration) {
        if (options.shows && !options.episodeCount) {
            throw new Error("When invoking the shows argument without a Stream Duration, you must add arguments for an \
            episode count");
        }
        if (options.movies && !options.movieCount) {
            throw new Error("When invoking the shows argument without a Stream Duration, you must add arguments for a \
            movie count");
        }
    }
    return commander.opts();
}

exports.executeStream = (config, destinationDirectory, playlistFileName) => {
    var consoleCommand = ["cd " + config.VLCLocation + " && vlc.exe " + destinationDirectory + playlistFileName + '.m3u'];

    consoleCommand.reduce((p, cmd) => {
        return p.then(() => {
            return utilities.execPromise(cmd);
        });
    }, Promise.resolve()).then((results) => {
        console.log(results);
    }, (err) => {
        if (err) throw err;
    });
}