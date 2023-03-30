'use strict';
const fs = require("fs");
const config = require("./config.json");
const dirMan = require("./lib/directoryManager.js");
const saCommander = require("./lib/saCommander.js");
const streamConstructor = require("./lib/streamConstructordeprecated.js");
const movieList = require("./data/movieList.json");
const showList = require("./data/showList.json");
const shortList = require("./data/shortList.json");
const commercialList = require("./data/commercialList.json");
const musicList = require("./data/musicList.json");
const { getVideoDurationInSeconds } = require('get-video-duration');


const main = async () => {
	//Create Commandline Options
	var options = saCommander.parseCommandLineArgs();
	let playlistFileName = config.PlaylistName;
	let destinationDirectory = options.test ? config.TestFolder : config.DestinationFolder; //Directory in which to place all files created by Stream Assistant 
	if (options.setShowDurations
		|| options.setMovieDurations
		|| options.setShortDurations
		|| options.setCommercialDurations
		|| options.setMusicDurations) {

		if (options.setShowDurations) {
			var outputShowList = [];
			for await (var show of showList) {
				var outputShow = show;
				var outputEpisodeList = [];
				console.log("########### " + show.Title + " ###########")
				for await (var episode of show.Episodes) {
					await getVideoDurationInSeconds(episode.EpisodePath).then((duration) => {
						var ouputEpisode = episode;
						ouputEpisode.Duration = Math.round(duration);

						outputEpisodeList.push(ouputEpisode);
						console.log(ouputEpisode.EpisodeTitle);
					});
				}
				outputShow.Episodes = outputEpisodeList;
				outputShow.EpisodeCount = outputEpisodeList.length;
				outputShowList.push(outputShow);

			}
			dirMan.createOutputMediaListFile(config.DataFolder, outputShowList, "showList.json");
		}

		if (options.setMovieDurations) {
			var outputMovieList = [];
			for await (var movie of movieList) {
				await getVideoDurationInSeconds(movie.MoviePath).then((duration) => {
					var outputMovie = movie;
					outputMovie.Duration = Math.round(duration);

					var moduloResult = outputMovie.Duration % 1800;

					outputMovie.DurationLimit = outputMovie.Duration - moduloResult;

					if (moduloResult > 0) {
						outputMovie.DurationLimit = outputMovie.DurationLimit + 1800;
					}
					outputMovieList.push(outputMovie);
					console.log(outputMovie.Title);
				});
			}
			dirMan.createOutputMediaListFile(config.DataFolder, outputMovieList, "movieList.json");
		}

		if (options.setShortDurations) {
			var outputShortList = [];
			for await (var short of shortList) {
				await getVideoDurationInSeconds(short.path).then((duration) => {
					var outputShort = short;
					outputShort.duration = Math.round(duration);

					outputShortList.push(outputShort);
					console.log(outputShort.path);
				});
			}
			dirMan.createOutputMediaListFile(config.DataFolder, outputShortList, "shortList.json");
		}

		if (options.setCommercialDurations) {
			var outputCommercialList = [];
			for await (var commercial of commercialList) {
				await getVideoDurationInSeconds(commercial.path).then((duration) => {
					var outputCommercial = commercial;
					outputCommercial.duration = Math.round(duration);

					outputCommercialList.push(outputCommercial);
					console.log(outputCommercial.path);
				});
			}
			dirMan.createOutputMediaListFile(config.DataFolder, outputCommercialList, "commercialList.json");
		}

		if (options.setMusicDurations) {
			var outputMusicList = [];
			for await (var music of musicList) {
				await getVideoDurationInSeconds(music.path).then((duration) => {
					var outputMusic = music;
					outputMusic.duration = Math.round(duration);

					outputMusicList.push(outputMusic);
					console.log(outputMusic.path);
				});
			}
			dirMan.createOutputMediaListFile(config.DataFolder, outputMusicList, "musicList.json");
		}

	} else if (await dirMan.manageDestinationDirectory(config, destinationDirectory, options)) {
		let progression = [];

		if (dirMan.directoryExists(destinationDirectory + "progression.json")) {
			progression = JSON.parse(dirMan.readFile(destinationDirectory + "progression.json"));
		}

		let stream = await streamConstructor.constructStream(config, getEnvironment(options, environs), destinationDirectory, options, progression);

		dirMan.createStreamFile(destinationDirectory, playlistFileName, stream);

		saCommander.executeStream(config, destinationDirectory, playlistFileName);

		if (options.test) {
			console.log("Hope you meant to have testing enabled. Womp womp.");
		}

	} else {
		console.log("STREAM ASSISTANT DIDN'T DO ANYTHING! Assistant has already been ran for the current date.");
		console.log("If this is a mistake or you screwed up, guess you have to fix it manually. -- Love your Past Self");
	}

}

main();
