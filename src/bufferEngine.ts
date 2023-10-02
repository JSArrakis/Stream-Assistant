import { Media } from "../models/media";
import { Promo } from "../models/promo";
import { TranslationTag } from "../models/translationTag";
import { Eras } from "../models/const/eras";
import { Commercial } from "../models/commercial";
import { Short } from "../models/short";
import { Music } from "../models/music";

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

export function createBuffer(
    inputTags: string[],
    duration: number,
    options: any,
    media: Media,
    precedingTags: string[],
    subsequentTags: string[],
    translationTags: TranslationTag[],
    prevBuff: Media): [(Promo | Music | Short | Commercial)[], number, Media] {
    let buffer: (Promo | Music | Short | Commercial)[] = [];

    let convertedPreTags: TranslatedTags = tagTranslator(precedingTags, translationTags);
    let convertedSubTags: TranslatedTags = tagTranslator(subsequentTags, translationTags);

    //if converted pre tags has Main tags, and options.tagsOR contains "halloween" then set that tag as the only tag in main tags
    if (convertedPreTags.MainTags.length > 0) {
        if (options.tagsOR.includes("halloween")) {
            convertedPreTags.MainTags = ["halloween"];
        }
        if (options.tagsOR.includes("christmas")) {
            convertedPreTags.MainTags = ["christmas"];
        }
    }

    if (convertedSubTags.MainTags.length > 0) {
        if (options.tagsOR.includes("halloween")) {
            convertedSubTags.MainTags = ["halloween"];
        }
        if (options.tagsOR.includes("christmas")) {
            convertedSubTags.MainTags = ["christmas"];
        }
    }

    let envPromos: Promo[] = media.Promos.filter(promo => promo.Tags.includes(options.env));
    let selectedPromos: Promo[] = envPromos.filter(sp => sp.Duration <= duration);
    let promo: Promo;
    if (selectedPromos.length < 1) {
        promo = envPromos[Math.floor(Math.random() * envPromos.length)];
    } else {
        promo = selectedPromos[Math.floor(Math.random() * selectedPromos.length)];
    }

    let remDur: number = duration - promo.Duration;
    let halfA: number = 0;
    let halfB: number = 0;
    if (convertedPreTags.MainTags.length === 0 && convertedPreTags.EraTags.length === 0) {
        halfB = remDur;
    } else if (convertedSubTags.MainTags.length === 0 && convertedSubTags.EraTags.length === 0) {
        halfA = remDur;
    } else {
        if (remDur >= 30) {
            halfA = Math.ceil(remDur / 2)
        }
        halfB = remDur - halfA;
    }
    if (halfA === 0) {
        let selectedB = selectMediaWithinDuration(media, convertedSubTags, remDur, prevBuff);
        buffer.push(...selectedB.selectedMedia);
        buffer.push(promo)
        prevBuff = selectedB.chosenMedia;
        return [buffer, selectedB.remainingDuration, prevBuff]
    } else if (halfB === 0) {
        let selectedA = selectMediaWithinDuration(media, convertedSubTags, remDur, prevBuff);
        buffer.push(promo)
        buffer.push(...selectedA.selectedMedia);
        return [buffer, selectedA.remainingDuration, prevBuff]
    } else {
        let newPrevBuff: Media = new Media([], [], [], [], [], [], []);
        let selectedA = selectMediaWithinDuration(media, convertedSubTags, halfA, prevBuff);
        buffer.push(...selectedA.selectedMedia);
        buffer.push(promo);
        newPrevBuff = selectedA.chosenMedia;
        prevBuff.Commercials.push(...selectedA.chosenMedia.Commercials);
        prevBuff.Music.push(...selectedA.chosenMedia.Music);
        prevBuff.Shorts.push(...selectedA.chosenMedia.Shorts);
        let selectedB = selectMediaWithinDuration(media, convertedSubTags, halfB, prevBuff);
        buffer.push(...selectedB.selectedMedia);
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


export function selectMusicOrShort(duration: number, taggedMedia: Media, prevBuff: Media): [(Music | Short), number] {
    let combo: (Music | Short)[] = [];

    combo.push(...taggedMedia.Shorts.filter(
        short => short.Duration <= duration && !prevBuff.Shorts.some(sel => sel.Path === short.Path)
    ));
    combo.push(...taggedMedia.Music.filter(
        mus => mus.Duration <= duration && !prevBuff.Music.some(m => m.Path === mus.Path)
    ));
    let sel = combo[Math.floor(Math.random() * combo.length)];
    return [sel, sel.Duration];
}

// Define a function to filter media by main tags
function filterMediaByMainTags(media: Media, tags: TranslatedTags): [Commercial[], Music[], Short[]] {
    const { MainTags } = tags;

    const filteredCommercials: Commercial[] = [];
    const filteredMusic: Music[] = [];
    const filteredShorts: Short[] = [];

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
    usedCommercialTitles: Set<string>
): [Commercial[], number] {
    const selectedCommercials: Commercial[] = [];

    let commercialBlock = 120;

    while (remainingDuration > 0) {
        let availableCommercials: Commercial[] = [];
        // load available commercials from filtered commercials where duration is equal to remaining commercial block
        availableCommercials = filteredCommercials.filter(
            (commercial) =>
                commercial.Duration <= remainingDuration &&
                commercial.Duration === commercialBlock &&
                !usedCommercialTitles.has(commercial.Title)
        );
        if (availableCommercials.length === 0) {
            availableCommercials = filteredCommercials.filter(
                (commercial) =>
                    commercial.Duration <= remainingDuration &&
                    commercial.Duration <= commercialBlock &&
                    !usedCommercialTitles.has(commercial.Title)
            );
        }

        if (availableCommercials.length === 0) {
            availableCommercials = filteredCommercials.filter(
                (commercial) =>
                    commercial.Duration <= remainingDuration &&
                    commercial.Duration <= commercialBlock
            );
        }


        if (availableCommercials.length > 0) {
            //select random commercial from available commercials
            const selectedCommercial =
                availableCommercials[
                Math.floor(Math.random() * availableCommercials.length)
                ];
            selectedCommercials.push(selectedCommercial);
            remainingDuration -= selectedCommercial.Duration;
            usedCommercialTitles.add(selectedCommercial.Title);
            commercialBlock -= selectedCommercial.Duration; // Reduce commercialBlock
        } else {
            break;
        }
    }

    return [selectedCommercials, remainingDuration];
}

// Define a function to select shorts or music
function selectShortOrMusic(
    filteredShorts: Short[],
    filteredMusic: Music[],
    remainingDuration: number,
    usedShortTitles: Set<string>,
    usedMusicTitles: Set<string>
): (Short | Music) | null {
    const availableShorts = filteredShorts.filter(
        (short) =>
            short.Duration <= remainingDuration &&
            !usedShortTitles.has(short.Title)
    );

    const availableMusic = filteredMusic.filter(
        (music) =>
            music.Duration <= remainingDuration &&
            !usedMusicTitles.has(music.Title)
    );

    if (availableShorts.length === 0 && availableMusic.length === 0) {
        return null; // No suitable shorts or music available
    }

    const useShort = Math.random() < 0.5; // 50% chance of selecting a short

    if (useShort && availableShorts.length > 0) {
        const selectedShort = availableShorts[0];
        remainingDuration -= selectedShort.Duration;
        usedShortTitles.add(selectedShort.Title);
        return selectedShort;
    } else if (availableMusic.length > 0) {
        const selectedMusic = availableMusic[0];
        remainingDuration -= selectedMusic.Duration;
        usedMusicTitles.add(selectedMusic.Title);
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

    // Calculate remaining duration
    let remainingDuration = duration;

    const [filteredCommercials, filteredMusic, filteredShorts] = filterMediaByMainTags(media, tags);

    const usedCommercialTitles = new Set<string>();
    const usedMusicTitles = new Set<string>();
    const usedShortTitles = new Set<string>();

    alreadyUsed.Commercials.forEach((commercial) => {
        usedCommercialTitles.add(commercial.Title);
    });
    alreadyUsed.Music.forEach((music) => {
        usedMusicTitles.add(music.Title);
    });
    alreadyUsed.Shorts.forEach((short) => {
        usedShortTitles.add(short.Title);
    });

    const selectedCommercials: Commercial[] = [];

    const selectedMedia: (Commercial | Short | Music)[] = [];

    while (remainingDuration > 0) {
        const chosenCommercials = selectCommercials(
            filteredCommercials,
            remainingDuration,
            usedCommercialTitles
        );
        selectedCommercials.push(...chosenCommercials[0]);
        selectedMedia.push(...chosenCommercials[0]);

        remainingDuration = chosenCommercials[1];

        const selectedShortOrMusic = selectShortOrMusic(
            filteredShorts,
            filteredMusic,
            remainingDuration,
            usedShortTitles,
            usedMusicTitles
        );

        if (selectedShortOrMusic) {
            selectedMedia.push(selectedShortOrMusic);
            if (selectedShortOrMusic instanceof Short) {
                usedShortTitles.add(selectedShortOrMusic.Title);
            } else {
                usedMusicTitles.add(selectedShortOrMusic.Title);
            }
            remainingDuration -= selectedShortOrMusic.Duration;
        }

        if (chosenCommercials[0].length === 0 && !selectedShortOrMusic) {
            break;
        }
    }

    // Create a new Media object with selected commercials, music, and shorts
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