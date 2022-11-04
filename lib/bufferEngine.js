'use strict';
var _ = require('lodash');

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
const loadBufferBlock = (duration, highestClipDuration, commercialList, promoList) => {
    let tempDuration = duration;
    let selectedCommercials = [];
    let selectedPromos = [];
    while (tempDuration < duration - highestClipDuration) {
        let tempList = commercialList.filter(item => {
            return !selectedCommercials.find(obj => {
                return item.path === obj.path;
            })
        });

        tempList.push(...promoList.filter(item => {
            return !selectedPromos.find(obj => {
                return item.path === obj.path;
            });
        }));
        let pick = tempList[Math.floor(Math.random() * tempList.length) | 0];
        tempDuration = tempDuration + pick.duration;
        if (pick.type = "C") {
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

const loadNonRepeatClips = (commercialList, promoList, selectedCommercials, selectedPromos) => {
    let unusedClips = commercialList.filter(item => {
        return !selectedCommercials.find(obj => {
            return item.path === obj.path;
        })
    });
    unusedClips.push(...promoList.filter(item => {
        return !selectedPromos.find(obj => {
            return item.path === obj.path;
        });
    }));
    return unusedClips;
}

const loadRemainderClips = (duration, commercialList, promoList, selectedCommercials, selectedPromos) => {
    let unusedClips = loadNonRepeatClips(commercialList, promoList, selectedCommercials, selectedPromos);
    return unusedClips.filter(clip => clip.duration < duration + 5 && clip.duration > duration - 5);
}

const loadBufferRemainder = (remainder, clipList) => {
    let selectedCommercials = [];
    let selectedPromos = [];
    //Find any clips that are + or - 5 seconds the full duration of the remainder
    let fullRemainderClips = clipList
        .filter(clip => clip.duration < remainder + 5 && clip.duration > remainder - 5);
    //If no full remainder Clips Are found, try to combine clips to fill the remainder time
    if (fullRemainderClips.length < 1) {
        //Get a list of all the durations of clips available that have durations less than the remainder      
        let uniqueClipDurations = _.uniq(clipList
            .filter(clip => clip.duration < remainder)
            .duration);

        let indexes = [];
        if (uniqueClipDurations.length > 1) {
            for (let i = 0; i < uniqueClipDurations.length; i++) {
                for (let j = i + 1; j < uniqueClipDurations.length; j++) {
                    if (uniqueClipDurations[i] + uniqueClipDurations[j] === remainder) {
                        let combo = [i, j];
                        indexes.push(combo);
                    }
                }
            }
        } else {
            indexes.push([uniqueClipDurations[0]]);
        }

        let selectedIndexes = indexes[Math.floor(Math.random() * indexes.length) | 0];
        selectedIndexes.forEach(index => {
            let durationList = clipList.filter(clip => clip.duration === index);
            let selectedClip = durationList[Math.floor(Math.random() * durationList.length) | 0];
            if (selectedClip.type === "C") {
                selectedCommercials.push(selectedClip);
            } else {
                selectedPromos.push(selectedClip);
            }
        });

    } else {
        if (fullRemainderClips.length === 2) {
            if (fullRemainderClips[0].duration === fullRemainderClips[0].duration) {
                let selectedClip = fullRemainderClips[Math.floor(Math.random() * fullRemainderClips.length) | 0];
                if (selectedClip.type === "C") {
                    selectedCommercials.push(selectedClip);
                } else {
                    selectedPromos.push(selectedClip);
                }
            } else {
                //TODO: Check to see which clip is closer to the remainder time and pick the closest using absolute 
                //value
            }

        } else if (fullRemainderClips.length === 1) {

        } else {
            //TODO: Check to see which clip is closer to the remainder time and pick the closest using absolute 
            //value.If multiple are the "closest", pick one at random from among those results
        }
    }
    return {
        commercials: selectedCommercials,
        promos: selectedPromos
    }
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
    let highestClipDuration = 0; // Highest duration in seconds of clips that fit within the { duration }

    /*  
    Check to see if Promo List has at least one item that has a duration less than or equal to { duration } as 
    there is an inherent rule here baked in that there will always be at least 1 promo item between each 
    episode(Promos are both Block and stream specific)
    */
    if (duration > 15 && promoList.some(item => item.duration <= duration)) {

        //TODO: 

        //Find the highest duration to allow a duration at the end of the buffer to ensure the final clip 
        //selected is never longer than the remainder of the buffer
        highestClipDuration = getHighestClipDuration(duration, commercialList, promoList);

        //Select One Promo that has a duration less than or equal to the { duration } time and add it to selected 
        //Promos.There will always be one Promo per buffer if available.
        let designatedPromo = promoList
            .filter(item => item.duration <= duration)[Math.floor(Math.random() * tempList.length) | 0];
        selectedPromos.push(designatedPromo);
        currentDuration = currentDuration + designatedPromo.duration;

        //Select shows for buffer leaving a remainder duration to be filled byt a different process in order to 
        //ensure show cadence
        let bufferBlock = loadBufferBlock(currentDuration, highestClipDuration, commercialList, promoList);
        selectedCommercials = bufferBlock.commercials;
        selectedPromos.push(...bufferBlock.promos);
        currentDuration = currentDuration + bufferBlock.duration

        let remainder = duration - currentDuration;

        //Check if any clips fit the remainder, if not, skip as it is unlikely to be a duration that matters. The 
        //offset will be corrected by the cadence engine
        let finalClips = loadRemainderClips(
            remainder,
            commercialList,
            promoList,
            selectedCommercials,
            selectedPromos);

        if (finalClips.length > 0) {
            let selectedFinalClips = loadBufferRemainder(remainder, finalClips);
            selectedCommercials.push(...selectedFinalClips.commercials);
            selectedPromos.push(...selectedFinalClips.promos);
        }
    } else {
        selectedPromos.push({
            "path": defaultPromo.Path,
            "type": "P",
            "duration": parseInt(defaultPromo.Duration)
        });
    }

    return {
        "selectedCommercials": selectedCommercials,
        "selectedPromos": selectedPromos,
        "selectedFillerShows": selectedFillerShows
    }
}