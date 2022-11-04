'use strict';
const fs = require("fs");
const config = require("./config.json");
const dirMan = require("./lib/directoryManager.js");
const saCommander = require("./lib/saCommander.js");
const streamConstructor = require("./lib/streamConstructor.js")

const main = async () => {
	//Create Commandline Options
	var options = saCommander.parseCommandLineArgs();
	let playlistFileName = config.PlaylistName;
	let destinationDirectory = options.test ? config.TestFolder : config.DestinationFolder; //Directory in which to 
	//place all files created by Stream Assistant 

	//If result comes back false, do nothing, otherwise proceed.
	if (await dirMan.manageDestinationDirectory(config, destinationDirectory, options)) {

		//TODO: Create progression option for non collection block shows
		//TODO: Optional: I need to know what era the playlist shows represent (based on cross section of metadata 
		//stored on each show object)
		//TODO: Optional: I need to know the weight of number of episodes of each series for proper number of 
		//episodes per stream(metadata makes this easier)
		let stream = streamConstructor.constructStream(config, destinationDirectory, options);

		dirMan.createStreamFile(destinationDirectory, playlistFileName, stream);

		//TODO: Create output text (possibly in file) ready to copy and paste into Discord for easy stream 
		//announcements

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
