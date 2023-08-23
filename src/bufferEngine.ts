import { Media } from "../models/media";
import { Promo } from "../models/promo";
import { TranslationTag } from "../models/translationTag";
import { Eras } from "../models/const/eras";
import { Commercial } from "../models/commercial";
import { Short } from "../models/short";
import { Music } from "../models/music";
import { SelectedMedia } from "../models/selectedMedia";

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
    duration: number,
    options: any,
    media: Media,
    precedingTags: string[],
    subsequentTags: string[],
    translationTags: TranslationTag[],
    prevBuff: Media): [(Promo | Music | Short | Commercial)[], number] {
    let buffer: (Promo | Music | Short | Commercial)[] = [];

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
    let halfA: number = 0;
    if (remDur >= 30) {
        halfA = Math.ceil(remDur / 2)
    }
    let halfB: number = remDur - halfA;

    if (subsequentTags.length > 0 && precedingTags.length > 0) {
        //No media before this or very short buffer duration,
        //no time for more than a promo and maybe 1 or 2 commercials
        //So to theme this we will put the proomo in the front of the buffer
        //and theme the buffer to the next set of tags
        //This also works for the duration above 30 seconds when it is the first buffer
        //before the staged media starts
        if (halfA === 0) {
            buffer.push(promo)
            let selectedB = selectBuffer(remDur, media, convertedSubTags, prevBuff);
            buffer.push(...selectedB[0]);
            return [buffer, selectedB[1]]
        } else {
            let selectedA = selectBuffer(halfA, media, convertedPreTags, prevBuff);
            buffer.push(...selectedA[0]);
            buffer.push(promo);
            let selectedB = selectBuffer(halfB + selectedA[1], media, convertedSubTags, prevBuff);
            buffer.push(...selectedB[0]);
            return [buffer, selectedB[1]]
        }
    } else if (precedingTags.length > 0) {
        //TODO Devise a signoff set
        let selectedB = selectBuffer(remDur - promo.Duration, media, convertedPreTags, prevBuff);
        buffer.push(promo)
        buffer.push(...selectedB[0]);
        buffer.push(promo)
        return [buffer, selectedB[1]]
    } else {
        //TODO Devise a stream start set
        //TODO Devise a cycle start set
        let selectedB = selectBuffer(remDur, media, convertedSubTags, prevBuff);
        buffer.push(...selectedB[0]);
        buffer.push(promo)
        return [buffer, selectedB[1]]
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

export function selectBuffer(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media): [(Music | Short | Commercial)[], number] {

    let buffer: (Music | Short | Commercial)[] = [];
    let remainder = duration;

    let bufferBlacklist: Media = new Media([], [], [], [], [], [], []);
    bufferBlacklist.Commercials = prevBuff.Commercials;
    bufferBlacklist.Music = prevBuff.Music;
    bufferBlacklist.Shorts = prevBuff.Shorts;

    let bufferBlock = fillTargetedBuffer(remainder, media, tags, bufferBlacklist);
    buffer.push(...bufferBlock[0]);
    remainder = bufferBlock[1];

    prevBuff.Commercials = bufferBlock[2].Commercials;
    prevBuff.Music = bufferBlock[2].Music;
    prevBuff.Shorts = bufferBlock[2].Shorts;

    return [buffer, remainder];
}

function fillTargetedBuffer(duration: number, media: Media, tags: TranslatedTags, bufferBlacklist: Media): [(Music | Short | Commercial)[], number, Media] {
    let buffer: (Music | Short | Commercial)[] = [];
    let taggedMedia: Media = new Media([], [], [], [], [], [], []);
    let selectedMedia: Media = new Media([], [], [], [], [], [], []);
    taggedMedia.Shorts = getBufferShorts(duration, media, tags, bufferBlacklist);
    taggedMedia.Music = getBufferMusic(duration, media, tags, bufferBlacklist);
    taggedMedia.Commercials = getBufferCommercials(duration, media, tags, bufferBlacklist);
    let remainder = duration;

    let alternator: Boolean = true;

    while (remainder > 0 && hasCommercialsUnderDuration(remainder, media, bufferBlacklist)) {

        let musicAvailable: boolean = hasMusicUnderDuration(remainder, taggedMedia, bufferBlacklist);
        let shortsAvailable: boolean = hasShortsUnderDuration(remainder, taggedMedia, bufferBlacklist);

        if (musicAvailable || shortsAvailable) {
            if (alternator) {
                let commBuff: Commercial[] = [];
                let commRemain: number = 120;
                let commDur: number = 0;
                if (remainder < commRemain) {
                    commRemain = remainder;
                }
                while (commRemain > 0 && hasCommercialsUnderDuration(commRemain, media, bufferBlacklist)) {
                    let selectedComm = selectCommercial(duration, taggedMedia, media, bufferBlacklist);
                    commBuff.push(selectedComm[0]);
                    commRemain = commRemain - selectedComm[1];
                    commDur = commDur + selectedComm[1];
                    bufferBlacklist.Commercials.push(selectedComm[0]);
                }

                buffer.push(...commBuff);
                selectedMedia.Commercials.push(...commBuff);
                remainder = remainder - commDur;
                alternator = false;

            } else {
                let selectedMoS = selectMusicOrShort(duration, taggedMedia, bufferBlacklist);
                buffer.push(selectedMoS[0]);
                if (selectedMoS[0] instanceof Music) {
                    selectedMedia.Music.push(selectedMoS[0]);
                    bufferBlacklist.Music.push(selectedMoS[0]);
                } else {
                    selectedMedia.Shorts.push(selectedMoS[0]);
                    bufferBlacklist.Shorts.push(selectedMoS[0]);
                }
                remainder = remainder - selectedMoS[1];
                alternator = true;

            }
        } else {
            let commBuff: Commercial[] = [];
            let commRemain: number = 120;
            let commDur: number = 0;
            if (remainder < commRemain) {
                commRemain = remainder;
            }
            while (commRemain > 0 && hasCommercialsUnderDuration(commRemain, media, bufferBlacklist)) {
                let selectedComm = selectCommercial(commRemain, taggedMedia, media, bufferBlacklist);
                commBuff.push(selectedComm[0]);
                commRemain = commRemain - selectedComm[1];
                commDur = commDur + selectedComm[1];
                bufferBlacklist.Commercials.push(selectedComm[0]);
            }

            buffer.push(...commBuff);
            selectedMedia.Commercials.push(...commBuff);
            remainder = remainder - commDur;
        }
    }
    return [buffer, remainder, selectedMedia];
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

export function selectCommercial(duration: number, taggedMedia: Media, media: Media, prevBuff: Media): [Commercial, number] {
    let taggedCandidates = getCommercials(duration, taggedMedia, prevBuff);
    if (taggedCandidates.length > 0) {
        let fullDur: Commercial[] = []
        if (duration <= 45) {
            fullDur = taggedCandidates.filter(can => can.Duration == duration);
        }
        if (fullDur.length > 0) {
            let sel = fullDur[Math.floor(Math.random() * fullDur.length)];
            return [sel, sel.Duration];
        } else {
            let sel = taggedCandidates[Math.floor(Math.random() * taggedCandidates.length)];
            return [sel, sel.Duration];
        }
    } else {
        //TODO: Blacklist per genre
        //TODO: Walking genre
        let untaggedCandidates = getCommercials(duration, media, prevBuff);
        let fullDur: Commercial[] = []
        if (duration <= 45) {
            fullDur = untaggedCandidates.filter(can => can.Duration == duration);
        }
        if (fullDur.length > 0) {
            let sel = fullDur[Math.floor(Math.random() * fullDur.length)];
            return [sel, sel.Duration];
        } else {
            let sel = untaggedCandidates[Math.floor(Math.random() * untaggedCandidates.length)];
            return [sel, sel.Duration];
        }
    }
}

export function getBufferMusic(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media) {
    let music: Music[] = [];
    music.push(...getTagMusic(duration, media, tags.MainTags, prevBuff));
    return music;
}

export function getBufferShorts(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media) {
    let shorts: Short[] = [];
    shorts.push(...getTagShorts(duration, media, tags.MainTags, prevBuff));
    return shorts;
}

export function getBufferCommercials(duration: number, media: Media, tags: TranslatedTags, prevBuff: Media): Commercial[] {
    let commercials: Commercial[] = [];
    commercials.push(...getTagCommercials(duration, media, tags.MainTags, prevBuff));
    commercials.push(...getTagCommercials(duration, media, tags.SecondaryTags, prevBuff));
    return commercials;
}

export function getTagMusic(duration: number, media: Media, tags: string[], prevBuff: Media): Music[] {
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

export function getTagShorts(duration: number, media: Media, tags: string[], prevBuff: Media): Short[] {
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

export function getCommercials(duration: number, media: Media, prevBuff: Media): Commercial[] {
    //get genre commercials under duration
    return media.Commercials.filter(
        sc => sc.Duration <= duration && !prevBuff.Commercials.some(selected => selected.Path === sc.Path)
    );
}

export function getTagCommercials(duration: number, media: Media, tags: string[], prevBuff: Media): Commercial[] {
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

export function hasCommercialsUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Commercials.filter(
        sc => sc.Duration <= duration && !selectedMedia.Commercials.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}

export function hasShortsUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Shorts.filter(
        sc => sc.Duration <= duration && !selectedMedia.Shorts.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}

export function hasMusicUnderDuration(duration: number, media: Media, selectedMedia: Media): boolean {
    let underDuration = media.Music.filter(
        sc => sc.Duration <= duration && !selectedMedia.Music.some(selected => selected.Path === sc.Path)
    );
    return underDuration.length > 0;
}