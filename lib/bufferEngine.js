'use strict';
const _ = require('lodash');

exports.selectNonRepeatBuffer = (commercialList, promoList, previousCommercials, previousPromos) => {
    let previousCommercialPaths = [];
    let previousPromoPaths = [];
    previousCommercials.forEach(item => previousCommercialPaths.push(item.path));
    previousPromos.forEach(item => previousPromoPaths.push(item.path));
    return {
        "Commercials": commercialList.filter(item => previousCommercialPaths.indexOf(item.path) === -1),
        "Promos": promoList.filter(item => previousPromoPaths.indexOf(item.path) === -1)
    }
}

exports.selectNonRepeatProceduralBuffer = (commercials, promos, shorts, music, previousCommercials, previousPromos, previousShorts, previousMusic) => {
    let previousCommercialPaths = [];
    let previousPromoPaths = [];
    let previousShortsPaths = [];
    let previousMusicPaths = [];
    previousCommercials.forEach(item => previousCommercialPaths.push(item.path));
    previousPromos.forEach(item => previousPromoPaths.push(item.path));
    previousShorts.forEach(item => previousShortsPaths.push(item.path));
    previousMusic.forEach(item => previousMusicPaths.push(item.path));
    return {
        "Commercials": commercials.filter(item => previousCommercialPaths.indexOf(item.path) === -1),
        "Promos": promos.filter(item => previousPromoPaths.indexOf(item.path) === -1),
        "Shorts": shorts.filter(item => previousShortsPaths.indexOf(item.path) === -1),
        "Music": music.filter(item => previousMusicPaths.indexOf(item.path) === -1)
    }
}

exports.collectionBufferShuffle = (commercialList, promoList, fillerShowList) => {
    let sequence = [];
    let combo = [];
    combo.push(...commercialList);

    let shuffledCombo = _.shuffle(combo);
    let half = Math.ceil(shuffledCombo.length / 2);
    let firstHalf = shuffledCombo.slice(0, half);
    let secondHalf = shuffledCombo.slice(half);
    sequence.push(...firstHalf);
    if (promoList.length > 0) {
        combo.push(...promoList.slice(1));
        sequence.push(promoList[0]);
    }
    sequence.push(...fillerShowList);
    sequence.push(...secondHalf);
    return sequence;
}

exports.bufferShuffle = (commercials, promos, shorts, music, defaultPromo) => {
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
    sequence.push(defaultPromo);
    sequence.push(...secondHalf);

    return sequence;
}

/**
 * @param duration The duration in seconds of the buffer time needed to be created to ensure the next show starts 
 *  on the half hour or hour block mark.
 * @param commercialList List of commercial clips that have both a path and duration property, where the path is 
 *  the path to the commercial clip and the duration is the length in seconds of the commercial.
 * @param promoList List of promo clips relative to the stream and block that have both a path and duration 
 *  property, where the path is the path to the promo clip and the duration is the length in seconds of the promo.
 */
const getHighestClipDuration = (duration, commercialList, promoList) => {
    //Combine all clips into a single temporary list for duration evaluation to ascertain highest duration 
    //available within the { duration } available
    let tempCombined = [];
    let highestClipDuration = 0
    tempCombined.push(...commercialList);
    tempCombined.push(...promoList);
    //Set { highestClipDuration } to the highest duration available amongst all clips
    tempCombined
        .filter(item => item.duration <= duration)
        .forEach(clip => {
            if (clip.duration > highestClipDuration) {
                highestClipDuration = clip.duration
            }
        });
    return highestClipDuration;
}

const getHighestMediaDuration = (duration, commercials, promos, shorts, music) => {
    //Combine all clips into a single temporary list for duration evaluation to ascertain highest duration 
    //available within the { duration } available
    let tempCombined = [];
    let highestMediaDuration = 0
    tempCombined.push(...commercials);
    tempCombined.push(...promos);
    tempCombined.push(...shorts);
    tempCombined.push(...music);
    //Set { highestClipDuration } to the highest duration available amongst all clips
    tempCombined
        .filter(item => item.duration <= duration)
        .forEach(clip => {
            if (clip.duration > highestMediaDuration) {
                highestMediaDuration = clip.duration
            }
        });
    return highestMediaDuration;
}

const getLowestClipDuration = (duration, commercialList, promoList) => {
    //Combine all clips into a single temporary list for duration evaluation to ascertain lowest duration 
    //available within the { duration } available
    let tempCombined = [];
    let lowestClipDuration = 86400;
    tempCombined.push(...commercialList);
    tempCombined.push(...promoList);
    //Set { lowestClipDuration } to the lowest duration available amongst all clips
    tempCombined
        .filter(item => item.duration <= duration)
        .forEach(clip => {
            if (clip.duration < lowestClipDuration) {
                lowestClipDuration = clip.duration
            }
        });
    return lowestClipDuration;
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

const loadUniqueClipsUnderDuration = (target,
    commercialList,
    promoList,
    selectedCommercials,
    selectedPromos) => {

    let targetClips = [];
    let commercialsUnderTarget = commercialList.filter(clip => clip.duration < target);
    let promosUnderTarget = promoList.filter(clip => clip.duration < target);

    commercialsUnderTarget.forEach(clip => {
        if (selectedCommercials.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    });

    promosUnderTarget.forEach(clip => {
        if (selectedPromos.indexOf(clip) === -1) {
            targetClips.push(clip);
        }
    })

    return targetClips;
}


const hasUniqueClipsUnderDurationAvailable = (target,
    commercialList,
    promoList,
    selectedCommercials,
    selectedPromos) => {

    let targetClips = loadUniqueClipsUnderDuration(target,
        commercialList,
        promoList,
        selectedCommercials,
        selectedPromos);

    return targetClips.length > 0;
}

/**
 * @param duration The duration in seconds of the buffer time needed to be created to ensure the next show starts 
 * on the half hour or hour block mark.
 * @param highestClipDuration Highest duration in seconds of clips from the commercial and promo lists that fit 
 *  within the { duration }
 * @param commercialList List of commercial clips that have both a path and duration property, where the path is 
 *  the path to the commercial clip and the duration is the length in seconds of the commercial.
 * @param promoList List of promo clips relative to the stream and block that have both a path and duration 
 *  property, where the path is the path to the promo clip and the duration is the length in seconds of the promo.
 */
const loadCollectionBufferBlock = (duration, highestClipDuration, commercialList, promoList) => {
    const target = duration - highestClipDuration;
    let tempDuration = 0;
    let selectedCommercials = [];
    let selectedPromos = [];
    while (hasUniqueClipsUnderDurationAvailable(target - tempDuration,
        commercialList,
        promoList,
        selectedCommercials,
        selectedPromos)
        && tempDuration < target) {

        let tempList = loadUniqueClipsUnderDuration(target - tempDuration,
            commercialList,
            promoList,
            selectedCommercials,
            selectedPromos);
        let pick = tempList[Math.floor(Math.random() * tempList.length) | 0];
        tempDuration = tempDuration + pick.duration;
        if (pick.type === "C") {
            selectedCommercials.push(pick);
        } else {
            selectedPromos.push(pick);
        }

    }
    return {
        duration: tempDuration,
        commercials: selectedCommercials,
        promos: selectedPromos
    }
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
    console.log("Target Duration: ", targetDuration);

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

        console.log("Current Remainder: ", currentRemainder);
        let tempList = loadUniqueMediaUnderDuration(currentRemainder,
            commercials,
            promos,
            shorts,
            music,
            selectedCommercials,
            selectedPromos,
            selectedShorts,
            selectedMusic);
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
            console.log("Pick Duration: ", pick.duration, " Current Duration: ", currentDuration);
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
 * @param fillerShowList List of short shows (15 minutes or less) relative to the stream and block that have both 
 *  a path and duration property, where the path is the path to the show and the duration is the length in seconds 
 *  of the show.
 */
exports.bufferGenerator = (duration, commercialList, promoList, fillerShowList, defaultPromo) => {

    let selectedCommercials = []; // List of commercials selected for the buffer
    let selectedPromos = []; // List of Promos selected for the buffer
    let selectedFillerShows = []; // List of Filler Shows selected for the buffer
    let currentDuration = 0; // Current duration in seconds of all selected clips
    /*
    Check to see if Promo List has at least one item that has a duration less than or equal to { duration } as 
    there is an inherent rule here baked in that there will always be at least 1 promo item between each 
    episode(Promos are both Block and stream specific)
    */
    let promosWithinDuration = promoList.filter(item => item.duration <= duration);
    if (duration > 15 && promosWithinDuration.some(x => x)) {

        //Select One Promo that has a duration less than or equal to the { duration } time and add it to selected
        //Promos. There will always be one Promo per buffer if available.

        let designatedPromo = promosWithinDuration[Math.floor(Math.random() * promosWithinDuration.length) | 0];
        selectedPromos.push(designatedPromo);
        currentDuration = currentDuration + designatedPromo.duration;

        //Select shows for buffer leaving a remainder duration to be filled byt a different process in order to
        //ensure show cadence
        let remainder = duration - currentDuration;

        //Find the highest duration to allow a duration at the end of the buffer to ensure the final clip
        //selected is never longer than the remainder of the buffer
        let highestClipDuration = getHighestClipDuration(remainder, commercialList, promoList);

        let bufferBlock = loadCollectionBufferBlock(remainder, highestClipDuration / 2, commercialList, promoList);
        selectedCommercials = bufferBlock.commercials;
        selectedPromos.push(...bufferBlock.promos);
        currentDuration = currentDuration + bufferBlock.duration

        remainder = duration - currentDuration;

        //Check if any clips fit the remainder, if not, skip as it is unlikely to be a duration that matters. The 
        //offset will be corrected by the cadence engine
        let finalClips = loadUniqueClipsUnderDuration(remainder + 5,
            commercialList,
            promoList,
            selectedCommercials,
            selectedPromos);

        if (finalClips.length > 0) {
            let selectedFinalClips = loadBufferRemainder(remainder, finalClips);
            selectedCommercials.push(...selectedFinalClips.commercials);
            selectedPromos.push(...selectedFinalClips.promos);
            selectedFinalClips.commercials.forEach(clip => {
                currentDuration = currentDuration + clip.duration;
            })
            selectedFinalClips.promos.forEach(clip => {
                currentDuration = currentDuration + clip.duration;
            })
        }
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
        "selectedFillerShows": selectedFillerShows
    }
}

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
    let promosWithinDuration = promos.filter(item => item.duration <= targetDuration);
    if (targetDuration > 15) {
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

        // remainder = duration - currentDuration;

        // //Check if any clips fit the remainder, if not, skip as it is unlikely to be a duration that matters. The 
        // //offset will be corrected by the cadence engine
        // let finalClips = loadUniqueMediaUnderDuration(remainder,
        //     commercials,
        //     promos,
        //     shorts,
        //     music,
        //     selectedCommercials,
        //     selectedPromos,
        //     selectedShorts,
        //     selectedMusic);

        // if (finalClips.length > 0) {
        //     let selectedFinalClips = loadBufferRemainder(remainder, finalClips);
        //     selectedCommercials.push(...selectedFinalClips.commercials);
        //     selectedPromos.push(...selectedFinalClips.promos);
        //     selectedFinalClips.commercials.forEach(clip => {
        //         currentDuration = currentDuration + clip.duration;
        //     })
        //     selectedFinalClips.promos.forEach(clip => {
        //         currentDuration = currentDuration + clip.duration;
        //     })
        // }
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