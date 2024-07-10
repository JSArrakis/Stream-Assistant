import { MediaBlock } from '../models/mediaBlock';
import { constructStream } from './streamConstructor';
import { Config } from '../models/config';
import { Media } from '../models/media';
import { addMediaBlock } from './backgroundService';
import { IStreamRequest } from '../models/v1/streamRequest';
import { StreamType } from '../models/enum/streamTypes';

let upcomingStream: MediaBlock[] = [];
let onDeckStream: MediaBlock[] = [];
let streamType: StreamType;
let streamArgs: IStreamRequest;
let config: Config;
let streamVarianceInSeconds = 0;

function initializeStream(config: Config, request: IStreamRequest, media: Media): string {
    // Constructs the stream based on the config, continuous stream args, and available media
    // The stream is assigned to upcoming stream which the background service will use to populate the on deck stream
    // The stream is constructed to fill the time until 12:00am
    // The background service will run construct stream again 30 minutes before the end of the day to fill the time until 12:00am the next day
    let upcomingStreamResponse: [MediaBlock[], string] = constructStream(config, request, media);
    if (upcomingStreamResponse[1] !== "") {
        return upcomingStreamResponse[1];
    }
    upcomingStream = upcomingStreamResponse[0];
    return "";
}

function initializeOnDeckStream(): void {
    for (let i = 0; i < 2; i++) {
        if (upcomingStream.length > 0) {
            let selectedObject = upcomingStream.shift();
            if (selectedObject != null || selectedObject != undefined) {
                onDeckStream.push(selectedObject);
            }
        }
    }
}

function setConfig(value: Config): void {
    config = value;
}

function getConfig(): Config {
    return config;
}

function addToOnDeckStream(mediaBlocks: MediaBlock[]): void {
    onDeckStream.push(...mediaBlocks);
}

function removeFromOnDeckStream(): MediaBlock | undefined {
    return onDeckStream.shift();
}

function removeFromUpcomingStream(): MediaBlock | undefined {
    return upcomingStream.shift();
}

function getUpcomingStream(): MediaBlock[] {
    return upcomingStream;
}

function getOnDeckStream(): MediaBlock[] {
    return onDeckStream;
}

function getOnDeckStreamLength(): number {
    return onDeckStream.length;
}

function getStreamType(): StreamType {
    return streamType;
}

function setStreamType(value: StreamType): void {
    streamType = value;
}

function getStreamArgs(): IStreamRequest {
    return streamArgs;
}

function setStreamArgs(value: IStreamRequest): void {
    streamArgs = value;
}

function convertISOToUnix(isoDateTime: string): number {
    // Convert ISO 8601 date-time to Unix timestamp in seconds
    return Math.floor(new Date(isoDateTime).getTime() / 1000);
}

function getStreamVariationInSeconds(): number {
    return streamVarianceInSeconds;
}

function setStreamVariationInSeconds(value: number): void {
    streamVarianceInSeconds = value;
}

async function addInitialMediaBlocks() {
    for (const item of onDeckStream) {
        await addMediaBlock(item);
    }
}

export {
    initializeStream,
    initializeOnDeckStream,
    addToOnDeckStream,
    removeFromOnDeckStream,
    getUpcomingStream,
    getOnDeckStream,
    getOnDeckStreamLength,
    setStreamType,
    getStreamType,
    getStreamArgs,
    setStreamArgs,
    addInitialMediaBlocks,
    removeFromUpcomingStream,
    setConfig,
    getConfig,
    setStreamVariationInSeconds,
    getStreamVariationInSeconds
};
