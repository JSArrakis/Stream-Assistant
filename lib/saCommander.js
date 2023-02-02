'use strict';
import { option, opts } from "commander";

const validateBlock = (block) => {
    if (!(/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(block))) {
        throw new Error("Any blocks submitted must conform to the format of Title::UnixTimeStamp e.g. Toonami2k::1670191200 where Title is the title of the block you wish to create and Time is the time in 24 time for your system's local time. See the param --BlockList for all possible blocks available with their descriptions.");
    }
};

const validateMovie = (movie) => {
    if (!(/^[a-zA-Z0-9_]*::[0-9]*$/gmi.test(movie)) && !(/^[a-zA-Z0-9_]*$/gmi.test(movie))) {
        throw new Error("Any movies submitted must conform to the format of LoadTitle or LoadTitle::UnixTimeStamp e.g. themummy::1670191200");
    }
};

const validateTag = (tag) => {
    if (!(/^(\([a-z0-9]+(?:,[a-z0-9]+)*\))$/gm.test(tag))) {
        throw new Error("Each tag combo must be comma separated with no spaces e.g. scifi,80s,horror");
    }
};

/**
 * @returns {Command} //Object containing nullable parameters of user entered values.
 * @typedef {object} Command
 * @param {string|undefined} env Environment which the stream is being run.
 * @param {Array.<string>|undefined} movies List of movies to select for stream construction. No spaces in name. Either this option --shows or --tags is required.
 * @param {Array.<string>|undefined} tagsOR List of tags to select for stream construction. No spaces in tag genre.
 * @param {Array.<string>|undefined} tagsAND The same functionality as the tagsOR argument, however tags are an AND operator, not an OR.
 * @param {Array.<string>|undefined} blocks This creates a specific block based on preset collection blocks created by the author. See documentation for details. All blocks have progression and it cannot be turned off. Progression JSON will have to be edited manually for episode changes.
 * @param {Array.<string>|undefined} endTime The end time of any procedural duration, this will be reset to the start time of the last block created if the start time exceeds this time.
 */
export function parseCommandLineArgs() {
    option("--env, <env>", "Environment which the stream is being run")
        .option("--movies, <movies...>", "List of movies to select for stream construction. No spaces in name. Either this option --shows or --tags is required")
        .option("--tagsOR, <tagsOR...>", "List of tags to select for stream construction. No spaces in tag genre")
        .option("--tagsAND, <tagsAND...>", "The same functionality as the tagsOR argument, however tags are an AND operator, not an OR")
        .option("--blocks, <blocks...>", "This creates a specific block based on preset collection blocks created by the author. See documentation for details. All blocks have progression and it cannot be turned off. Progression JSON will have to be edited manually for episode changes")
        .option("--endTime, <endTime>", "The end time of any procedural duration, this will be reset to the start time of the last block created if the start time exceeds this time")
        .parse(process.argv);
    let options = opts();
    if (options.blocks) {
        options.blocks.forEach(validateBlock);
    }

    if (options.movies && options.movies.length > 0) {
        options.movies.forEach(validateMovie);
    }

    if (options.tagsAND) {
        options.tagsAND.forEach(validateTag);
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
    return opts();
}