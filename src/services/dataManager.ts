import * as fs from 'fs';
import { Short } from "../models/short";
import { Media } from "../models/media";
import { MediaProgression, ShowProgression } from "../models/mediaProgression";
import { TranslationTag } from "../models/translationTag";
import { Config } from '../models/config';
import { Movie } from '../models/movie';
import { Commercial } from '../models/commercial';
import { Music } from '../models/music';
import { Promo } from '../models/promo';
import { Episode, Show } from '../models/show';
const progression = require('../../data/progression.json');
const transaltionTags = require('../../data/translationTags.json');

let media = new Media([], [], [], [], [], [], []);

export function loadMedia(config: Config): void {
    console.log("Loading media from JSON files...")
    media = {
        Shows: loadShowsFromJsonFile(config.dataFolder + 'showsList.json'),
        Movies: loadMoviesFromJsonFile(config.dataFolder + 'moviesList.json'),
        Shorts: loadShortsFromJsonFile(config.dataFolder + 'shortsList.json'),
        Music: loadMusicFromJsonFile(config.dataFolder + 'musicList.json'),
        Promos: loadPromosFromJsonFile(config.dataFolder + 'promosList.json'),
        Commercials: loadCommercialsFromJsonFile(config.dataFolder + 'commercialsList.json'),
        Collections: []
    }
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

export function loadShowsFromJsonFile(filePath: string): Show[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);
        console.log("Loaded " + jsonParsed.length + " shows from JSON file " + filePath)
        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const shows: Show[] = jsonParsed.map((item: any) => {
            let episodes = item.Episodes.map((episode: any) => {
                let ep = new Episode(
                    episode.Season,
                    episode.Episode,
                    episode.EpisodeNumber,
                    episode.Path,
                    episode.Title,
                    episode.LoadTitle,
                    episode.Duration,
                    episode.DurationLimit,
                    episode.Tags
                );
                return ep;
            });

            return new Show(
                item.Title,
                item.LoadTitle,
                item.Alias,
                item.IMDB,
                item.DurationLimit,
                item.OverDuration,
                item.FirstEpisodeOverDuration,
                item.Tags,
                item.SecondaryTags,
                item.EpisodeCount,
                episodes);
        });

        return shows;
    } catch (error) {
        throw new Error(`Error loading shows from JSON file ${filePath}: ${error}`);
    }
}

export function loadMoviesFromJsonFile(filePath: string): Movie[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const movies: Movie[] = jsonParsed.map((item: any) => {
            return new Movie(
                item.Title,
                item.LoadTitle,
                item.Alias,
                item.IMDB,
                item.Tags,
                item.Path,
                item.Duration,
                item.DurationLimit,
                item.Collection,
                item.CollectionSequence);
        });

        return movies;
    } catch (error) {
        throw new Error(`Error loading movies from JSON file ${filePath}: ${error}`);
    }
}

export function loadShortsFromJsonFile(filePath: string): Short[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const shorts: Short[] = jsonParsed.map((item: any) => {
            return new Short(item.Title, item.Duration, item.Path, item.Type, item.Tags);
        });

        return shorts;
    } catch (error) {
        throw new Error(`Error loading shorts from JSON file ${filePath}: ${error}`);
    }
}

export function loadCommercialsFromJsonFile(filePath: string): Commercial[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const commercials: Commercial[] = jsonParsed.map((item: any) => {
            return new Commercial(item.Title, item.Duration, item.Path, item.Type, item.Tags);
        });

        return commercials;
    } catch (error) {
        throw new Error(`Error loading commercials from JSON file ${filePath}: ${error}`);
    }
}

export function loadMusicFromJsonFile(filePath: string): Music[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const music: Music[] = jsonParsed.map((item: any) => {
            return new Music(item.Title, item.Path, item.Duration, item.Type, item.Tags);
        });

        return music;
    } catch (error) {
        throw new Error(`Error loading music from JSON file ${filePath}: ${error}`);
    }
}

export function loadPromosFromJsonFile(filePath: string): Promo[] {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        const jsonParsed = JSON.parse(jsonString);

        // Validate that the JSON is an array
        if (!Array.isArray(jsonParsed)) {
            throw new Error('JSON data is not an array.');
        }

        // Map the JSON objects to Short instances
        const promos: Promo[] = jsonParsed.map((item: any) => {
            return new Promo(item.Title, item.Duration, item.Path, item.Type, item.Tags);
        });

        return promos;
    } catch (error) {
        throw new Error(`Error loading promos from JSON file ${filePath}: ${error}`);
    }
}