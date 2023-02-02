import config from "./config.json";
import { parseCommandLineArgs } from "./lib/saCommander";
import { executeStream } from "./lib/streamExecutor";
import * as dirMan from "./lib/directoryManager"

interface Config {
	vlcLocation: string;
	destinationFolder: string;
	testFolder: string;
	dataFolder: string;
	playlistName: string;
}

const typedConfig: Config = config;

async function main(): Promise<void> {


	//Get user selection
	let options = parseCommandLineArgs();

	//Get progression
	let progression = [];
	if (dirMan.directoryExists(config.destinationFolder + "progression.json")) {
		progression = JSON.parse(dirMan.readFile(config.destinationFolder + "progression.json"));
	}

	//Create Stream

	//Create Stream File

	//Execute Stream
	executeStream(config.vlcLocation, config.destinationFolder, config.playlistName);

}

main();
