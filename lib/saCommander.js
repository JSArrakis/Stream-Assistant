'use strict';
const commander = require("commander");
const { exec } = require("child_process");
const utilities = require("./utilities");

const execPromise = (cmd) => {
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
        in test folders.")
        .option("--env, <env>", "Environment which the stream is being run")
        .option("--shows, [shows...]", "List of shows to select for stream construction. No spaces in name. Either \
        this option --movies, --tagsAND or --tagsOR is required")
        .option("--movies, [movies...]", "List of movies to select for stream construction. No spaces in name. Either \
        this option --shows or --tags is required")
        .option("--tagsOR, <tagsOR...>", "List of tags to select for stream construction. No spaces in name. Either this \
        option --shows or --movies is required. Additional --tags can be used for expanding tag criteria either shows \
        or movies selected. All tags are individually cumulative to the list generated. When shows or movies are used \
        as arguments and not flags, those shows or movies become additive overrides to the list")
        .option("--tagsAND, <tagsAND...>", "The same functionality as the tags argument, however tags are an \
        AND operator, not an OR")
        .option("--streamDuration, <streamDuration>", "An integer value. Each increment of 1 represents 30 minutes of \
        stream time. Eg: 3 = 1 hour and 30 minutes and 10 = 5 hours")
        .option("--noCommercials", "Turns off loading of all commercials in the stream")
        .option("--noBuffer", "Turns off loading of buffer for the stream except when specific collection, show, movie, or collection start times are selected")
        .option("--blocks, <blocks...>", "This creates a specific block based on preset collection blocks created by \
        the author. See documentation for details. All blocks have progression and it cannot be turned off. \
        Progression JSON will have to be edited manually for episode changes")
        .option("--events, <events...>", "Events are curated creations that are ingested through a JSON file, see documentation for details")
        .option("--progressionJitter, <progressionJitter>", "Overrides current progression and sets a progression jitter for the stream and sets whether the progression will be saved for future streams")
        .option("--endTime, <endTime>", "The end time of any procedural duration, this will be reset to the start \
        time of the last block created if the start time exceeds this time")
        .parse(process.argv);
    //TODO: Add all options logical checks v1.1
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
        //TODO: Create checker to make sure selected Block is an available block v1.1
    }
    if (!(options.blocks
        || options.shows
        || options.movies
        || options.tagsOR
        || options.tagsAND
        || options.randomMovies
        || options.randomShows)) {
        throw new Error("Must include arguments for blocks, shows, movies or tags. Check documentation for details \
        or check (whatever help thing I implement)");
    }
    if (!(options.tagsOR || options.tagsAND)) {
        if (options.shows && options.shows.length < 1) {
            throw new Error("When invoking the shows argument without tags, you must add arguments for which show \
            load names or aliases to run");
        }
        if (options.movies && options.movies.length < 1) {
            throw new Error("When invoking the movie argument without tags, you must add arguments for which movie \
            load names or aliases to run");
        }
    }

    if (!(options.streamDuration || options.blocks || options.endTime)) {
        //TODO: Check movies option if there are timing blocks, if not then throw error v1.1
        throw new Error("The stream must be set up with a stream duration, a block or movie with a set time, or an end time");
    }
    return commander.opts();
}

exports.executeStream = (config, destinationDirectory, playlistFileName) => {
    let consoleCommand = ["cd " + config.VLCLocation + " && vlc.exe " + destinationDirectory + playlistFileName + '.m3u'];

    consoleCommand.reduce((p, cmd) => {
        return p.then(() => {
            return execPromise(cmd);
        });
    }, Promise.resolve()).then((results) => {
        console.log(results);
    }, (err) => {
        if (err) throw err;
    });
}