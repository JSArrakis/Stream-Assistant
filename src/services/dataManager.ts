import * as fs from 'fs';
import { Media } from "../models/media";
import { TranslationTag } from "../models/translationTag";
import { Config } from '../models/config';
import { SetProgression } from './progressionManager';
import * as db from '../db/db';
import { SetEnvConfig } from './environmentManager';

let media = new Media([], [], [], [], [], [], []);

export async function loadMedia(config: Config): Promise<void> {
    
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

    console.log("Loading progression from DB...")
    // Set the default environment
    SetEnvConfig(await db.GetDefaultEnvConfiguration())
    SetProgression(await db.LoadProgression());
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