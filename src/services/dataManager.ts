import * as fs from 'fs';
import { Media } from "../models/media";
import { MediaProgression, ShowProgression } from "../models/mediaProgression";
import { TranslationTag } from "../models/translationTag";
import { Config } from '../models/config';
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

    // Load default environment
    SetEnvConfig(await db.GetDefaultEnvConfig(config.DefaultPromo));
}

export function getMedia(): Media {
    // All available media entries are loaded on service start up, this just returns the loaded media
    return media;
}

export function loadProgression(filePath: string): MediaProgression[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }


        const mediaProgression: MediaProgression[] = jsonParsed.map((item: any) => {
            let progShows = item.Shows.map((showprog: any) => {
                return new ShowProgression(
                    showprog.LoadTitle,
                    showprog.Episode
                );
            });
            return new MediaProgression(
                item.Title,
                item.Type,
                progShows
            );
        });

        if (mediaProgression.filter(prog => prog.Title === "Main").length === 0) {
            mediaProgression.push(new MediaProgression("Main", "Main", []))
        }

        return mediaProgression;
    } catch (error) {
        throw new Error(`Error loading translation tags from JSON file ${filePath}: ${error}`);
    }
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