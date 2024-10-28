import { BaseMedia } from '../models/mediaInterface';
import { SegmentedTags } from '../models/segmentedTags';
import { AgeGroups } from "../models/const/ageGroups";
import * as core from './core';

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
        let ageGroups = core.getAgeGroupAdjacencyTags(tags.AgeGroupTags);
        ageGroups.forEach((age) => {
            sumDuration = core.sumMediaDuration(selectedMedia);
            if (sumDuration < duration) {
                if (hasSpecialtyTags || hasGenreTags) {
                    const mediaByTags = getMediaByTagHeriarchy(contextAlreadySelectedMedia, age, media, tags, duration);
                    selectedMedia.push(...mediaByTags);
                    contextAlreadySelectedMedia.push(...mediaByTags);
                } else if (hasEraTags) {
                    const mediaByEra = core.getMediaByAgeAndEra(media, tags.EraTags, age);
                    selectedMedia.push(...mediaByEra);
                    contextAlreadySelectedMedia.push(...mediaByEra);
                } else {
                    const mediaByAge = core.getMediaByAge(media, age);
                    selectedMedia.push(...mediaByAge);
                    contextAlreadySelectedMedia.push(...mediaByAge);
                }
            }
        });
    }

    sumDuration = core.sumMediaDuration(selectedMedia);
    if (sumDuration < duration) {
        if (hasSpecialtyTags || hasGenreTags) {
            const mediaByTags = getMediaByTagHeriarchy(contextAlreadySelectedMedia, AgeGroups.AllAges, media, tags, duration);
            selectedMedia.push(...mediaByTags);
            contextAlreadySelectedMedia.push(...mediaByTags);
        } else if (hasEraTags) {
            const mediaByEra = core.getMediaByAgeAndEra(media, tags.EraTags, AgeGroups.AllAges);
            selectedMedia.push(...mediaByEra);
            contextAlreadySelectedMedia.push(...mediaByEra);
        } else {
            const mediaByAge = core.getMediaByAge(media, AgeGroups.AllAges);
            selectedMedia.push(...mediaByAge);
            contextAlreadySelectedMedia.push(...mediaByAge);
        }
    }

    return selectedMedia;
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
        const tagGroupMedia = core.getMediaByTagGroupHeirarchy(
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
        sumDuration = core.sumMediaDuration(selectedMedia);
        if (sumDuration < duration) {
            const tagGroupMedia = core.getMediaByTagGroupHeirarchy(
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

