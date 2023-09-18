import { processCommandLineArgs } from "./src/saCommander";
import { constructStream } from "./src/streamConstructor";
import { Config } from "./models/config";
import { Promo } from "./models/promo";
import { Music } from "./models/music";
import { Commercial } from "./models/commercial";
import { Short } from "./models/short";
import { Episode } from "./models/show";
import { Movie } from "./models/movie";

import { processMediaWithDurationDetection } from "./tools/durationUtility";
import { loadMedia } from "./dataAccess/dataManager";
import { Media } from "./models/media";
import { createM3UFile, executeStream } from "./src/streamExecutor";
const config: Config = require('./config.json') as Config;

import { InputArgs } from "./models/inputArgs";
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3000;

const allowedFields = ['env', 'movies', 'tagsOR', 'endTime', 'startTime'];

const postValidationRules = [
	// Ensure only allowed fields are present
	(req: Request, res: Response, next: Function) => {
		const requestBody: Record<string, any> = req.body;

		const extraFields = Object.keys(requestBody).filter((field) => !allowedFields.includes(field));
		if (extraFields.length > 0) {
			return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
		}
		next();
	},

	// Validate the 'env' field
	body('env')
		.optional()
		.custom((value: string) => {
			if (value !== 'Default' && value !== 'FC') {
				throw new Error("Env must be values 'Default' or 'FC'");
			}
			return true;
		}),

	// Validate the 'movies' field
	body('movies')
		.optional()
		.isArray()
		.custom((value: string[]) => {
			for (const item of value) {
				if (typeof item !== 'string') {
					throw new Error('movies must be an array of strings');
				}
				console.log("Movie being checked: " + item);
				if (item.includes('::')) {
					console.log("Movie being spliced: " + item);
					const [firstPart, secondPart] = item.split('::');
					// Check the first part for only letters and numbers
					if (!/^[a-zA-Z0-9]+$/.test(firstPart)) {
						throw new Error('The first part of movies must contain only letters and numbers');
					}

					// Check the second part for ISO 8601 date format with 30-minute increments
					const isoDateRegex = /^(\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):(?:00|30))$/;
					if (!isoDateRegex.test(secondPart)) {
						throw new Error('The second part of movies must be in the format YYYY-MM-DDTHH:MM with 30-minute increments in 24-hour time');
					}
				} else {
					// If no "::" found, check for only letters and numbers
					if (!/^[a-zA-Z0-9]+$/.test(item)) {
						throw new Error('movies must be in the format "string" or "string::ISO8601 date" with allowed characters');
					}
				}
			}
			return true;
		}),

	// Validate the 'tagsOR' field
	body('tagsOR')
		.optional()
		.isArray()
		.withMessage('tagsOR must be an array')
		.custom((value: string[]) => {
			// Check if all elements in the array are strings
			for (const item of value) {
				if (typeof item !== 'string') {
					throw new Error('tagsOR must be an array of strings');
				}
			}
			return true;
		}),

	// Validate the 'endTime' field
	body('endTime')
		.optional()
		.custom((value: string) => {
			// Use a regular expression to match the desired format (YYYY-MM-DDTHH:MM)
			const regex = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):(?:00|30)$/


			if (!regex.test(value)) {
				throw new Error('endTime must be in the format YYYY-MM-DDTHH:MM in 24-hour time and a multiple of 30 minutes');
			}

			return true;
		}),

	// Validate the 'startTime' field
	body('startTime')
		.optional()
		.custom((value: string) => {
			// Use a regular expression to match the desired format (YYYY-MM-DDTHH:MM)
			const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

			if (!regex.test(value)) {
				throw new Error('startTime must be in the format YYYY-MM-DDTHH:MM');
			}

			return true;
		}),
];

app.use(express.json());

app.post('/api/startStream', postValidationRules, (req: Request, res: Response) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	let args: InputArgs = mapRequestToInputArgs(req);

	const media: Media = loadMedia(config);

	let stream: [string[], (Promo | Music | Commercial | Short | Episode | Movie)[]] = constructStream(config, args, media);
	// convert stream to m3u file
	createM3UFile(stream[0], config.destinationFolder, config.playlistName);
	// execute stream
	executeStream(config.vlcLocation, config.destinationFolder, config.playlistName);
	console.log(stream);

	res.json({ stream: stream[0] });
});

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Welcome to your API!' });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

function convertISOToUnix(isoDateTime: string): number {
	// Convert ISO 8601 date-time to Unix timestamp in seconds
	return Math.floor(new Date(isoDateTime).getTime() / 1000);
}

export function mapRequestToInputArgs(req: Request): InputArgs {
	const { env, movies, tagsOR, endTime, startTime } = req.body;

	// Map env directly
	const inputArgs: InputArgs = { env };

	// Map tagsOR directly
	if (tagsOR) {
		inputArgs.tagsOR = tagsOR;
	}

	// Convert and map endTime and startTime to Unix timestamps
	if (endTime) {
		inputArgs.endTime = convertISOToUnix(endTime);
	}
	if (startTime) {
		inputArgs.startTime = convertISOToUnix(startTime);
	}

	// Map movies with date conversion
	if (movies && Array.isArray(movies)) {
		inputArgs.movies = movies.map((movie) => {
			const [firstPart, secondPart] = movie.split('::');
			if (secondPart) {
				// If "::" delimiter exists, convert the second part (ISO date) to Unix timestamp
				const unixTimestamp = convertISOToUnix(secondPart);
				// Rejoin the parts with "::" and the Unix timestamp
				return `${firstPart}::${unixTimestamp}`;
			} else {
				// No "::" delimiter, pass through the original string
				return movie;
			}
		});
	}

	return inputArgs;
}

// async function main(): Promise<void> {
// 	const media: Media = loadMedia(config);

// 	//Get user selection
// 	let options: CommandLineArgs = processCommandLineArgs();
// 	console.log(options);
// 	if (options.durEval) {
// 		await processMediaWithDurationDetection(config, media, options.durEval)
// 	} else {
// 		let stream: [string[], (Promo | Music | Commercial | Short | Episode | Movie)[]] = constructStream(config, options, media);
// 		// convert stream to m3u file
// 		createM3UFile(stream[0], config.destinationFolder, config.playlistName);
// 		// execute stream
// 		executeStream(config.vlcLocation, config.destinationFolder, config.playlistName);
// 		console.log(stream);
// 	}
// }
