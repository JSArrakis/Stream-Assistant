'use strict';
const _ = require('lodash');

exports.createProceduralBlockBuffer = (duration,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic,
    defaultPromo,
    chosenTags,
    mediaATags,
    mediaBTags) => {

    if (mediaATags === undefined) {
        mediaATags = [];
    }

    if (mediaBTags === undefined) {
        mediaBTags = [];
    }


    console.log(chosenTags);
    console.log(mediaATags);
    console.log(mediaBTags);

    let items = [];

    let nonRepeatClips = module.exports.selectNonRepeatProceduralBuffer(commercials,
        shorts,
        music,
        previousCommercials,
        previousShorts,
        previousMusic);

    let selectedBuffer = module.exports.streamBufferGenerator(duration,
        nonRepeatClips.Commercials,
        nonRepeatClips.Shorts,
        nonRepeatClips.Music,
        defaultPromo);

    let shuffledBuffer = module.exports.bufferShuffle(selectedBuffer.selectedCommercials,
        selectedBuffer.selectedShorts,
        selectedBuffer.selectedMusic,
        defaultPromo);

    shuffledBuffer.forEach(clip => items.push(clip.path));

    return {
        "Items": items,
        "Duration": duration,
        "selectedCommercials": selectedBuffer.selectedCommercials,
        "selectedShorts": selectedBuffer.selectedShorts,
        "selectedMusic": selectedBuffer.selectedMusic
    }
}

exports.selectNonRepeatProceduralBuffer = (commercials, shorts, music, previousCommercials, previousShorts, previousMusic) => {
    let previousCommercialPaths = [];
    let previousShortsPaths = [];
    let previousMusicPaths = [];
    previousCommercials.forEach(item => previousCommercialPaths.push(item.path));
    previousShorts.forEach(item => previousShortsPaths.push(item.path));
    previousMusic.forEach(item => previousMusicPaths.push(item.path));
    return {
        "Commercials": commercials.filter(item => previousCommercialPaths.indexOf(item.path) === -1),
        "Shorts": shorts.filter(item => previousShortsPaths.indexOf(item.path) === -1),
        "Music": music.filter(item => previousMusicPaths.indexOf(item.path) === -1)
    }
}

exports.bufferShuffle = (commercials, shorts, music, selectedPromo) => {
    let sequence = [];
    let combo = [];

    combo.push(...commercials);
    combo.push(...shorts);
    combo.push(...music);

    let shuffledCombo = _.shuffle(combo);
    let half = Math.ceil(shuffledCombo.length / 2);
    let firstHalf = shuffledCombo.slice(0, half);
    let secondHalf = shuffledCombo.slice(half);

    sequence.push(...firstHalf);
    sequence.push(selectedPromo);
    sequence.push(...secondHalf);

    return sequence;
}

const loadUniqueMediaUnderDuration = (target,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic,
    initialPromo) => {

    let previousSelectedPromos = [];
    previousSelectedPromos.push(...previousPromos);
    if (initialPromo !== undefined) {
        previousSelectedPromos.push(initialPromo);
    }
    let targetClips = [];
    let commercialsUnderTarget = commercials.filter(clip => clip.duration < target);
    let promosUnderTarget = promos.filter(clip => clip.duration < target);
    let shortsUnderTarget = shorts.filter(clip => clip.duration < target);
    let musicUnderTarget = music.filter(clip => clip.duration < target);

    commercialsUnderTarget.forEach(clip => {
        if (previousCommercials.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    });

    promosUnderTarget.forEach(clip => {
        if (previousSelectedPromos.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    })

    shortsUnderTarget.forEach(clip => {
        if (previousShorts.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    });

    musicUnderTarget.forEach(clip => {
        if (previousMusic.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    })

    return targetClips;
}

const hasUniqueMediaUnderDurationAvailable = (target,
    commercials,
    promos,
    shorts,
    music,
    previousCommercials,
    previousPromos,
    previousShorts,
    previousMusic,
    initialPromo) => {

    let targetClips = loadUniqueMediaUnderDuration(target,
        commercials,
        promos,
        shorts,
        music,
        previousCommercials,
        previousPromos,
        previousShorts,
        previousMusic,
        initialPromo);

    return targetClips.length > 0;
}

const loadBufferRemainder = (remainder, clipList) => {
    let selectedCommercials = [];
    let selectedPromos = [];
    let selectedShorts = [];
    let selectedMusic = [];
    let mediaSelected = false;
    //Find any clips that are + or - 5 seconds the full duration of the remainder
    let fullRemainderClips = clipList
        .filter(clip => clip.duration === remainder);
    //If no full remainder Clips Are found, try to combine clips to fill the remainder time
    if (fullRemainderClips.length < 1) {
        //Get a list of all the durations of clips available that have durations less than the remainder    
        let clipDurations = [];
        let clipsUnderDuration = clipList.filter(clip => clip.duration < remainder);
        clipsUnderDuration.forEach(clip => {
            clipDurations.push(clip.duration);
        });
        let uniqueClipDurations = _.uniq(clipDurations);
        let indexes = [];
        if (uniqueClipDurations.length > 1) {
            for (let i = 0; i < uniqueClipDurations.length; i++) {
                for (let j = i + 1; j < uniqueClipDurations.length; j++) {
                    if (uniqueClipDurations[i] + uniqueClipDurations[j] === remainder) {
                        let combo = [uniqueClipDurations[i], uniqueClipDurations[j]];
                        indexes.push(combo);
                    }
                }
            }
        } else {
            indexes.push([uniqueClipDurations[0]]);
        }
        if (indexes.length > 0) {
            let selectedIndexes = indexes[Math.floor(Math.random() * indexes.length) | 0];
            selectedIndexes.forEach(index => {
                let durationList = clipList.filter(clip => clip.duration === index);
                let selectedClip = durationList[Math.floor(Math.random() * durationList.length) | 0];
                if (selectedClip.type === "C") {
                    selectedCommercials.push(selectedClip);
                } else if (selectedClip.type === "P") {
                    selectedPromos.push(selectedClip);
                } else if (selectedClip.type === "S") {
                    selectedShorts.push(selectedClip);
                } else {
                    selectedMusic.push(selectedClip);
                }
            });
            mediaSelected = true;
        }

    } else {
        if (fullRemainderClips.length === 2) {
            if (fullRemainderClips[0].duration === fullRemainderClips[1].duration) {
                let selectedClip = fullRemainderClips[Math.floor(Math.random() * fullRemainderClips.length) | 0];
                if (selectedClip.type === "C") {
                    selectedCommercials.push(selectedClip);
                } else if (selectedClip.type === "P") {
                    selectedPromos.push(selectedClip);
                } else if (selectedClip.type === "S") {
                    selectedShorts.push(selectedClip);
                } else {
                    selectedMusic.push(selectedClip);
                }
                mediaSelected = true;
            } else {
                let finalClip = findClosestClip(remainder, fullRemainderClips);
                if (finalClip.type === "C") {
                    selectedCommercials.push(finalClip);
                } else if (finalClip.type === "P") {
                    selectedPromos.push(finalClip);
                } else if (finalClip.type === "S") {
                    selectedShorts.push(finalClip);
                } else {
                    selectedMusic.push(finalClip);
                }
                mediaSelected = true;
            }

        } else if (fullRemainderClips.length === 1) {
            let finalClip = fullRemainderClips[0];
            if (finalClip.type === "C") {
                selectedCommercials.push(finalClip);
            } else if (finalClip.type === "P") {
                selectedPromos.push(finalClip);
            } else if (finalClip.type === "S") {
                selectedShorts.push(finalClip);
            } else {
                selectedMusic.push(finalClip);
            }
            mediaSelected = true;
        } else {
            let finalClip = findClosestClip(remainder, fullRemainderClips);
            if (finalClip.type === "C") {
                selectedCommercials.push(finalClip);
            } else if (finalClip.type === "P") {
                selectedPromos.push(finalClip);
            } else if (finalClip.type === "S") {
                selectedShorts.push(finalClip);
            } else {
                selectedMusic.push(finalClip);
            }
            mediaSelected = true;
        }
    }

    return {
        commercials: selectedCommercials,
        promos: selectedPromos,
        shorts: selectedShorts,
        music: selectedMusic,
        mediaSelected: mediaSelected
    }
}

/**
 * @param targetDuration The duration in seconds of the buffer time needed to be created to ensure the next show starts 
 * on the half hour or hour block mark.
 * @param highestMediaDuration Highest duration in seconds of media from the commercial and promo lists that fit 
 *  within the { duration }
 * @param commercials List of commercial that have both a path and duration property, where the path is 
 *  the path to the commercial and the duration is the length in seconds of the commercial.
 * @param promos List of promos relative to the stream and block that have both a path and duration 
 *  property, where the path is the path to the promo and the duration is the length in seconds of the promo.
 */
const loadProceduralBufferBlock = (targetDuration, commercials, promos, shorts, music, initialPromo) => {
    const target = targetDuration
    let currentDuration = 0;
    let selectedCommercials = [];
    let selectedPromos = [];
    let selectedShorts = [];
    let selectedMusic = [];
    let canFindClipInDuration = true;

    while (hasUniqueMediaUnderDurationAvailable(target - currentDuration,
        commercials,
        promos,
        shorts,
        music,
        selectedCommercials,
        selectedPromos,
        selectedShorts,
        selectedMusic,
        initialPromo)
        && currentDuration < target && canFindClipInDuration) {
        let currentRemainder = target - currentDuration;

        let tempList = []
        let commIterator = 2
        if (currentRemainder > 240
            && hasUniqueMediaUnderDurationAvailable(
                currentRemainder - 240,
                [], [],
                shorts,
                music,
                [], [],
                selectedShorts,
                selectedMusic,
                initialPromo)
            && commIterator === 2) {

            tempList = loadUniqueMediaUnderDuration(
                currentRemainder - 240,
                [], [],
                shorts,
                music,
                [], [],
                selectedShorts,
                selectedMusic,
                initialPromo);
            commIterator = 0;

        } else {

            tempList = loadUniqueMediaUnderDuration(currentRemainder,
                commercials,
                promos,
                shorts,
                music,
                selectedCommercials,
                selectedPromos,
                selectedShorts,
                selectedMusic,
                initialPromo);

            commIterator++
        }

        let picks = [];
        if (currentRemainder < 60) {

            let selectedMedia = loadBufferRemainder(currentRemainder, tempList);
            picks.push(...selectedMedia.commercials);
            picks.push(...selectedMedia.promos);
            picks.push(...selectedMedia.shorts);
            picks.push(...selectedMedia.music);

            canFindClipInDuration = selectedMedia.mediaSelected;

        } else {
            picks.push(tempList[Math.floor(Math.random() * tempList.length) | 0]);
        }
        picks.forEach(pick => {
            currentDuration = currentDuration + pick.duration;
            if (pick.type === "C") {
                selectedCommercials.push(pick);
            } else if (pick.type === "P") {
                selectedPromos.push(pick);
            } else if (pick.type === "S") {
                selectedShorts.push(pick);
            } else {
                selectedMusic.push(pick);
            }
        });
    }
    return {
        duration: currentDuration,
        commercials: selectedCommercials,
        promos: selectedPromos,
        shorts: selectedShorts,
        music: selectedMusic
    }
}

const getClosestValue = (value, array) => {
    return array.reduce((a, b) => {
        let aDiff = Math.abs(a - value);
        let bDiff = Math.abs(b - value);

        if (aDiff == bDiff) {
            return a > b ? a : b;
        } else {
            return bDiff < aDiff ? b : a;
        }
    });
}

const findClosestClip = (duration, clipList) => {
    let uniqueDurations = [];
    clipList.forEach(clip => {
        uniqueDurations.push(clip.duration);
    })
    let closestDuration = getClosestValue(duration, uniqueDurations);
    let selectedClips = clipList.filter(clip => clip.duration = closestDuration);
    return selectedClips[Math.floor(Math.random() * selectedClips.length) | 0];
}

/**
 * @param duration The duration in seconds of the buffer time needed to be created to ensure the next show starts 
 *  on the half hour or hour block mark.
 * @param commercialList List of commercial clips that have both a path and duration property, where the path is 
 *  the path to the commercial clip and the duration is the length in seconds of the commercial.
 * @param promoList List of promo clips relative to the stream and block that have both a path and duration 
 *  property, where the path is the path to the promo clip and the duration is the length in seconds of the promo.
 */
exports.streamBufferGenerator = (targetDuration, commercials, promos, shorts, music, defaultPromo) => {

    let selectedCommercials = []; // List of Commercials selected for the buffer
    let selectedPromos = []; // List of Promos selected for the buffer
    let selectedShorts = []; // List of Shorts selected for the buffer
    let selectedMusic = []; // List of Music selected for the buffer
    let currentDuration = 0; // Current duration in seconds of all selected clips

    /*
    Check to see if Promo List has at least one item that has a duration less than or equal to { duration } as 
    there is an inherent rule here baked in that there will always be at least 1 promo item between each 
    episode(Promos are both Block and stream specific)
    */
    let promosWithinDuration = promos.filter(item => item.duration * 2 <= targetDuration);
    if (targetDuration > defaultPromo.duration) {
        //Select One Promo that has a duration less than or equal to the { duration } time and add it to selected
        //Promos. There will always be one Promo per buffer if available.
        let initialPromo = defaultPromo;
        if (promosWithinDuration.some(x => x)) {
            initialPromo = promosWithinDuration[Math.floor(Math.random() * promosWithinDuration.length) | 0];
        }
        selectedPromos.push(initialPromo);
        currentDuration = currentDuration + initialPromo.duration;

        //Select shows for buffer leaving a remainder duration to be filled byt a different process in order to
        //ensure show cadence
        let remainder = targetDuration - currentDuration; 0
        //TODO: Only load additional promos if buffer duration is above X
        let bufferBlock = loadProceduralBufferBlock(remainder,
            commercials,
            promos,
            shorts,
            music,
            initialPromo);

        selectedCommercials = bufferBlock.commercials;
        selectedPromos.push(...bufferBlock.promos);
        selectedShorts = bufferBlock.shorts;
        selectedMusic = bufferBlock.music;
        currentDuration = currentDuration + bufferBlock.duration
    } else {
        selectedPromos.push({
            "path": defaultPromo.path,
            "type": "P",
            "duration": parseInt(defaultPromo.duration)
        });
        currentDuration = currentDuration + defaultPromo.duration;
    }

    return {
        "duration": currentDuration,
        "selectedCommercials": selectedCommercials,
        "selectedPromos": selectedPromos,
        "selectedShorts": selectedShorts,
        "selectedMusic": selectedMusic
    }
}