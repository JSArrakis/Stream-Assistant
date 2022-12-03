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

		//TODO: Get media durations programmatically from the file system v1.2
		let stream = streamConstructor.constructStream(config, destinationDirectory, options);

		dirMan.createStreamFile(destinationDirectory, playlistFileName, stream);

		//saCommander.executeStream(config, destinationDirectory, playlistFileName);

		if (options.test) {
			// console.log("Hope you meant to have testing enabled. Womp womp.");
		}
	} else {
		console.log("STREAM ASSISTANT DIDN'T DO ANYTHING! Assistant has already been ran for the current date.");
		console.log("If this is a mistake or you screwed up, guess you have to fix it manually. -- Love your Past Self");
	}

}

main();
