import { Media } from "../models/media";
import { Promo } from "../models/promo";
import { TranslationTag } from "../models/translationTag";
import { Eras } from "../models/const/eras";
import { Commercial } from "../models/commercial";
import { Short } from "../models/short";
import { Music } from "../models/music";
import { IStreamRequest } from "../models/streamRequest";
import { keyNormalizer } from "../utils/utilities";

export class TranslatedTags {
    EraTags: string[];
    MainTags: string[];
    SecondaryTags: string[];

    constructor(eraTags: string[], mainTags: string[], secondaryTags: string[]) {
        this.EraTags = eraTags;
        this.MainTags = mainTags;
        this.SecondaryTags = secondaryTags;
    }
}

class SelectedMedia {
    selectedMedia: (Promo | Music | Short | Commercial)[];
    chosenMedia: Media;
    remainingDuration: number;

    constructor(selectedMedia: (Promo | Music | Short | Commercial)[], chosenMedia: Media, remainingDuration: number) {
        this.selectedMedia = selectedMedia;
        this.chosenMedia = chosenMedia;
        this.remainingDuration = remainingDuration;
    }
}

export function createBuffer(
    duration: number,
    options: IStreamRequest,
    media: Media,
    precedingTags: string[],
    subsequentTags: string[],
    translationTags: TranslationTag[],
    prevBuff: Media): [(Promo | Music | Short | Commercial)[], number, Media] {
    let buffer: (Promo | Music | Short | Commercial)[] = [];

    // Get the translated tags for the preceding show or movie and the subsequent show or movie
    // These are used to get buffer content for the first half of the buffer and the last half of the buffer respectively
    // The reason for this is to better transition from one genre of media to the next
    let convertedPreTags: TranslatedTags = tagTranslator(precedingTags, translationTags);
    let convertedSubTags: TranslatedTags = tagTranslator(subsequentTags, translationTags);

    // If the tagsOR array contains halloween or christmas, set the only main tag to be halloween or christmas
    // This is to ensure that the buffer is themed for the holiday
    // We will do this for both the preceding and subsequent tags
    // TODO - This is a temporary solution to ensure that the buffer is themed for the holiday
    // We will need to make this configurable by the user and not hardcoded
    // And we will also need to make sure that other holidays or special events unique to the user can be themed as such
    // TODO - not sure why Im even checking MainTags here, it might not be necessary
    if (convertedPreTags.MainTags.length > 0) {
        if (options.Tags.includes("halloween")) {
            convertedPreTags.MainTags = ["halloween"];
        }
        if (options.Tags.includes("christmas")) {
            convertedPreTags.MainTags = ["christmas"];
        }
    }

    if (convertedSubTags.MainTags.length > 0) {
        if (options.Tags.includes("halloween")) {
            convertedSubTags.MainTags = ["halloween"];
        }
        if (options.Tags.includes("christmas")) {
            convertedSubTags.MainTags = ["christmas"];
        }
    }

    // Get the promos for the environment
    let envPromos: Promo[] = media.Promos.filter(promo => promo.Tags.includes(keyNormalizer(options.Env)));

    // Get the promos that are less than or equal to the duration of the buffer, the target duration of a promo is 15 seconds normally,
    // however we need to allow for users to upload promos that are longer than 15 seconds
    // 15 seconds is the ideal duration however as in the event there is a 0 duration buffer, the background service would only need to correct
    // for the 15 second duration in the next buffer, and 15 seconds is usually enough time to convey a splash, logo or other branding
    let selectedPromos: Promo[] = envPromos.filter(sp => sp.Duration <= duration);
    let promo: Promo;

    // If there are no promos that are less than or equal to the duration of the buffer, select a random promo from the environment promos
    if (selectedPromos.length < 1) {
        promo = envPromos[Math.floor(Math.random() * envPromos.length)];
    } else {
        // If there are promos that are less than or equal to the duration of the buffer, select a random promo from the selected promos
        promo = selectedPromos[Math.floor(Math.random() * selectedPromos.length)];
    }

    // Sets the duration of the buffer to be the duration of the buffer minus the duration of the promo
    let remDur: number = duration - promo.Duration;

    // variables to hold the duration of the first half of the buffer and the second half of the buffer
    let halfA: number = 0;
    let halfB: number = 0;

    // If the precedint tags are empty (such as when the stream is just launched and there is no preceding show or movie and we are creating the the initial buffer)
    if (convertedPreTags.MainTags.length === 0 && convertedPreTags.EraTags.length === 0) {
        // There is no Half A, so the entire buffer is Half B (themed to the show that is about to play)
        halfB = remDur;

        // If there is no subsequent show or movie (such as when the stream is ending and there is no subsequent show or movie and we are creating the final buffer)
    } else if (convertedSubTags.MainTags.length === 0 && convertedSubTags.EraTags.length === 0) {
        // There is no Half B, so the entire buffer is Half A (themed to the show that just played)
        halfA = remDur;
    } else {
        // If there is a preceding show or movie and a subsequent show or movie, split the buffer in half
        // If the remaining duration is greater than or equal to 30 seconds, split the buffer in half
        // If the remaining duration is less than 30 seconds, the entire buffer is Half B (themed to the show that is about to play)
        // The reason for 30 seconds is to assume the promo is 15 seconds and the fact that there are many 15 second commercials
        // TODO - We might need a better way to do this
        if (remDur >= 30) {
            halfA = Math.ceil(remDur / 2)
        }
        halfB = remDur - halfA;
    }

    if (halfA === 0) {
        // Get list of commercials, music, and shorts that match the tags of the subsequent show or movie
        // Also gets the remaining duration of the buffer after selecting the media to pass to the next buffer selection
        let selectedB = selectMediaWithinDuration(media, convertedSubTags, remDur, prevBuff);
        // Add the selected media to the buffer
        buffer.push(...selectedB.selectedMedia);
        // Add the promo to the buffer
        buffer.push(promo)
        // Set the previous buffer to the chosen media
        prevBuff = selectedB.chosenMedia;

        return [buffer, selectedB.remainingDuration, prevBuff]

    } else if (halfB === 0) {
        // Get list of commercials, music, and shorts that match the tags of the preceding show or movie
        // Also gets the remaining duration of the buffer after selecting the media to pass to the next buffer selection
        let selectedA = selectMediaWithinDuration(media, convertedPreTags, remDur, prevBuff);
        // Add the promo to the buffer
        buffer.push(promo)
        // Add the selected media to the buffer
        buffer.push(...selectedA.selectedMedia);
        // Set the previous buffer to the chosen media
        prevBuff = selectedA.chosenMedia;

        return [buffer, selectedA.remainingDuration, prevBuff]

    } else {
        // Create a new previous buffer to pass to aggregate the buffer items to then populate into the previous buffer
        let newPrevBuff: Media = new Media([], [], [], [], [], [], []);
        // Get list of commercials, music, and shorts that match the tags of the preceding show or movie
        let selectedA = selectMediaWithinDuration(media, convertedSubTags, halfA, prevBuff);
        // Add the selected media to the buffer
        buffer.push(...selectedA.selectedMedia);
        // Add the promo to the buffer
        buffer.push(promo);
        // Populate the new previous buffer with the selected buffer items
        // TODO - It looks like Im being redundant here, I should be able to just set the newPrevBuff to selectedA.chosenMedia
        newPrevBuff = selectedA.chosenMedia;
        prevBuff.Commercials.push(...selectedA.chosenMedia.Commercials);
        prevBuff.Music.push(...selectedA.chosenMedia.Music);
        prevBuff.Shorts.push(...selectedA.chosenMedia.Shorts);
        // Get list of commercials, music, and shorts that match the tags of the subsequent show or movie
        let selectedB = selectMediaWithinDuration(media, convertedSubTags, halfB, prevBuff);
        // Add the selected media to the buffer
        buffer.push(...selectedB.selectedMedia);
        // Populate the new previous buffer with the selected buffer items
        newPrevBuff.Commercials.push(...selectedB.chosenMedia.Commercials);
        newPrevBuff.Music.push(...selectedB.chosenMedia.Music);
        newPrevBuff.Shorts.push(...selectedB.chosenMedia.Shorts);

        return [buffer, selectedB.remainingDuration, newPrevBuff]

    }
}

export function tagTranslator(tags: string[], translationTags: TranslationTag[]): TranslatedTags {
    let translatedTags: TranslatedTags = new TranslatedTags([], [], []);

    //check against list of constants for era tag.
    tags.forEach(tag => {
        //check against list of constants for era tag.
        if (Object.values(Eras).includes(tag)) {
            //if it is a era specific tag, put it into the era bucket
            translatedTags.EraTags.push(tag);
        } else {
            //if it is not, put it into the main bucket
            translatedTags.MainTags.push(tag);
            //check if main tag has secondary tag translations
            let translationTag = translationTags.find(tt => tt.Tag === tag) ?? null;
            if (translationTag) {
                //if it does, add the translation to the secondary tags
                translatedTags.SecondaryTags.push(...translationTag.Translation);
            }
        }
    });

    //unique tags
    translatedTags.SecondaryTags = Array.from(new Set(translatedTags.SecondaryTags));

    return translatedTags;
}


// export function selectMusicOrShort(duration: number, taggedMedia: Media, prevBuff: Media): [(Music | Short), number] {
//     let combo: (Music | Short)[] = [];

//     combo.push(...taggedMedia.Shorts.filter(
//         short => short.Duration <= duration && !prevBuff.Shorts.some(sel => sel.Path === short.Path)
//     ));
//     combo.push(...taggedMedia.Music.filter(
//         mus => mus.Duration <= duration && !prevBuff.Music.some(m => m.Path === mus.Path)
//     ));
//     let sel = combo[Math.floor(Math.random() * combo.length)];
//     return [sel, sel.Duration];
// }

// Define a function to filter media by main tags
function filterMediaByMainTags(media: Media, tags: TranslatedTags): [Commercial[], Music[], Short[]] {
    const { MainTags } = tags;

    const filteredCommercials: Commercial[] = [];
    const filteredMusic: Music[] = [];
    const filteredShorts: Short[] = [];

    // TODO - We might need to do this for Era tags, and check if Secondary Tags would be need as well
    // TODO - We also might need to make this faster in the future if there are a lot of media items

    // Filter Commercials
    media.Commercials.forEach((commercial) => {
        if (commercial.Tags.some((tag) => MainTags.includes(tag))) {
            filteredCommercials.push(commercial);
        }
    });

    // Filter Music
    media.Music.forEach((music) => {
        if (music.Tags.some((tag) => MainTags.includes(tag))) {
            filteredMusic.push(music);
        }
    });

    // Filter Shorts
    media.Shorts.forEach((short) => {
        if (short.Tags.some((tag) => MainTags.includes(tag))) {
            filteredShorts.push(short);
        }
    });

    return [filteredCommercials, filteredMusic, filteredShorts];
}

// Define a function to select commercials
function selectCommercials(
    filteredCommercials: Commercial[],
    remainingDuration: number,
    usedCommercialTitles: string[]
): [Commercial[], number] {
    let selectedCommercials: Commercial[] = [];

    // Set the commercial block to 120 seconds
    let commercialBlock = 120;

    // Remaining duration for the buffer might be less than 120 seconds
    while (remainingDuration > 0) {
        let availableCommercials: Commercial[] = [];
        // If there are any commercials 
        // Try to get a commercial that fits the remaining duration and is equal to the commercial block in an attempt to fill the entire 
        // commercial block duration
        // TODO - we might want to set this as === remaining duration instead of <= remaining duration
        // Or we could have two different checks, one for if there are any commercials that fit the remaining duration and one for if there are any commercials that fit the commercial block
        availableCommercials = filteredCommercials.filter(
            (commercial) =>
                commercial.Duration <= remainingDuration &&
                commercial.Duration === commercialBlock &&
                !usedCommercialTitles.includes(commercial.Title)
        );

        // If there are no commercials that fit the remaining duration and are equal to the commercial block, select commercials that are below the remaining duration and the duration of the commercial block
        if (availableCommercials.length === 0) {
            availableCommercials = filteredCommercials.filter(
                (commercial) =>
                    commercial.Duration <= remainingDuration &&
                    commercial.Duration <= commercialBlock &&
                    !usedCommercialTitles.includes(commercial.Title)
            );
        }

        // If there are not any commercials that fit the remaining duration and are below the remaining duration and the duration of the commercial block, add commercials that have already been used previously
        if (availableCommercials.length === 0) {
            availableCommercials = filteredCommercials.filter(
                (commercial) =>
                    commercial.Duration <= remainingDuration &&
                    commercial.Duration <= commercialBlock
            );
        }


        if (availableCommercials.length > 0) {
            // Select random commercial from available commercials
            const selectedCommercial =
                availableCommercials[
                Math.floor(Math.random() * availableCommercials.length)
                ];
            // Add the selected commercial to the selected commercials list and remove the duration of the commercial from the remaining duration
            selectedCommercials.push(selectedCommercial);
            remainingDuration -= selectedCommercial.Duration;
            // Add the title of the selected commercial to the used commercial titles list
            usedCommercialTitles.push(selectedCommercial.Title);
            commercialBlock -= selectedCommercial.Duration; // Reduce commercialBlock
        } else {
            // If there are no commercials that fit the remaining duration or commercial block remaining duration, break the loop
            break;
        }
    }

    // Return the selected commercials and the remaining duration to be used in the next buffer
    return [selectedCommercials, remainingDuration];
}

// Define a function to select shorts or music
function selectShortOrMusic(
    filteredShorts: Short[],
    filteredMusic: Music[],
    remainingDuration: number,
    usedShortTitles: string[],
    usedMusicTitles: string[]
): (Short | Music) | null {

    // Get the available shorts that fit the remaining duration and have not been used
    const availableShorts = filteredShorts.filter(
        (short) =>
            short.Duration <= remainingDuration &&
            !usedShortTitles.includes(short.Title)
    );

    // Get the available music that fits the remaining duration and have not been used
    const availableMusic = filteredMusic.filter(
        (music) =>
            music.Duration <= remainingDuration &&
            !usedMusicTitles.includes(music.Title)
    );

    if (availableShorts.length === 0 && availableMusic.length === 0) {
        return null; // No suitable shorts or music available
        // We dont want to reuse the same short or music video in the same buffer or one from the previous buffer because 
        // the experience gets repetitive and boring
    }

    const useShort = Math.random() < 0.5; // 50% chance of selecting a short

    if (useShort && availableShorts.length > 0) {
        // Select a random short from the available shorts
        const selectedShort = availableShorts[Math.floor(Math.random() * availableShorts.length)]
        // Update the remaining duration and add the title of the selected short to the used short titles list
        remainingDuration -= selectedShort.Duration;
        usedShortTitles.push(selectedShort.Title);

        return selectedShort;

    } else if (availableMusic.length > 0) {
        // Select a random music video from the available music
        const selectedMusic = availableMusic[Math.floor(Math.random() * availableShorts.length)];
        // Update the remaining duration and add the title of the selected music to the used music titles list
        remainingDuration -= selectedMusic.Duration;
        usedMusicTitles.push(selectedMusic.Title);

        return selectedMusic;

    }

    return null; // No suitable shorts or music available
}

// Define the main function
export function selectMediaWithinDuration(
    media: Media,
    tags: TranslatedTags,
    duration: number,
    alreadyUsed: Media // Pass the already used media object
): {
    selectedMedia: (Commercial | Short | Music)[];
    chosenMedia: Media;
    remainingDuration: number; // Include remaining duration
} {

    // Set the remaining duration to the total duration
    let remainingDuration = duration;

    // Get media filtered by tags that match
    // TODO - We need to do this for Era tags, and check if Secondary Tags would be need as well
    // We might need to do a combination of Era tags and Main tags and then just Main tags later on if there are not enough media items
    // to fill the entire buffer or buffer half
    const [filteredCommercials, filteredMusic, filteredShorts] = filterMediaByMainTags(media, tags);

    // Create a list of used commercial, music, and short titles
    let usedCommercialTitles: string[] = [];
    let usedMusicTitles: string[] = [];
    let usedShortTitles: string[] = [];

    // populate each media type with the titles of the media that have already been used from the previous buffer
    alreadyUsed.Commercials.forEach((commercial) => {
        usedCommercialTitles.push(commercial.Title);
    });
    alreadyUsed.Music.forEach((music) => {
        usedMusicTitles.push(music.Title);
    });
    alreadyUsed.Shorts.forEach((short) => {
        usedShortTitles.push(short.Title);
    });

    let selectedCommercials: Commercial[] = [];

    let selectedMedia: (Commercial | Short | Music)[] = [];

    while (remainingDuration > 0) {
        // Get ~120 seconds of commercials
        const chosenCommercials = selectCommercials(
            filteredCommercials,
            remainingDuration,
            usedCommercialTitles
        );
        // Add the selected commercials to the commercial list to be passed back and the commercials for the previous buffer
        selectedCommercials.push(...chosenCommercials[0]);
        selectedMedia.push(...chosenCommercials[0]);

        remainingDuration = chosenCommercials[1];

        // Get a short or music video
        const selectedShortOrMusic = selectShortOrMusic(
            filteredShorts,
            filteredMusic,
            remainingDuration,
            usedShortTitles,
            usedMusicTitles
        );

        // If there was a short or music video (if there wasnt the loop will continue until the remaining duration is 0, or there are no more commercials that fit the remaining duration)
        if (selectedShortOrMusic) {
            selectedMedia.push(selectedShortOrMusic);
            if (selectedShortOrMusic instanceof Short) {
                usedShortTitles.push(selectedShortOrMusic.Title);
            } else {
                usedMusicTitles.push(selectedShortOrMusic.Title);
            }
            remainingDuration -= selectedShortOrMusic.Duration;
        }

        // If there are no commercials or shorts/music that fit the remaining duration, break the loop
        // The final remaining duration will get passed to the next buffer for timing correction
        if (chosenCommercials[0].length === 0 && !selectedShortOrMusic) {
            break;
        }
    }

    // Create a new Media object with selected commercials, music, and shorts to pass back to the previous buffer
    const mediaWithSelected = new Media(
        [...alreadyUsed.Shows],
        [...alreadyUsed.Movies],
        selectedMedia.filter((media) => media instanceof Short) as Short[],
        selectedMedia.filter((media) => media instanceof Music) as Music[],
        [...alreadyUsed.Promos],
        selectedCommercials,
        [...alreadyUsed.Collections]
    );

    return {
        selectedMedia,
        chosenMedia: mediaWithSelected,
        remainingDuration,
    };
}