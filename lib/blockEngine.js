'use strict';
const showList = require("../data/showList.json");
const movieList = require("../data/movieList.json");
const collectionList = require("../data/collectionList.json");
const bufferEng = require("./bufferEngine.js");
const utilities = require("./utilities");

const parseBlocks = (blocks) => {
    let parsedBlocks = [];
    blocks.forEach(item => {
        let splitItem = item.split("::");
        parsedBlocks.push({
            "Title": splitItem[0],
            "Time": splitItem[1]
        })
    });
    return parsedBlocks;
}

exports.createCollectionBlocks = (config, blocks, progression) => {
    let blockList = []; // List of themed collections of shows bumpers commercials and movies usually with their
    //own rules of construction.These show and movie selections are curated and agnostic to the general stream

    //Parse block requests into readable objects
    let parsedBlocks = parseBlocks(blocks);

    //Create each collection block
    parsedBlocks.forEach(block => {
        //Get object that contains all the information needed to create the selected block
        let blockPaths = collectionList.filter(item => item.Title === block.Title)[0];
        //Check if progression object exists for this block. If not create it and push it into the progression 
        //array
        if (!progression.some(progItem => progItem.Title === blockPaths.Title)) {
            progression.push({
                "Title": blockPaths.Title,
                "Type": "Collection",
                "Shows": []
            });
        }
        //Get designated commercials for this specific block
        let blockCommercials = utilities.clipSelector(blockPaths.Commercials, "C");
        let blockPromos = utilities.clipSelector(blockPaths.Promos, "P");
        let previousCommercials = [];
        let previousPromos = [];
        let fillerShows = [];
        let carryOver = 0;
        //Create a block object to be populated with the show items in order and passed to the main stream for 
        //consumption
        let createdBlock = {
            "Title": blockPaths.Title,
            "Time": block.Time,
            "Duration": 0,
            "Items": []
        }

        //Sort the shows of the selected block by their preselected sequence
        let sortedBlockShows = blockPaths.Shows.sort((a, b) => {
            return a.Sequence - b.Sequence;
        });


        let skipShow = false; /*This is a controller to determine if a show is populated in the block. If the show 
            runs longer than the alloted time block for that show by X seconds (set in config), skip the show 
            following it. Time remaining will be filled with filler shows and promos */

        /*
        -- Author note:: A good example of this is with the summer 2000 broadcast of Toonami with Tenchi Muyo. 
        Tenchi has a few episodes that are weirdly 45 minutes instead of 30 minutes randomly with no real rhyme 
        or reason. To handle this randomness, Toonami in it's original broadcast pulled the episode of Batman the 
        Animated series which usually followed Tenchi for that day only and populated the remainder of the 
        15 minutes that would have normally been Batman with Power Puff Girl episodes instead. This allowed 
        Toonami to keep the fidelity of a 3 hour block and decreasing dead time and keeping interest of the 
        audience while staying within theme (Toonami being a series of mostly violence driven animated shows 
        in which the only Cartoon Network licensed property that fit in the alloted time slot that was also 
        themed correctly was PPG)
        */

        //Start populating this block's run episodes
        sortedBlockShows.forEach(sortedShow => {
            //If skipShow is false
            if (!skipShow) {
                //Try to get the show from the show list of the matching load title
                let selectedShow = showList.filter(sli => sli.LoadTitle === sortedShow.LoadTitle)[0];

                //Check if next show should be skipped
                if (sortedShow.DurationLimit + 60 < selectedShow.Duration) {
                    skipShow = true;
                }
                //If the show is found
                if (selectedShow !== undefined) {

                    let currentShowBlockDuration = 0; /*This value is the cumulative duration of the show, 
                    selected bumpers and commercials.This number is used in conjunction with the show block 
                    duration limit on the Show item in the Collection object*/

                    //Add the carry over to the current show block duration to help stabilize the timing of the block
                    currentShowBlockDuration = currentShowBlockDuration + carryOver;

                    //If the show is the first show in the block, then the collection start bumper duration needs 
                    //to be added to the initial show block.
                    if (sortedBlockShows.findIndex(x => x.LoadTitle === sortedShow.LoadTitle) === 0) {
                        //Push block starter bumper into the block 
                        createdBlock.Items.push(blockPaths.StartBumper.Path);
                        currentShowBlockDuration = currentShowBlockDuration + blockPaths.StartBumper.Duration;
                    }

                    //If Show doesnt exist in the current collection progression. Add a tracking object as the 
                    //first episode.
                    if (!progression.filter(pitem => pitem.Title === blockPaths.Title)[0]
                        .Shows.some(sitem => sitem.LoadTitle === selectedShow.LoadTitle)) {
                        progression.filter(pitem => pitem.Title === blockPaths.Title)[0]

                            .Shows.push({
                                "LoadTitle": selectedShow.LoadTitle,
                                "Episode": 1
                            });
                    }

                    //Add show start bumper and increment duration
                    if (sortedShow.BumperStart.length > 0) {
                        let bumpStart = sortedShow
                            .BumperStart[Math.floor(Math.random() * sortedShow.BumperStart.length)];
                        createdBlock.Items.push(bumpStart.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpStart.Duration
                    }

                    //Get current episode number
                    let currentEpisode = progression.filter(pitem => pitem.Title = blockPaths.Title)[0]
                        .Shows.filter(sitem => sitem.LoadTitle === selectedShow.LoadTitle)[0].Episode;

                    //Get Selected episode and increment duration
                    //TODO: If no more episodes in list, restart series
                    let selectedEpisode = selectedShow.Episodes[currentEpisode - 1];
                    createdBlock.Items.push(selectedEpisode.EpisodePath);
                    currentShowBlockDuration = currentShowBlockDuration + selectedEpisode.Duration

                    //Add show end bumper and increment duration
                    if (sortedShow.BumperEnd.length > 0) {
                        let bumpEnd = sortedShow.BumperEnd[Math.floor(Math.random() * sortedShow.BumperEnd.length)];
                        createdBlock.Items.push(bumpEnd.Path);
                        currentShowBlockDuration = currentShowBlockDuration + bumpEnd.Duration;
                    }

                    //Create buffer. Buffer consistency is based on whether or not the buffer is being created for the
                    //final show of the block
                    if (sortedBlockShows
                        .findIndex(x => x.LoadTitle === sortedShow.LoadTitle) + 1 === sortedBlockShows.length) {
                        createdBlock.Items.push(blockPaths.EndBumper.Path);
                        currentShowBlockDuration = currentShowBlockDuration + blockPaths.EndBumper.Duration;
                    }


                    let nonRepeatClips = bufferEng
                        .selectNonRepeatBuffer(blockCommercials, blockPromos, previousCommercials, previousPromos);

                    //TODO: Create Filler episode generation
                    let selectedClips = bufferEng
                        .blockBufferGenerator(sortedShow.DurationLimit - currentShowBlockDuration,
                            nonRepeatClips.Commercials,
                            nonRepeatClips.Promos,
                            fillerShows,
                            blockPaths.DefaultPromo);

                    currentShowBlockDuration = currentShowBlockDuration + selectedClips.duration;

                    let shuffledClips = bufferEng.bufferShuffle(
                        selectedClips.selectedCommercials,
                        selectedClips.selectedPromos,
                        selectedClips.selectedFillerShows);

                    shuffledClips.forEach(clip => createdBlock.Items.push(clip.path));
                    carryOver = sortedShow.DurationLimit - currentShowBlockDuration;
                }
                //If skipShow is True
            } else {
                //TODO: Filler shows and promos

                skipShow = false;
            }
        });

        blockList.push(createdBlock);
    });
    let sortedBlockList = _.sortBy(blockList, block => block.Time);
    //TODO: check to make sure no blocks conflict with eachother in timing
    return sortedBlockList;
}