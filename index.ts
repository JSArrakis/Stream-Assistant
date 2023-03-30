import { parseCommandLineArgs } from "./lib/saCommander";
import { constructStream } from "./lib/streamConstructor";
import { executeStream } from "./lib/streamExecutor";
import { Config } from "./models/config";

const config: Config = require('./config.json') as Config;

async function main(): Promise<void> {


	//Get user selection
	let options = parseCommandLineArgs();

	//Create Stream Array
	let stream: string[] = constructStream(config, options)
	//Create Stream File from Stream Array

	//Execute Stream
	executeStream(config.vlcLocation, config.destinationFolder, config.playlistName);

}

main();
