import { processCommandLineArgs } from "./src/saCommander";
import { constructStream } from "./src/streamConstructor";
// import { executeStream } from "./src/streamExecutor";
import { Config } from "./models/config";
import { Promo } from "./models/promo";
import { Music } from "./models/music";
import { Commercial } from "./models/commercial";
import { Short } from "./models/short";
import { Episode } from "./models/show";
import { Movie } from "./models/movie";
import { CommandLineArgs } from "./models/commandLineArgs";
import { processMediaWithDurationDetection } from "./tools/durationUtility";
import { loadMedia } from "./dataAccess/dataManager";
import { Media } from "./models/media";
import { createM3UFile, executeStream } from "./src/streamExecutor";


const config: Config = require('./config.json') as Config;

async function main(): Promise<void> {
	const media: Media = loadMedia(config);

	//Get user selection
	let options: CommandLineArgs = processCommandLineArgs();
	console.log(options);
	if (options.durEval) {
		await processMediaWithDurationDetection(config, media, options.durEval)
	} else {
		let stream: [string[], (Promo | Music | Commercial | Short | Episode | Movie)[]] = constructStream(config, options, media);
		// convert stream to m3u file
		createM3UFile(stream[0], config.destinationFolder, config.playlistName);
		// execute stream
		executeStream(config.vlcLocation, config.destinationFolder, config.playlistName);
		console.log(stream);
	}
}

main();
