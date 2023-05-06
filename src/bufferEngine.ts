import { Media } from "../models/media";
import { Promo } from "../models/promo";
import { TranslationTag } from "../models/translationTag";
import { Eras } from "../models/const/eras";
import { Commercial } from "../models/commercial";
import { Short } from "../models/short";
import { Music } from "../models/music";

class TranslatedTags {
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
    duration: number,
    options: any,
    media: Media,
    precedingTags: string[],
    subsequentTags: string[],
    translationTags: TranslationTag[],
    prevBuff: Media): [string[], number] {
    let buffer: string[] = [];

    let convertedPreTags: TranslatedTags = tagTranslator(precedingTags, translationTags);
    let convertedSubTags: TranslatedTags = tagTranslator(subsequentTags, translationTags);

    let envPromos: Promo[] = media.Promos.filter(promo => promo.Tags.includes(options.env));
    let selectedPromos: Promo[] = envPromos.filter(sp => sp.Duration <= duration);
    let promo: Promo;
    if (selectedPromos.length < 1) {
        promo = envPromos[Math.floor(Math.random() * envPromos.length)];
    } else {
        promo = selectedPromos[Math.floor(Math.random() * selectedPromos.length)];
    }

    let remDur: number = duration - promo.Duration;
    let half: number = 0;
    if (remDur >= 30) {
        half = Math.ceil(duration / 2)
    }

    if (subsequentTags.length > 0 && precedingTags.length > 0) {
        if (half === 0) {
            buffer.push(promo.Path)
            let selectedB = selectBuffer(duration, media, convertedSubTags, prevBuff);
            buffer.push(...selectedB[0]);
            return [buffer, selectedB[1]]
        } else {
            let selectedA = selectBuffer(duration, media, convertedPreTags, prevBuff);
            buffer.push(...selectedA[0]);
            buffer.push(promo.Path);
            let selectedB = selectBuffer(duration + selectedA[1], media, convertedSubTags, prevBuff);
            buffer.push(...selectedB[0]);
            return [buffer, selectedB[1]]
        }
    } else if (precedingTags.length > 0) {
        //TODO Devise a signoff set
        let selectedB = selectBuffer(duration, media, convertedPreTags, prevBuff);
        buffer.push(promo.Path)
        buffer.push(...selectedB[0]);
        buffer.push(promo.Path)
        return [buffer, selectedB[1]]
    } else {
        let selectedB = selectBuffer(duration, media, convertedSubTags, prevBuff);
        buffer.push(...selectedB[0]);
        buffer.push(promo.Path)
        return [buffer, selectedB[1]]
    }
}

function tagTranslator(tags: string[], translationTags: TranslationTag[]): TranslatedTags {
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

function selectBuffer(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media): [string[], number] {

    let buffer: string[] = [];
    let remainder = duration;

    let taggedMedia: Media = new Media([], [], [], [], [], [], []);
    let selectedMedia: Media = new Media([], [], [], [], [], [], []);

    taggedMedia.Shorts = getBufferShorts(duration, media, tags, prevBuff);
    taggedMedia.Music = getBufferMusic(duration, media, tags, prevBuff);
    taggedMedia.Commercials = getBufferCommercials(duration, media, tags, prevBuff);

    let alternator: Boolean = true;

    while (remainder > 0 && hasCommercialsUnderDuration(remainder, media, selectedMedia)) {

        let musicAvailable: boolean = hasMusicUnderDuration(remainder, taggedMedia, selectedMedia);
        let shortsAvailable: boolean = hasShortsUnderDuration(remainder, taggedMedia, selectedMedia);

        if (musicAvailable || shortsAvailable) {
            if (alternator) {
                let commBuff: string[] = [];
                let commRemain: number = 120;
                let commDur: number = 0;
                if (remainder < commRemain) {
                    commRemain = remainder;
                }
                while (commRemain > 0 && hasCommercialsUnderDuration(commRemain, media, selectedMedia)) {
                    let selectedComm = selectCommercial(duration, taggedMedia, media, selectedMedia);
                    commBuff.push(selectedComm[0]);
                    commRemain = commRemain - selectedComm[1];
                    commDur = commDur + selectedComm[1];
                }

                buffer.push(...commBuff);
                remainder = remainder - commRemain;
                alternator = false;

            } else {
                let selectedMoS = selectMusicOrShort(duration, taggedMedia, prevBuff);
                buffer.push(selectedMoS[0]);
                remainder = remainder - selectedMoS[1];
                alternator = true;

            }
        } else {
            let commBuff: string[] = [];
            let commRemain: number = 120;
            let commDur: number = 0;
            if (remainder < commRemain) {
                commRemain = remainder;
            }
            while (commRemain > 0 && hasCommercialsUnderDuration(commRemain, media, selectedMedia)) {
                let selectedComm = selectCommercial(commRemain, taggedMedia, media, selectedMedia);
                commBuff.push(selectedComm[0]);
                commRemain = commRemain - selectedComm[1];
                commDur = commDur + selectedComm[1];
            }

            buffer.push(...commBuff);
            remainder = remainder - commRemain;
        }
    }
    return [buffer, remainder];
}

function selectMusicOrShort(duration: number, taggedMedia: Media, prevBuff: Media): [string, number] {
    let combo: (Music | Short)[] = [];
    combo.push(...taggedMedia.Shorts.filter(
        short => short.Duration <= duration && !prevBuff.Shorts.some(sel => sel.Path === short.Path)
    ));
    combo.push(...taggedMedia.Music.filter(
        mus => mus.Duration <= duration && !prevBuff.Music.some(m => m.Path === mus.Path)
    ));
    let fullDur = combo.filter(mos => mos.Duration == duration);
    if (fullDur.length > 0) {
        let sel = fullDur[Math.floor(Math.random() * fullDur.length)];
        return [sel.Path, sel.Duration];
    } else {
        let sel = combo[Math.floor(Math.random() * combo.length)];
        return [sel.Path, sel.Duration];
    }
}

//TODO: Blacklist per genre
function selectCommercial(duration: number, taggedMedia: Media, media: Media, prevBuff: Media): [string, number] {
    let taggedCandidates = getCommercials(duration, taggedMedia, prevBuff);
    if (taggedCandidates.length > 0) {
        let fullDur = taggedCandidates.filter(can => can.Duration == duration);
        if (fullDur.length > 0) {
            let sel = fullDur[Math.floor(Math.random() * fullDur.length)];
            return [sel.Path, sel.Duration];
        } else {
            let sel = taggedCandidates[Math.floor(Math.random() * taggedCandidates.length)];
            return [sel.Path, sel.Duration];
        }
    } else {
        let untaggedCandidates = getCommercials(duration, media, prevBuff);
        let fullDur = untaggedCandidates.filter(can => can.Duration == duration);
        if (fullDur.length > 0) {
            let sel = fullDur[Math.floor(Math.random() * fullDur.length)];
            return [sel.Path, sel.Duration];
        } else {
            let sel = untaggedCandidates[Math.floor(Math.random() * untaggedCandidates.length)];
            return [sel.Path, sel.Duration];
        }
    }
}

function getBufferMusic(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media) {
    let music: Music[] = [];
    music.push(...getTagMusic(duration, media, tags.MainTags, prevBuff));
    return music;
}

function getBufferShorts(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media) {
    let shorts: Short[] = [];
    shorts.push(...getTagShorts(duration, media, tags.MainTags, prevBuff));
    return shorts;
}

function getBufferCommercials(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media): Commercial[] {
    let commercials: Commercial[] = [];
    commercials.push(...getTagCommercials(duration, media, tags.MainTags, prevBuff));
    commercials.push(...getTagCommercials(duration, media, tags.SecondaryTags, prevBuff));
    return commercials;
}

function getTagMusic(duration: number, media: Media, tags: string[], prevBuff: Media): Music[] {
    //get genre commercials under duration
    return media.Music.filter(item => {
        // Check if the item's Duration is less than or equal to currentDuration
        if (item.Duration > duration) {
            return false;
        }

        // Check if the item's Tags contain at least one of the strings in currentTags
        const tagIntersection = item.Tags.filter(tag => tags.includes(tag));
        if (tagIntersection.length === 0) {
            return false;
        }

        // Check if the item exists in List2
        const existsInList2 = prevBuff.Music.some(list2Item => list2Item.Path === item.Path);
        if (existsInList2) {
            return false;
        }

        // If all checks pass, include the item in the filtered result
        return true;
    });
}

function getTagShorts(duration: number, media: Media, tags: string[], prevBuff: Media): Short[] {
    //get genre commercials under duration
    return media.Shorts.filter(item => {
        // Check if the item's Duration is less than or equal to currentDuration
        if (item.Duration > duration) {
            return false;
        }

        // Check if the item's Tags contain at least one of the strings in currentTags
        const tagIntersection = item.Tags.filter(tag => tags.includes(tag));
        if (tagIntersection.length === 0) {
            return false;
        }

        // Check if the item exists in List2
        const existsInList2 = prevBuff.Shorts.some(list2Item => list2Item.Path === item.Path);
        if (existsInList2) {
            return false;
        }

        // If all checks pass, include the item in the filtered result
        return true;
    });
}

function getCommercials(duration: number, media: Media, prevBuff: Media): Commercial[] {
    //get genre commercials under duration
    return media.Commercials.filter(item => {
        // Check if the item's Duration is less than or equal to currentDuration
        if (item.Duration > duration) {
            return false;
        }

        // Check if the item exists in List2
        const existsInList2 = prevBuff.Commercials.some(list2Item => list2Item.Path === item.Path);
        if (existsInList2) {
            return false;
        }

        // If all checks pass, include the item in the filtered result
        return true;
    });
}

function getTagCommercials(duration: number, media: Media, tags: string[], prevBuff: Media): Commercial[] {
    //get genre commercials under duration
    return media.Commercials.filter(item => {
        // Check if the item's Duration is less than or equal to currentDuration
        if (item.Duration > duration) {
            return false;
        }

        // Check if the item's Tags contain at least one of the strings in currentTags
        const tagIntersection = item.Tags.filter(tag => tags.includes(tag));
        if (tagIntersection.length === 0) {
            return false;
        }

        // Check if the item exists in List2
        const existsInList2 = prevBuff.Commercials.some(list2Item => list2Item.Path === item.Path);
        if (existsInList2) {
            return false;
        }

        // If all checks pass, include the item in the filtered result
        return true;
    });
}

function hasCommercialsUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Commercials.filter(
        sc => sc.Duration <= duration && !selectedMedia.Commercials.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}

function hasShortsUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Shorts.filter(
        sc => sc.Duration <= duration && !selectedMedia.Shorts.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}

function hasMusicUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Music.filter(
        sc => sc.Duration <= duration && !selectedMedia.Music.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}