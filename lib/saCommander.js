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
        .option("--test", "Runs StreamAssistant as a test, overriding folder and file reset safeguards when running in test folders.")
        .option("--env, <env>", "Environment which the stream is being run")
        .option("--movies, <movies...>", "List of movies to select for stream construction. No spaces in name. Either this option --shows or --tags is required")
        .option("--tagsOR, <tagsOR...>", "List of tags to select for stream construction. No spaces in tag genre")
        .option("--tagsAND, <tagsAND...>", "The same functionality as the tagsOR argument, however tags are an AND operator, not an OR")
        .option("--blocks, <blocks...>", "This creates a specific block based on preset collection blocks created by the author. See documentation for details. All blocks have progression and it cannot be turned off. Progression JSON will have to be edited manually for episode changes")
        .option("--endTime, <endTime>", "The end time of any procedural duration, this will be reset to the start time of the last block created if the start time exceeds this time")
        .option("--setShowDurations", "A utility to set the durations of each episode of each show LoadTitle listed using ffprobe to set accurate time by the second")
        .option("--setMovieDurations", "A utility to set the durations each movie LoadTitle listed using ffprobe to set accurate time by the second")
        .parse(process.argv);
    let options = commander.opts();
    if (!options.setShowDurations && !utilities.setMovieDurations) {
        if (options.blocks) {
            //check if block param is in correct format
            options.blocks.forEach(cand => {
                if (!(/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(cand))) {
                    throw new Error("Any blocks submitted must conform to the format of Title::UnixTimeStamp e.g. Toonami2k::1670191200 where Title is the title of the block you wish to create and Time is the time in 24 time for your system's local time. See the param --BlockList for all possible blocks available with their descriptions.");
                }
            })
        }

        if (options.movies && options.movies.length > 0) {
            //check if movie param is in correct format
            options.movies.forEach(cand => {
                if (!(/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(cand)) && !(/^[a-zA-Z0-9_]*$/gmi.test(cand))) {
                    throw new Error("Any movies submitted must conform to the format of LoadTitle or LoadTitle::UnixTimeStamp e.g. themummy::1670191200");
                }
            })
        }

        //TODO: Test this
        if (options.tagsAND) {
            options.tagsAND.forEach(tag => {
                if (!(/^(\([a-z0-9]+(?:,[a-z0-9]+)*\))$/gm.test(tag))) {
                    throw new Error("Each tag combo must be comma separated with no spaces e.g. scifi,80s,horror");
                }
            })
        }

        if (!(options.blocks || options.endTime)) {
            if (options.movies && options.movies.length > 0) {
                let hasScheduledMovies = false;
                options.movies.forEach(m => {
                    if (m.includes("::")) {
                        hasScheduledMovies = true;
                    }
                });
                if (hasScheduledMovies === false) {
                    throw new Error("The stream must be set up with a stream duration, a block or movie with a set time, or an end time");
                }

            } else {
                throw new Error("The stream must be set up with a stream duration, a block or movie with a set time, or an end time");
            }
        }
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