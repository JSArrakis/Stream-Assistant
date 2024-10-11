import { Media } from "../models/media";
import { Config } from '../models/config';
import * as db from '../db/db';
import { SetEnvConfig } from './environmentManager';
import { StreamType } from '../models/enum/streamTypes';
import { IStreamRequest } from '../models/streamRequest';
import { BaseMedia } from '../models/mediaInterface';
import { SegmentedTags } from '../models/segmentedTags';
import { AgeGroups } from "../models/const/ageGroups";


let media = new Media([], [], [], [], [], [], [], [], []);
let holidays: string[] = [];
let streamType: StreamType;
let config: Config;
let args: IStreamRequest
const categoryMap = new Map<number, string>([
    [0, "kids"],
    [1, "family"],
    [2, "youngadult"],
    [3, "mature"],
])

const categoryIndexMap = new Map<string, number>([
    ["kids", 0],
    ["family", 1],
    ["youngadult", 2],
    ["mature", 3],
])

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
        DefaultPromos: await db.LoadDefaultPromos(),
        Commercials: await db.LoadCommercials(),
        DefaultCommercials: await db.LoadDefaultCommercials(),
        Collections: []
    }

    // Load default environment
    SetEnvConfig(await db.GetDefaultEnvConfig(config.DefaultPromo));
}

export function getMedia(): Media {
    // All available media entries are loaded on service start up, this just returns the loaded media
    return media;
}

// This function is used to select buffer media based on the tags of the adjacent media.
// Adjacent media is determined by the half way point of the duration of the buffer. The duration associated with
// this function is based on one half or the other of the entire buffer duration. This function will select media
// based on the tags of the adjacent media, either the media that played before or the media that will play after, 
// depending on the which half of the buffer THIS instance is.

// Heirarchy of Tag Importance: AgeGroup > Specialty > Genre > Era

// This is a very opinionated selection function based on how we as humans consume media and how we associate 
// media with eachother. 

// It is important to understand how the tags are associated with eachother and how they
// associate with media in general. In Kaleidoscope, there are four types of tags: AgeGroup, 
// Specialty, Genre, and Era.

// - AgeGroup is the most important tag as it is the most defining tag for media consumption.
// Age group is more or less the original MPAA rating system for media: G, PG, PG-13, R, NC-17, however
// we have named these tags differently to express a broader understanding and 'vibe' of the age group. Kids would be G, Family
// would be PG, Young Adult would be PG-13, and Mature would be R or NC-17. If the adjacent media is tagged with an
// age group of Kids, or Family, then we will automatically filter out any buffer media that is not Kids or Family respectively. 
// This also includes media that does not have an age group as to ensure the flow and thematic consistency of the buffer media.
// It is better to play a buffer that caters thematically to the age group of Kids if the adjacent media was Blues Clues. We however
// allow for buffer media that is tagged with a lower age group than the highest age group tag in the adjacent media. For instance
// if the adjacent media is tagged with Young Adult, we could play buffer media that is tagged with Family or Kids, but we would not
// play buffer media that is tagged with Mature. Remember, on broadcast TV. We will also allow for unttaged buffer media to be played
// for Young Adult and Mature age groups as to not limit the selection of media too much.

// - Specialty tags are tags that are more targetted toward specific media. For instance tags like "starwars", "jurrassicpark" or 
// "halloween" would be a specialty tags. These specialty tags are treated as concrete descriptors of associated media, and when 
// using them one would not need to compare against normal genre tags: "starwars" is known to be the genre tags of "scifi" and 
// "adventure", "jurrassicpark" is known to be the genre tag of "action" and possibly "scifi" so when considering those tags, we 
// could ignore the genre tags entirely and just use the specialty tag directly to find media that is directly associated, especially 
// because you would want Jurrassic Park associated buffer media to play when the adjacent media is Jurassic Park. Specialty 
// tags like "halloween", "christmas", etc will only be considered if the user has specifically selected them as a tag with the stream
// request. If the user has not selected any holiday specialty tags, then we will ignore them entirely. It is unlikely that a user
// will use specialty tags at all, excepting power users who are looking to curate a very specific experience.

// - Genre tags are the most common tags that are used to describe media. I have boiled them down to what I describe as 'atomic' genres,
// that is to say that they are the most basic and fundamental genres that can be used to describe media and can stand along without a secondary
// genre to describe the media. The full list of genre tags are: "Action", "Adventure", "Comedy", "Crime", "Documentary", "Drama",
// "Fantasy", "Horror", "Musical", "Mystery", "SciFi", "War", "Western". Each of thes genres selected very distinct thematic elements that can be
// combined to create a more complex genre. For instance, "Space Opera" would be a combination of "SciFi" and "Adventure", or "Noir" would be a
// combination of "Mystery" and "Crime". It is unlikely that commercials will be tagged with genre tags, but it is possible that they could be
// given a user that is looking to curate a very specific experience. For instance, a trailer for Empire Strikes Back could be tagged with "SciFi"
// and "Adventure" as well as "StarWars" by a user if they wanted that commercial to play when the adjacent media is a SciFi or Adventure movie.
// If there are 3 or less genre tags, then we will consider them as a group and try to find media that matches all of the genre tags, and then attempting
// to find media that matches smaller groups of the genre tags. We will then select media that matches the most of the genre tags until the duration is filled.
// If there are more than 3 genre tags, then we will consider them as individual tags and select media that matches any of the genre tags. This is due to possible
// performance concerns as the multiples of combinations of genre tags
// could be very large and could slow down the selection process. It is also unlikely that most media would be defined by more than 3 genre tags, and ones that
// would be could be broad enough to match anything that shares any of it's genre tags.

// - Era tags are the least important tags, but are still useful for finding media that is associated with a specific time period to keep the thematic
// consistency of the buffer media. Era tags are tags that describe the time period that the media was created in by 10 year increments as humans tend to
// group media by decade. The era tags begin with "1930s" and currently end with "2050s" just for a nice buffer of years for future proofing. If the adjacent media
// is tagged with an era tag, then we will try to filter down any selection of buffer media to only media that is tagged with the same era tag. We will then
// re-add media that is untagged or with any other era tag if there is not enough media to fill the duration.

// It is unlikely that most Commercials and Music Videos will be tagged with anything more than an era tag, and possibly an age group tag, especially in the case of 
// commercials, when considering breakfast cereals or toys. However Shorts would conform to this model, and we would want to give the user the ability to curate
// a very specific experience if they so choose.
export function getMediaByAgeGroupHierarchy(
    media: BaseMedia[],
    alreadySelectedMedia: BaseMedia[],
    tags: SegmentedTags,
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = 0;

    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);

    let hasAgeGroupTags = tags.AgeGroupTags.length > 0;
    let hasSpecialtyTags = tags.SpecialtyTags.length > 0;
    let hasGenreTags = tags.GenreTags.length > 0;
    let hasEraTags = tags.EraTags.length > 0;

    if (hasAgeGroupTags) {
        let ageGroups = getAgeGroupAdjacencyTags(tags.AgeGroupTags);
        ageGroups.forEach((age) => {
            sumDuration = sumMediaDuration(selectedMedia);
            if (sumDuration < duration) {
                if (hasSpecialtyTags || hasGenreTags) {
                    const mediaByTags = getMediaByTagHeriarchy(contextAlreadySelectedMedia, age, media, tags, duration);
                    selectedMedia.push(...mediaByTags);
                    contextAlreadySelectedMedia.push(...mediaByTags);
                } else if (hasEraTags) {
                    const mediaByEra = getMediaByAgeAndEra(media, tags.EraTags, age);
                    selectedMedia.push(...mediaByEra);
                    contextAlreadySelectedMedia.push(...mediaByEra);
                } else {
                    const mediaByAge = getMediaByAge(media, age);
                    selectedMedia.push(...mediaByAge);
                    contextAlreadySelectedMedia.push(...mediaByAge);
                }
            }
        });
    }

    sumDuration = sumMediaDuration(selectedMedia);
    if (sumDuration < duration) {
        if (hasSpecialtyTags || hasGenreTags) {
            const mediaByTags = getMediaByTagHeriarchy(contextAlreadySelectedMedia, AgeGroups.AllAges, media, tags, duration);
            selectedMedia.push(...mediaByTags);
            contextAlreadySelectedMedia.push(...mediaByTags);
        } else if (hasEraTags) {
            const mediaByEra = getMediaByAgeAndEra(media, tags.EraTags, AgeGroups.AllAges);
            selectedMedia.push(...mediaByEra);
            contextAlreadySelectedMedia.push(...mediaByEra);
        } else {
            const mediaByAge = getMediaByAge(media, AgeGroups.AllAges);
            selectedMedia.push(...mediaByAge);
            contextAlreadySelectedMedia.push(...mediaByAge);
        }
    }

    return selectedMedia;
}

export function getMediaByAgeAndEra(media: BaseMedia[], eras: string[], age: string): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];

    eras.forEach((era) => {
        selectedMedia.push(...media.filter((m) => {
            return m.Tags.includes(era) && m.Tags.includes(age);
        }));
    });

    return selectedMedia
}

export function getMediaByTagHeriarchy(
    alreadySelectedMedia: BaseMedia[],
    age: string, media: BaseMedia[],
    segmentedTags: SegmentedTags,
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = 0;
    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);
    // 1. Get enough media to fill the duration: Specialty Tag Chain
    // TODO: Will users ever segment a specialty tag by using genre tags?
    // Can we think of media where that would be true, considering a specialty
    // tag is anything a user enters as a tag that is not one of the genre tags, and 
    // usually things like star wars, jurassic park, etc are pretty insular in their themeing?
    // Does this even matter for the buffer media?
    if (segmentedTags.SpecialtyTags.length > 0) {
        const tagGroupMedia = getMediaByTagGroupHeirarchy(
            contextAlreadySelectedMedia,
            media,
            segmentedTags.SpecialtyTags,
            segmentedTags.EraTags,
            age,
            duration);
        selectedMedia.push(...tagGroupMedia);
        contextAlreadySelectedMedia.push(...tagGroupMedia);
    }

    // 2. If there is not enough media to fill the duration: Genre Tag Chain
    if (segmentedTags.GenreTags.length > 0) {
        sumDuration = sumMediaDuration(selectedMedia);
        if (sumDuration < duration) {
            const tagGroupMedia = getMediaByTagGroupHeirarchy(
                contextAlreadySelectedMedia,
                media,
                segmentedTags.GenreTags,
                segmentedTags.EraTags,
                age,
                duration);
            selectedMedia.push(...tagGroupMedia);
            contextAlreadySelectedMedia.push(...tagGroupMedia);
        }
    }
    return selectedMedia;
}

export function getMediaByAge(media: BaseMedia[], age: string): BaseMedia[] {
    return media.filter((m) => m.Tags.includes(age));
}

export function sumMediaDuration(media: BaseMedia[]): number {
    return media.reduce((acc, val) => acc + val.Duration, 0);
}

export function createTagGroups(tags: string[]): string[][] {
    let biGenreGroups: string[][] = [];
    // Create groups of 2 genre tags
    for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
            biGenreGroups.push([tags[i], tags[j]]);
        }
    }
    return biGenreGroups;
}

export function getInEraMedia(
    media: BaseMedia[],
    eraTags: string[],
    tags: string[]): BaseMedia[] {
    let inEra: BaseMedia[] = [];
    eraTags.forEach((era) => {
        // Get all media that contains all of the tags and the era tag
        let inEraMedia = media.filter((m) => {
            return tags.every((tag) =>
                m.Tags.includes(tag)
            ) && m.Tags.includes(era);
        });
        inEra.push(...inEraMedia);
    });
    return inEra;
}

export function getOutOfEraMedia(
    media: BaseMedia[],
    eraTags: string[],
    tags: string[]): BaseMedia[] {
    // Get all media that contains all of the tags and does not contain any of the era tags
    return media.filter((m) => {
        return tags.every((tag) =>
            m.Tags.includes(tag)
        ) && !eraTags.some((tag) => m.Tags.includes(tag));
    });
}

export function getMediaWithEraConsiderations(
    alreadySelectedMedia: BaseMedia[],
    allTagMediaInEra: BaseMedia[],
    allTagMediaOutOfEra: BaseMedia[],
    eraTags: string[],
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    if (eraTags.length > 0) {
        selectedMedia.push(...fillMediaByEra(alreadySelectedMedia, allTagMediaInEra, allTagMediaOutOfEra, duration));
    } else {
        selectedMedia.push(...allTagMediaInEra.filter((m) => !alreadySelectedMedia.includes(m)));
    }

    return selectedMedia;
}

export function fillMediaByEra(
    alreadySelectedMedia: BaseMedia[],
    eraMedia: BaseMedia[],
    nonEraMedia: BaseMedia[],
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = eraMedia.filter((m) => !alreadySelectedMedia.includes(m));

    // If there is not enough media to fill the duration: Get all media that matches any era tags
    const sumDuration = sumMediaDuration(selectedMedia);
    if (sumDuration < duration) {
        selectedMedia.push(...nonEraMedia.filter((m) => !alreadySelectedMedia.includes(m)));
    }

    return selectedMedia;
}

export function getMediaByTags(
    media: BaseMedia[],
    tags: string[]): BaseMedia[] {
    return media.filter((m) => {
        return tags.every((tag) =>
            m.Tags.includes(tag)
        );
    });
}

export function getAllTagMedia(
    media: BaseMedia[],
    eraTags: string[],
    tags: string[]): { allTagMediaInEra: BaseMedia[], allTagMediaOutOfEra: BaseMedia[] } {
    let inEra: BaseMedia[] = [];
    let outOfEra: BaseMedia[] = [];
    if (eraTags.length > 0) {
        inEra.push(...getInEraMedia(media, eraTags, tags));
        outOfEra.push(...getOutOfEraMedia(media, eraTags, tags));
    } else {
        inEra.push(...getMediaByTags(media, tags));
    }
    return { allTagMediaInEra: inEra, allTagMediaOutOfEra: outOfEra };
}

export function getMediaByTagGroupHeirarchy(
    alreadySelectedMedia: BaseMedia[],
    media: BaseMedia[],
    selectedTags: string[],
    eraTags: string[],
    age: string,
    duration: number): BaseMedia[] {
    
    //Create a list of base media to put already selected media in and make it so when the list is added to it doesnt modify the original list
    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);
    
    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = duration
    // If there are 3 or less genre tags, create groups of genre tags in combinations of 2
    if (selectedTags.length <= 3) {
        // Create groups of 2 genre tags
        // a. Try to get media that matches all genre tags first
        const contextMedia = getContextMedia(
            contextAlreadySelectedMedia,
            media,
            selectedTags,
            eraTags,
            age,
            duration);
        selectedMedia.push(...contextMedia);
        contextAlreadySelectedMedia.push(...contextMedia);
        // b. If summed duration is still less than the duration, get media that matches all tags in each of the biGenreGroups
        // If there are only 2 genre tags, it is the same as the previous attempt to get media with all tags
        sumDuration = sumMediaDuration(selectedMedia);
        if (sumDuration < duration && selectedTags.length === 3) {
            let biTagGroups = createTagGroups(selectedTags);
            biTagGroups.forEach((tagGroup) => {
                const contextMedia = getContextMedia(
                    contextAlreadySelectedMedia,
                    media,
                    tagGroup,
                    eraTags,
                    age,
                    duration - sumDuration)
                selectedMedia.push(...contextMedia);
                contextAlreadySelectedMedia.push(...contextMedia);
            });
        }

        sumDuration = sumMediaDuration(selectedMedia);
        // c. If summed duration is still less than the duration, get media that matches any of the genre tags that have not already been added to the selected media list
        if (sumDuration < duration) {
            // We dont update the duration here for each loop because we want
            // and equal chance of selecting media that matches any of the tags
            // Including out of era media
            selectedTags.forEach((tag) => {
                const contextMedia = getContextMedia(
                    contextAlreadySelectedMedia,
                    media,
                    [tag],
                    eraTags,
                    age,
                    duration - sumDuration)
                selectedMedia.push(...contextMedia);
                contextAlreadySelectedMedia.push(...contextMedia);
            });
        }
    } else {
        // If there are more than 3 genre tags, get media that matches any of the genre tags
        selectedTags.forEach((tag) => {
            const contextMedia = getContextMedia(
                    contextAlreadySelectedMedia,
                    media,
                    [tag],
                    eraTags,
                    age,
                    duration - sumDuration)
            selectedMedia.push(...contextMedia);
            contextAlreadySelectedMedia.push(...contextMedia);
        });
    }
    return selectedMedia;
}

export function getContextMedia(
    alreadySelectedMedia: BaseMedia[],
    media: BaseMedia[],
    tags: string[],
    eraTags: string[],
    age: string,
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let allTagMediaInEra: BaseMedia[] = []
    let allTagMediaOutOfEra: BaseMedia[] = []
    let contextTags = [...tags, age];
    ({ allTagMediaInEra, allTagMediaOutOfEra } = getAllTagMedia(media, eraTags, contextTags));
    selectedMedia.push(
        ...getMediaWithEraConsiderations(
            alreadySelectedMedia,
            allTagMediaInEra,
            allTagMediaOutOfEra,
            eraTags,
            duration));
    return selectedMedia;
}

export function getAgeGroupAdjacencyTags(tags: string[]): string[] {
    let adjacencyTags: string[] = [];
    tags.forEach((tag) => {
        if (tag === AgeGroups.Kids) {
            adjacencyTags.push(AgeGroups.Kids);
            adjacencyTags.push(AgeGroups.Family);
        }
        if (tag === AgeGroups.Family) {
            adjacencyTags.push(AgeGroups.Family);
            adjacencyTags.push(AgeGroups.Kids);
            if (!tags.includes(AgeGroups.Kids)) {
                adjacencyTags.push(AgeGroups.YoungAdult);
            }
        }
        if (tag === AgeGroups.YoungAdult) {
            adjacencyTags.push(AgeGroups.YoungAdult);
            adjacencyTags.push(AgeGroups.Family);
            if (!tags.includes(AgeGroups.Family)) {
                adjacencyTags.push(AgeGroups.Mature);
            }
        }
        if (tag === AgeGroups.Mature) {
            adjacencyTags.push(AgeGroups.Mature);
            adjacencyTags.push(AgeGroups.YoungAdult);
        }
    });
    return adjacencyTags.filter((tag, index) => adjacencyTags.indexOf(tag) === index);
}

export function getHighestAgeGroupTag(tags: string[]): string {
    // Mature > Young Adult > Family > Kids
    if (tags.includes(AgeGroups.Mature)) {
        return AgeGroups.Mature;
    } else if (tags.includes(AgeGroups.YoungAdult)) {
        return AgeGroups.YoungAdult;
    } else if (tags.includes(AgeGroups.Family)) {
        return AgeGroups.Family;
    } else {
        return AgeGroups.Kids;
    }
}