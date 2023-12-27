// src/services/backgroundService.ts

import moment from 'moment';
import { constructStream } from './streamConstructorService';
import { StreamArgs } from '../models/streamArgs';
import { addToOnDeckStream, getConfig, getContinuousStreamArgs, getOnDeckStream, isContinuousStream, removeFromOnDeckStream, removeFromUpcomingStream } from './streamService';
import { MediaBlock } from '../models/mediaBlock';
import * as VLC from 'vlc-client';
import { getMedia } from '../../dataAccess/dataManager';

const intervalInSeconds: number = 300;
let vlc: VLC.Client;
let endOfDayMarker: number = 0;
let tomorrow: number = 0;

function calculateDelayToNextInterval(intervalInSeconds: number): number {
    const now = moment().unix();
    console.log(`Current Unix Timestamp: ${now}`);
    const secondsToNextInterval = intervalInSeconds - (now % intervalInSeconds);
    console.log(`Seconds to next interval: ${secondsToNextInterval}`);
    return secondsToNextInterval * 1000; // Convert seconds to milliseconds
}

function setEndOfDayMarker() {
    endOfDayMarker = moment().set({ hour: 23, minute: 30, second: 0 }).unix();
}

function setTomorrow() {
    tomorrow = moment().add(1, 'days').set({ hour: 0, minute: 0, second: 0 }).unix();
}

async function cycleCheck() {
    const currentUnixTimestamp = moment().unix();
    console.log(`Current Unix Timestamp: ${currentUnixTimestamp}`);
    let onDeck: MediaBlock[] = getOnDeckStream()
    if (onDeck.length >= 2) {
        console.log("Target Unix Timestamp: " + onDeck[1].StartTime);
    } else {
        console.log("There arent enough items in the on deck stream to check for a new item");
    }
    if (onDeck.length >= 1 && currentUnixTimestamp === onDeck[0].StartTime) {
        console.log(onDeck[0].MainBlock?.Title + " is starting now");
    }

    if (isContinuousStream() && onDeck.length >= 2) {
        if (onDeck[1].StartTime && currentUnixTimestamp >= onDeck[1].StartTime) {
            let removed = removeFromOnDeckStream();
            if (removed != null || removed != undefined) {
                console.log("Removing " + removed.MainBlock?.Title + " and post buffer from On Deck Stream");
            }
            let added = removeFromUpcomingStream();
            if (added != null || added != undefined) {
                console.log("Adding " + added.MainBlock?.Title + " to On Deck Stream");
            }
            if (added != null || added != undefined) {
                addToOnDeckStream([added]);
                await addMediaBlock(added);
            }
        }
    }

    if (currentUnixTimestamp >= tomorrow) {
        setTomorrow()
    }

    if (currentUnixTimestamp >= endOfDayMarker) {
        setEndOfDayMarker();
        if (isContinuousStream()) {
            let continuousStreamArgs = getContinuousStreamArgs();
            let tomorrowsContinuousStreamArgs = new StreamArgs(continuousStreamArgs.password);
            tomorrowsContinuousStreamArgs.env = continuousStreamArgs.env;
            tomorrowsContinuousStreamArgs.tagsOR = continuousStreamArgs.tagsOR;
            tomorrowsContinuousStreamArgs.startTime = tomorrow
            const stream = constructStream(getConfig(), tomorrowsContinuousStreamArgs, getMedia());
            addToOnDeckStream(stream);
        }
    }


    // Calculate the delay until the next interval mark and set it as the new interval
    const nextDelay = calculateDelayToNextInterval(intervalInSeconds);
    setTimeout(cycleCheck, nextDelay);
}

function startBackgroundProcess() {
    console.log('Starting background process');
    // Start the initial check after a delay
    const initialDelay = calculateDelayToNextInterval(intervalInSeconds);
    setTimeout(cycleCheck, initialDelay);
}

function setVLCClient(client: VLC.Client) {
    vlc = client;
}

async function playVLC() {
    try {
        await vlc.next();
    } catch (error) {
        console.error("An error occurred when playing stream:", error);
    }
}

async function addMediaBlock(item: MediaBlock | undefined): Promise<void> {
    if (item != null || item != undefined) {
        try {
            //If item has a initial Buffer, add it to the playlist
            if (item.InitialBuffer.length > 0) {
                console.log("Adding " + item.InitialBuffer.length + " initial buffer items to playlist");
            }
            if (item.InitialBuffer != null || item.InitialBuffer != undefined) {
                item.InitialBuffer.forEach(async (element) => {
                    await vlc.addToPlaylist(element.Path);
                });
            }

            if (item.MainBlock?.Path != null || item.MainBlock?.Path != undefined) {
                console.log("Adding " + item.MainBlock.Title + " to playlist");
                await vlc.addToPlaylist(item.MainBlock.Path);
            }
            console.log("Adding " + item.Buffer.length + " post buffer items to playlist");
            item.Buffer.forEach(async (element) => {
                await vlc.addToPlaylist(element.Path);
            });
        } catch (error) {
            console.error("An error occurred when adding to Playlist:", error);
        }
    } else {
        console.log("Item was null or undefined");
    }
}

export {
    cycleCheck,
    startBackgroundProcess,
    setVLCClient,
    playVLC,
    addMediaBlock,
    calculateDelayToNextInterval,
    setEndOfDayMarker,
    setTomorrow
};

