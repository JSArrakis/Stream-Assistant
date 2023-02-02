'use strict';
const dirMan = require("./directoryManager.js");
const { getVideoDurationInSeconds } = require('get-video-duration')

exports.clipSelector = (path, type) => {
    let clipList = [];
    let clipFolders = dirMan.getDirectoryItems(path)
    clipFolders.forEach(folder => {
        let clipNames = dirMan.getDirectoryItems(path + folder);
        clipNames.forEach(name => {
            let clip = {
                "path": path + folder + "\\" + name,
                "type": type,
                "duration": parseInt(folder)
            }
            clipList.push(clip);
        });
    });
    return clipList
}

exports.setMovieDurations = async (movieList, targetMovies) => {
    for await (var targetLoadTitle of targetMovies) {
        let foundMovies = movieList.filter(item => item.LoadTitle === targetLoadTitle);
        if (foundMovies.length > 0) {
            for await (var movie of foundMovies) {
                console.log(movie.Title);
                console.log(movie.MoviePath);
                let duration = await getVideoDurationInSeconds(movie.MoviePath);
                console.log(duration);
            }
        } else {
            console.log("Load Title " + targetLoadTitle + " does not exist, check your spelling.")
        }
    }
}

exports.setEpisodeDurations = async (showList, targetShows) => {
    for await (var targetLoadTitle of targetShows) {
        let foundShows = showList.filter(item => item.LoadTitle === targetLoadTitle);
        if (foundShows.length > 0) {
            for await (var show of showList.filter(item => item.LoadTitle === targetLoadTitle)) {
                console.log(show.Title);
                for await (var episode of show.Episodes) {
                    console.log(episode.EpisodeTitle);
                    await getVideoDurationInSeconds(episode.EpisodePath).then((duration) => {
                        episode.Duration = Math.round(duration);
                    });
                }
            }
        } else {
            console.log("Load Title " + targetLoadTitle + " does not exist, check your spelling.")
        }
    }
}

exports.getEnvironment = (options, environs) => {
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