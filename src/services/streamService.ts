// src/services/streamService.ts

import { MediaBlock } from '../models/mediaBlock';
import { constructStream } from './streamConstructorService';
import { Config } from '../models/config';
import { StreamArgs } from '../models/streamArgs';
import { Media } from '../models/media';
import { Request } from 'express';
import { addMediaBlock } from './backgroundService';

let upcomingStream: MediaBlock[] = [];
let onDeckStream: MediaBlock[] = [];
let continuousStream = false;
let continuousStreamArgs: StreamArgs;
let config: Config;

function initializeStream(config: Config, continuousStreamArgs: StreamArgs, media: Media): void {
    upcomingStream = constructStream(config, continuousStreamArgs, media);
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

function isContinuousStream(): boolean {
    return continuousStream;
}

function setContinuousStream(value: boolean): void {
    continuousStream = value;
}

function getContinuousStreamArgs(): StreamArgs {
    return continuousStreamArgs;
}

function setContinuousStreamArgs(value: StreamArgs): void {
    continuousStreamArgs = value;
}

function convertISOToUnix(isoDateTime: string): number {
    // Convert ISO 8601 date-time to Unix timestamp in seconds
    return Math.floor(new Date(isoDateTime).getTime() / 1000);
}

export function mapStreamStartRequestToInputArgs(req: Request): StreamArgs {
    const { env, movies, tagsOR, endTime, startTime } = req.body;
    const inputArgs: StreamArgs = new StreamArgs(req.body.password);
    // Map env directly
    if (env) {
        inputArgs.env = env;
    }

    // Map tagsOR directly
    if (tagsOR) {
        inputArgs.tagsOR = tagsOR;
    }

    // Convert and map endTime and startTime to Unix timestamps
    if (endTime) {
        inputArgs.endTime = convertISOToUnix(endTime);
    }
    if (startTime) {
        inputArgs.startTime = convertISOToUnix(startTime);
    }

    // Map movies with date conversion
    if (movies && Array.isArray(movies)) {
        inputArgs.movies = movies.map((movie) => {
            const [firstPart, secondPart] = movie.split('::');
            if (secondPart) {
                // If "::" delimiter exists, convert the second part (ISO date) to Unix timestamp
                const unixTimestamp = convertISOToUnix(secondPart);
                // Rejoin the parts with "::" and the Unix timestamp
                return `${firstPart}::${unixTimestamp}`;
            } else {
                // No "::" delimiter, pass through the original string
                return movie;
            }
        });
    }

    return inputArgs;
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
    isContinuousStream,
    setContinuousStream,
    getContinuousStreamArgs,
    setContinuousStreamArgs,
    addInitialMediaBlocks,
    removeFromUpcomingStream,
    setConfig,
    getConfig
};
