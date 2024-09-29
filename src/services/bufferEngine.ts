import { Media } from "../models/media";
import { Promo } from "../models/promo";
import { Commercial } from "../models/commercial";
import { Short } from "../models/short";
import { Music } from "../models/music";
import { IStreamRequest } from "../models/streamRequest";
import { keyNormalizer } from "../utils/utilities";
import { SegmentedTags } from "../models/segmentedTags";
import { segmentTags } from "./dataTransformer";
import { getMediaByAgeGroupHierarchy } from "./dataManager";
import { BaseMedia } from "../models/mediaInterface";

export function createBuffer(
    duration: number,
    options: IStreamRequest,
    media: Media,
    halfATags: string[],
    halfBTags: string[],
    prevBuff: Media): [(Promo | Music | Short | Commercial)[], number, Media] {
    let buffer: (Promo | Music | Short | Commercial)[] = [];

    // Get the translated tags for the preceding show or movie and the subsequent 
    // show or movie. These are used to get buffer content for the first half of the 
    // buffer and the last half of the buffer respectively
    // The reason for this is to better transition from one genre of media to the next
    let segmentedPreTags: SegmentedTags = segmentTags(halfATags);
    let segmentedPostTags: SegmentedTags = segmentTags(halfBTags);

    // If the tagsOR array contains halloween or christmas, set the only main tag to be 
    // halloween or christmas
    // This is to ensure that the buffer is themed for the holiday
    // We will do this for both the preceding and subsequent tags
    // TODO - This is a temporary solution to ensure that the buffer is themed for the holiday
    // We will need to make this configurable by the user and not hardcoded
    // And we will also need to make sure that other holidays or special events unique to 
    // the user can be themed as such
    // TODO - not sure why Im even checking MainTags here, it might not be necessary
    if (segmentedPreTags.GenreTags.length > 0) {
        if (options.Tags.includes("halloween")) {
            segmentedPreTags.GenreTags = ["halloween"];
        }
        if (options.Tags.includes("christmas")) {
            segmentedPreTags.GenreTags = ["christmas"];
        }
    }

    if (segmentedPostTags.GenreTags.length > 0) {
        if (options.Tags.includes("halloween")) {
            segmentedPostTags.GenreTags = ["halloween"];
        }
        if (options.Tags.includes("christmas")) {
            segmentedPostTags.GenreTags = ["christmas"];
        }
    }

    // Get the promos for the environment
    let envPromos: Promo[] = media.Promos
        .filter(promo => promo.Tags.includes(keyNormalizer(options.Env)));

    // Get the promos that are less than or equal to the duration of the buffer, the 
    // target duration of a promo is 15 seconds normally, however we need to allow for 
    // users to upload promos that are longer than 15 seconds
    // 15 seconds is the ideal duration, however, if in the event there is a 0 duration 
    // buffer, the background service would only need to correct
    // for the 15 second duration in the next buffer, and 15 seconds is usually enough 
    // time to convey a splash, logo or other branding
    let selectedPromos: Promo[] = envPromos.filter(sp => sp.Duration <= duration);
    let promo: Promo;

    // If there are no promos that are less than or equal to the duration of the buffer, 
    // select a random promo from the environment promos
    if (selectedPromos.length < 1) {
        promo = envPromos[Math.floor(Math.random() * envPromos.length)];
    } else {
        // If there are promos that are less than or equal to the duration of the buffer, 
        // select a random promo from the selected promos
        promo = selectedPromos[Math.floor(Math.random() * selectedPromos.length)];
    }

    // Sets the duration of the buffer to be the duration of the buffer minus the duration 
    // of the promo
    let remDur: number = duration - promo.Duration;

    // variables to hold the duration of the first half of the buffer and the second half 
    // of the buffer
    let halfA: number = 0;
    let halfB: number = 0;

    // If the precedint tags are empty (such as when the stream is just launched and there is 
    // no preceding show or movie and we are creating the the initial buffer)
    if (halfATags.length === 0) {
        // There is no Half A, so the entire buffer is Half B (themed to the show that is about to play)
        halfB = remDur;

        // If there is no subsequent show or movie (such as when the stream is ending and there is 
        // no subsequent show or movie and we are creating the final buffer)
    } else if (halfBTags.length === 0) {
        // There is no Half B, so the entire buffer is Half A (themed to the show that just played)
        halfA = remDur;
    } else {
        // If there is a preceding show or movie and a subsequent show or movie, 
        // split the buffer in half
        // If the remaining duration is greater than or equal to 30 seconds, split 
        // he buffer in half
        // If the remaining duration is less than 30 seconds, the entire buffer is 
        // Half B(themed to the show that is about to play)
        // The reason for 30 seconds is to assume the promo is 15 seconds and the 
        // fact that there are many 15 second commercials
        // TODO - We might need a better way to do this
        if (remDur >= 30) {
            halfA = Math.ceil(remDur / 2)
        }
        halfB = remDur - halfA;
    }

    if (halfA === 0) {
        // Get list of commercials, music, and shorts that match the tags of the 
        // subsequent show or movie and also gets the remaining duration of the 
        // buffer after selecting the media to pass to the next buffer selection
        let selectedB =
            selectBufferMediaWithinDuration(
                media,
                segmentedPostTags,
                remDur,
                prevBuff
            );
        // Add the selected media to the buffer
        buffer.push(...selectedB.selectedMedia);
        // Add the promo to the buffer
        buffer.push(promo)
        // Set the previous buffer to the chosen media
        prevBuff = selectedB.chosenMedia;

        return [buffer, selectedB.remainingDuration, prevBuff]

    } else if (halfB === 0) {
        // Get list of commercials, music, and shorts that match the tags of the 
        // preceding show or movie and also gets the remaining duration of the 
        // buffer after selecting the media to pass to the next buffer selection
        let selectedA =
            selectBufferMediaWithinDuration(
                media,
                segmentedPreTags,
                remDur,
                prevBuff
            );
        // Add the promo to the buffer
        buffer.push(promo)
        // Add the selected media to the buffer
        buffer.push(...selectedA.selectedMedia);
        // Set the previous buffer to the chosen media
        prevBuff = selectedA.chosenMedia;

        return [buffer, selectedA.remainingDuration, prevBuff]

    } else {
        // Create a new previous buffer to pass to aggregate the buffer items 
        // to then populate into the previous buffer
        let newPrevBuff: Media =
            new Media(
                [], // Shows
                [], // Movies
                [], // Shorts
                [], // Music
                [], // Promos
                [], // Default Promos
                [], // Commercials
                [], // Default Commercials
                [], // Collections
            );
        // Get list of commercials, music, and shorts that match the tags of the 
        // preceding show or movie
        let selectedA =
            selectBufferMediaWithinDuration(
                media,
                segmentedPostTags,
                halfA,
                prevBuff
            );
        // Add the selected media to the buffer
        buffer.push(...selectedA.selectedMedia);
        // Add the promo to the buffer
        buffer.push(promo);
        // Populate the new previous buffer with the selected buffer items
        // TODO - It looks like Im being redundant here, I should be able to just 
        // set the newPrevBuff to selectedA.chosenMedia
        newPrevBuff = selectedA.chosenMedia;
        prevBuff.Commercials.push(...selectedA.chosenMedia.Commercials);
        prevBuff.Music.push(...selectedA.chosenMedia.Music);
        prevBuff.Shorts.push(...selectedA.chosenMedia.Shorts);
        // Get list of commercials, music, and shorts that match the tags of the 
        // subsequent show or movie
        let selectedB =
            selectBufferMediaWithinDuration(
                media,
                segmentedPostTags,
                halfB,
                prevBuff
            );
        // Add the selected media to the buffer
        buffer.push(...selectedB.selectedMedia);
        // Populate the new previous buffer with the selected buffer items
        newPrevBuff.Commercials.push(...selectedB.chosenMedia.Commercials);
        newPrevBuff.Music.push(...selectedB.chosenMedia.Music);
        newPrevBuff.Shorts.push(...selectedB.chosenMedia.Shorts);

        return [buffer, selectedB.remainingDuration, newPrevBuff]

    }
}

function selectFullDurationMedia(
    media: BaseMedia[],
    previouslyUsedMedia: BaseMedia[],
    currentlySelectedMedia: BaseMedia[],
    duration: number): BaseMedia[] {
    return media.filter(
        (media: BaseMedia) =>
            media.Duration === duration &&
            !previouslyUsedMedia.includes(media) &&
            !currentlySelectedMedia.includes(media)
    );
}

function selectUnderDuratonMedia(
    media: BaseMedia[],
    previouslyUsedMedia: BaseMedia[],
    currentlySelectedMedia: BaseMedia[],
    duration: number,
    blockDuration: number): BaseMedia[] {
    return media.filter(
        (media) =>
            media.Duration <= duration &&
            media.Duration <= blockDuration &&
            !previouslyUsedMedia.includes(media) &&
            !currentlySelectedMedia.includes(media)
    );
}


// Define a function to select commercials
function selectCommercials(
    filteredCommercials: Commercial[],
    defaultCommercials: Commercial[],
    remainingDuration: number,
    usedCommercials: Commercial[]
): [Commercial[], number] {
    let selectedCommercials: Commercial[] = [];

    // In normal TV broadcast, a single commercial is rarely longer than 120 seconds
    // However they do exist, and as such we account for that for giving a small
    // chance of selecting a commercial that is longer than 120 seconds
    // by looking for commercials that are equal to the entire remaining duration
    // The variableness of this duration is what makes the possiblity of a full
    // remaining duration commercial being selected possible but low.
    // Set the commercial block to 120 seconds
    let commercialBlock = 120;

    // Remaining duration for the buffer might be less than 120 seconds
    while (remainingDuration > 0) {
        let availableCommercials: Commercial[] = [];

        // Get the commercials that fit the remaining duration and have not been used
        availableCommercials =
            selectFullDurationMedia(
                filteredCommercials,
                usedCommercials,
                selectedCommercials,
                remainingDuration
            ) as Commercial[];

        // Get the commercials that are less than or equal to both the remaining duration 
        // and the commercial block and have not been used
        if (availableCommercials.length === 0) {
            availableCommercials =
                selectUnderDuratonMedia(
                    filteredCommercials,
                    usedCommercials,
                    selectedCommercials,
                    remainingDuration,
                    commercialBlock
                ) as Commercial[];
        }


        // Get the commercials that fit the remaining duration and have already been used
        if (availableCommercials.length === 0) {
            availableCommercials =
                selectFullDurationMedia(
                    filteredCommercials,
                    [],
                    selectedCommercials,
                    remainingDuration
                ) as Commercial[];
        }

        // Get the commercials that are less than or equal to both the remaining duration
        // and the commercial block and have already been used
        if (availableCommercials.length === 0) {
            availableCommercials =
                selectUnderDuratonMedia(
                    filteredCommercials,
                    [],
                    selectedCommercials,
                    remainingDuration,
                    commercialBlock
                ) as Commercial[];
        }

        // Get the default commercials that fit the remaining duration
        if (availableCommercials.length === 0) {
            availableCommercials =
                selectFullDurationMedia(
                    defaultCommercials,
                    [],
                    [],
                    remainingDuration
                ) as Commercial[];
        }

        // Get the default commercials that are less than or equal to both the remaining duration 
        // and the commercial block
        if (availableCommercials.length === 0) {
            availableCommercials =
                selectUnderDuratonMedia(
                    defaultCommercials,
                    [],
                    [],
                    remainingDuration,
                    commercialBlock
                ) as Commercial[];
        }

        if (availableCommercials.length > 0) {
            // Select random commercial from available commercials
            const selectedCommercial =
                availableCommercials[
                    Math.floor(Math.random() * availableCommercials.length)
                ];
            // Add the selected commercial to the selected commercials list and remove the 
            // duration of the commercial from the remaining duration
            selectedCommercials.push(selectedCommercial);
            remainingDuration -= selectedCommercial.Duration;
            // Add the title of the selected commercial to the used commercial titles list
            commercialBlock -= selectedCommercial.Duration; // Reduce commercialBlock
        } else {
            // If there are no commercials that fit the remaining duration or commercial block 
            // remaining duration, break the loop
            break;
        }
    }

    // Return the selected commercials and the remaining duration to be used in the next buffer
    return [selectedCommercials, remainingDuration];
}

// Select Shorts or Music
function selectShortOrMusic(
    filteredShorts: Short[],
    filteredMusic: Music[],
    remainingDuration: number,
    usedShorts: Short[],
    usedMusic: Music[]
): (Short | Music) | null {

    // Get the available shorts that fit the remaining duration and have not been used
    const availableShorts = filteredShorts.filter(
        (short) =>
            short.Duration <= remainingDuration &&
            !usedShorts.includes(short)
    );

    // Get the available music that fits the remaining duration and have not been used
    const availableMusic = filteredMusic.filter(
        (music) =>
            music.Duration <= remainingDuration &&
            !usedMusic.includes(music)
    );

    if (availableShorts.length === 0 && availableMusic.length === 0) {
        return null; // No suitable shorts or music available
        // We dont want to reuse the same short or music video in the same buffer or one 
        // from the previous buffer because the experience gets repetitive and boring
    }

    const useShort = Math.random() < 0.5; // 50% chance of selecting a short

    if (useShort && availableShorts.length > 0) {
        // Select a random short from the available shorts
        const selectedShort = availableShorts[Math.floor(Math.random() * availableShorts.length)]
        // Update the remaining duration and add the title of the selected short to the 
        // used short titles list
        remainingDuration -= selectedShort.Duration;
        usedShorts.push(selectedShort);

        return selectedShort;

    } else if (availableMusic.length > 0) {
        // Select a random music video from the available music
        const selectedMusic = availableMusic[Math.floor(Math.random() * availableShorts.length)];
        // Update the remaining duration and add the title of the selected music to the 
        // used music titles list
        remainingDuration -= selectedMusic.Duration;
        usedMusic.push(selectedMusic);

        return selectedMusic;

    }

    return null; // No suitable shorts or music available
}

// Define the main function
export function selectBufferMediaWithinDuration(
    media: Media,
    tags: SegmentedTags,
    duration: number,
    alreadyUsed: Media // Pass the already used media object
): {
    selectedMedia: (Commercial | Short | Music)[];
    chosenMedia: Media;
    remainingDuration: number; // Include remaining duration
} {
    // Set the remaining duration to the total duration
    let remainingDuration = duration;

    let usedCommercials: Commercial[] = [];
    alreadyUsed.Commercials.forEach((commercial) => {
        usedCommercials.push(commercial);
    });

    let usedMusic: Music[] = [];
    alreadyUsed.Music.forEach((music) => {
        usedMusic.push(music);
    });


    let usedShorts: Short[] = [];
    alreadyUsed.Shorts.forEach((short) => {
        usedShorts.push(short);
    });

    // Get media filtered by tags that match using Kaleidoscope Buffer Media Selection Algorithm(tm)
    /*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/
    const filteredCommercials = getMediaByAgeGroupHierarchy(media.Commercials, tags, remainingDuration);
    const filteredMusic = getMediaByAgeGroupHierarchy(media.Music, tags, remainingDuration);
    const filteredShorts = getMediaByAgeGroupHierarchy(media.Shorts, tags, remainingDuration);
    /*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*/

    // Create a list of used commercial, music, and short titles

    let selectedMedia: (Commercial | Short | Music)[] = [];

    while (remainingDuration > 0) {
        // Get ~>= 120 seconds of commercials
        const chosenCommercials = selectCommercials(
            filteredCommercials as Commercial[],
            media.DefaultCommercials,
            remainingDuration,
            usedCommercials
        );
        // Add the selected commercials to the commercial list to be passed back and the 
        // commercials for the previous buffer
        selectedMedia.push(...chosenCommercials[0]);
        // Update the remaining duration
        remainingDuration = chosenCommercials[1];

        // Get a short or music video
        const selectedShortOrMusic = selectShortOrMusic(
            filteredShorts as Short[],
            filteredMusic as Music[],
            remainingDuration,
            usedShorts,
            usedMusic
        );

        // If there was a short or music video (if there wasnt the loop will continue until 
        // the remaining duration is 0, or there are no more commercials that fit the remaining duration)
        if (selectedShortOrMusic) {
            selectedMedia.push(selectedShortOrMusic);
            if (selectedShortOrMusic instanceof Short) {
                usedShorts.push(selectedShortOrMusic);
            } else {
                usedMusic.push(selectedShortOrMusic);
            }
            remainingDuration -= selectedShortOrMusic.Duration;
        }

        // If there are no commercials or shorts/music that fit the remaining duration, break the loop
        // The final remaining duration will get passed to the next buffer for timing correction
        if (chosenCommercials[0].length === 0 && !selectedShortOrMusic) {
            break;
        }
    }

    // Create a new Media object with selected commercials, music, and shorts to pass back to the 
    // previous buffer
    const mediaWithSelected = new Media(
        [],
        [],
        selectedMedia.filter((media) => media instanceof Short) as Short[],
        selectedMedia.filter((media) => media instanceof Music) as Music[],
        [],
        [],
        selectedMedia.filter((media) => media instanceof Commercial) as Commercial[],
        [],
        []
    );

    return {
        selectedMedia,
        chosenMedia: mediaWithSelected,
        remainingDuration,
    };
}