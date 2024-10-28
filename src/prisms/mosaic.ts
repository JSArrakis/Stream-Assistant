import { BaseMedia } from '../models/mediaInterface';
import { SegmentedTags } from '../models/segmentedTags';
import { AgeGroups } from "../models/const/ageGroups";
import * as core from './core';
import { Mosaic } from '../models/mosaic';
import { createMosaicKey } from '../utils/utilities';

export function getMediaByMosaicTags(
    media: BaseMedia[],
    alreadySelectedMedia: BaseMedia[],
    tags: SegmentedTags,
    mosaics: Mosaic[],
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
                    const mediaByTags = getMediaBySpecialtyOrMosaicHeriarchy(contextAlreadySelectedMedia, age, media, tags, mosaics,  duration);
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
            const mediaByTags = getMediaBySpecialtyOrMosaicHeriarchy(contextAlreadySelectedMedia, AgeGroups.AllAges, media, tags, mosaics, duration);
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

export function getMediaBySpecialtyOrMosaicHeriarchy(
    alreadySelectedMedia: BaseMedia[],
    age: string,
    media: BaseMedia[],
    segmentedTags: SegmentedTags,
    mosaics: Mosaic[],
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = 0;
    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);
    // The reason order Specialty Tags + Genre Tags, Genre Tags, then Specialty Tags
    // is due to the nature of moasic tags which are musical signatures based on cinematic genre 
    // to musical genre mappings.

    // A thing to consider about certain movies is that they might share a specialty tag but not necessarily
    // share genre tags, for instance the movie Alien is a scifi horror movie, but the movie
    // Aliens is a scifi action horror movie. The differences in genre tags, even if some tags are shared, 
    // can change the appropriate musical vibe for the adjacent media.

    // Read more about mosaics here.
    // Link to mosaics docs ../docs/mosaics.md
    if (segmentedTags.SpecialtyTags.length > 0 && segmentedTags.GenreTags.length > 0) {
        sumDuration = core.sumMediaDuration(selectedMedia);
        if (sumDuration < duration) {
            const tagGroupMedia = getMediaByMosaicCombination(
                contextAlreadySelectedMedia,
                media,
                segmentedTags.SpecialtyTags,
                segmentedTags.GenreTags,
                segmentedTags.EraTags,
                mosaics,
                age,
                duration);
            selectedMedia.push(...tagGroupMedia);
            contextAlreadySelectedMedia.push(...tagGroupMedia);
        }
    }

    if (segmentedTags.GenreTags.length > 0) {
        sumDuration = core.sumMediaDuration(selectedMedia);
        if (sumDuration < duration) {
            const tagGroupMedia = getMediaByMosaicCombination(
                contextAlreadySelectedMedia,
                media,
                segmentedTags.SpecialtyTags,
                segmentedTags.GenreTags,
                segmentedTags.EraTags,
                mosaics,
                age,
                duration);
            selectedMedia.push(...tagGroupMedia);
            contextAlreadySelectedMedia.push(...tagGroupMedia);
        }
    }

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

    return selectedMedia;
}

export function getMediaByMosaicCombination(
    alreadySelectedMedia: BaseMedia[],
    media: BaseMedia[],
    specialtyTags: string[],
    genreTags: string[],
    eraTags: string[],
    mosaics: Mosaic[],
    age: string,
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = duration
    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);

    if (specialtyTags.length <= 2) {
        const tagGroupMedia = getMediaByTagGroupMosaic(
            contextAlreadySelectedMedia,
            media,
            specialtyTags,
            genreTags,
            eraTags,
            mosaics,
            age,
            duration);
        selectedMedia.push(...tagGroupMedia);
        contextAlreadySelectedMedia.push(...tagGroupMedia);

        sumDuration = core.sumMediaDuration(selectedMedia);
        if (sumDuration < duration) {
            specialtyTags.forEach((tag) => {
                const tagGroupMedia = getMediaByTagGroupMosaic(
                    contextAlreadySelectedMedia,
                    media,
                    [tag],
                    genreTags,
                    eraTags,
                    mosaics,
                    age,
                    duration - sumDuration);
                selectedMedia.push(...tagGroupMedia);
                contextAlreadySelectedMedia.push(...tagGroupMedia);
            });
        }
    } else {
        specialtyTags.forEach((tag) => {
            const tagGroupMedia = getMediaByTagGroupMosaic(
                contextAlreadySelectedMedia,
                media,
                [tag],
                genreTags,
                eraTags,
                mosaics,
                age,
                duration);
            selectedMedia.push(...tagGroupMedia);
            contextAlreadySelectedMedia.push(...tagGroupMedia);
        });
    }

    return selectedMedia;
}

export function getMediaByTagGroupMosaic(
    alreadySelectedMedia: BaseMedia[],
    media: BaseMedia[],
    specialtyTags: string[],
    genreTags: string[],
    eraTags: string[],
    mosaics: Mosaic[],
    age: string,
    duration: number): BaseMedia[] {

    //Create a list of base media to put already selected media in and make it so when the list is added to it doesnt modify the original list
    let contextAlreadySelectedMedia: BaseMedia[] = alreadySelectedMedia.map((m) => m);

    let selectedMedia: BaseMedia[] = [];
    let sumDuration: number = duration
    // If there are 3 or less genre tags, create groups of genre tags in combinations of 2
    if (genreTags.length <= 3) {
        // Create groups of 2 genre tags
        // a. Try to get media that matches all genre tags first
        const contextMedia = getMosaicMedia(
            contextAlreadySelectedMedia,
            media,
            specialtyTags,
            genreTags,
            mosaics,
            eraTags,
            age,
            duration);
        selectedMedia.push(...contextMedia);
        contextAlreadySelectedMedia.push(...contextMedia);
        // b. If summed duration is still less than the duration, get media that matches all tags in each of the biGenreGroups
        // If there are only 2 genre tags, it is the same as the previous attempt to get media with all tags
        sumDuration = core.sumMediaDuration(selectedMedia);
        if (sumDuration < duration && genreTags.length === 3) {
            let biTagGroups = core.createTagGroups(genreTags);
            biTagGroups.forEach((tagGroup) => {
                const contextMedia = getMosaicMedia(
                    contextAlreadySelectedMedia,
                    media,
                    specialtyTags,
                    genreTags,
                    mosaics,
                    eraTags,
                    age,
                    duration - sumDuration)
                selectedMedia.push(...contextMedia);
                contextAlreadySelectedMedia.push(...contextMedia);
            });
        }

        sumDuration = core.sumMediaDuration(selectedMedia);
        // c. If summed duration is still less than the duration, get media that matches any of the genre tags that have not already been added to the selected media list
        if (sumDuration < duration) {
            // We dont update the duration here for each loop because we want
            // and equal chance of selecting media that matches any of the tags
            // Including out of era media
            genreTags.forEach((tag) => {
                const contextMedia = getMosaicMedia(
                    contextAlreadySelectedMedia,
                    media,
                    specialtyTags,
                    genreTags,
                    mosaics,
                    eraTags,
                    age,
                    duration - sumDuration)
                selectedMedia.push(...contextMedia);
                contextAlreadySelectedMedia.push(...contextMedia);
            });
        }
    } else {
        // If there are more than 3 genre tags, get media that matches any of the genre tags
        genreTags.forEach((tag) => {
            const contextMedia = getMosaicMedia(
                contextAlreadySelectedMedia,
                media,
                specialtyTags,
                genreTags,
                mosaics,
                eraTags,
                age,
                duration - sumDuration)
            selectedMedia.push(...contextMedia);
            contextAlreadySelectedMedia.push(...contextMedia);
        });
    }
    return selectedMedia;
}

export function getMosaicMedia(
    alreadySelectedMedia: BaseMedia[],
    media: BaseMedia[],
    specialtyTags: string[],
    genreTags: string[],
    mosaics: Mosaic[],
    eraTags: string[],
    age: string,
    duration: number): BaseMedia[] {
    let selectedMedia: BaseMedia[] = [];
    let aggregateMediaInEra: BaseMedia[] = []
    let aggregateMediaOutOfEra: BaseMedia[] = []
    let contextMedia: BaseMedia[] = []

    if (specialtyTags.length > 0) {
        let specialtyMedia = core.getMediaByTags(media, specialtyTags);
        if (specialtyMedia.length > 0) {
            contextMedia.push(...specialtyMedia);
        } else {
            contextMedia = media;
        }
    } else {
        contextMedia = media;
    }

    // TODO research how if musical subgenres are closer in vibe to the cinematic genre
    // than atomic genres and we should create a hierarchy
    let mosaic = getMosaic(genreTags, mosaics);
    if (mosaic) {
        const tags = [...mosaic.MusicGenres, ...mosaic.MusicSubGenres];
        tags.forEach((tag) => { 
            let contextTags = [tag, age];
            const { allTagMediaInEra, allTagMediaOutOfEra } = core.getAllTagMedia(contextMedia, eraTags, contextTags);
            aggregateMediaInEra.push(...allTagMediaInEra);
            aggregateMediaOutOfEra.push(...allTagMediaOutOfEra);
        });

        selectedMedia.push(
            ...core.getMediaWithEraConsiderations(
                alreadySelectedMedia,
                aggregateMediaInEra,
                aggregateMediaOutOfEra,
                eraTags,
                duration));
    }
    return selectedMedia;
}

export function getMosaic(
    genres: string[],
    mosaics: Mosaic[]): Mosaic | undefined {
    let key = createMosaicKey(genres);
    return mosaics.find(m => m.Key === key);
}