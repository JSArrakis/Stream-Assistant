import * as fs from 'fs';
import { Media } from "../models/media";
import { TranslationTag } from "../models/translationTag";
import { Config } from '../models/config';
import * as db from '../db/db';
import { SetEnvConfig } from './environmentManager';
import { StreamType } from '../models/enum/streamTypes';
import { IStreamRequest } from '../models/streamRequest';

let media = new Media([], [], [], [], [], [], []);
let streamType: StreamType;
let config: Config;
let args: IStreamRequest

export function setConfig(value: Config): void {
    console.log("Setting config to: ", value);
    config = value;
    console.log("Config set to: ", config);
}

export function getConfig(): Config {
    return config;
}

export function setStreamType(value: StreamType): void {
    streamType = value;
}

export function getStreamType(): StreamType {
    return streamType;
}

export function setArgs(value: IStreamRequest): void {
    args = value;
}

export function getArgs(): IStreamRequest {
    return args;
}

export async function loadMedia(config: Config): Promise<void> {
    await db.CreateDefaultCommercials(config);
    await db.CreateDefaultPromo(config);

    console.log("Loading media entries from DB...")
    // TODO - Do a promise.all for all the load functions to speed up the process
    media = {
        Shows: await db.LoadShows(),
        Movies: await db.LoadMovies(),
        Shorts: await db.LoadShorts(),
        Music: await db.LoadMusic(),
        Promos: await db.LoadPromos(),
        Commercials: await db.LoadCommercials(),
        Collections: []
    }

    // Load default environment
    SetEnvConfig(await db.GetDefaultEnvConfig(config.DefaultPromo));
}

export function getMedia(): Media {
    // All available media entries are loaded on service start up, this just returns the loaded media
    return media;
}

export function loadTranslationTags(filePath: string): TranslationTag[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const translationTags: TranslationTag[] = jsonParsed.map((item: any) => {
            return new TranslationTag(
                item.Tag,
                item.Translation
            );
        });

        return translationTags;
    } catch (error) {
        throw new Error(`Error loading translation tags from JSON file ${filePath}: ${error}`);
    }
}