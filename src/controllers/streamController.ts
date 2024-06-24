// src/controllers/streamController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StreamArgs } from '../models/streamArgs';
import { addInitialMediaBlocks, getConfig, getContinuousStreamArgs, initializeOnDeckStream, initializeStream, mapStreamStartRequestToInputArgs, setContinuousStream, setContinuousStreamArgs } from '../services/streamService';
import { createVLCClient } from '../services/vlcClient';
import { playVLC, setVLCClient } from '../services/backgroundService';
import { getMedia } from '../services/dataManager';

export async function continuousStreamHandler(req: Request, res: Response): Promise<void> {
    let streamError: string = "";
    // Check for errors in request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // TODO - Check if Continuous stream is already running, if so return error
    // Important until I can rewrite module of vlc client to include the ability to close the client
    // Currently the only way to close the client is to stop the Stream Assistant service

    // Set continuous stream value to true in the stream service, this value will be used by the background service to determine if the stream should continue at the end of the day
    // TODO - Remove endtime from valid fields in validation rules
    setContinuousStream(true);

    // Set the continuous stream args to the values from the request
    // These values are stored in the stream service and used to determine the stream while it is running continuously
    // TODO - remove endtime from map
    setContinuousStreamArgs(mapStreamStartRequestToInputArgs(req));

    // Set the VLC client to the client created with the password from the request
    // If VLC isnt already running, it will start VLC
    setVLCClient(await createVLCClient(getContinuousStreamArgs().password));

    // Creates today's span of the stream filling the time until 12:00am using params from config, continuous stream args and available media
    streamError = initializeStream(getConfig(), getContinuousStreamArgs(), getMedia());
    if (streamError !== "") {
        console.log("Error initializing stream: " + streamError);
        res.status(400).json({ message: streamError });
        return;
    }

    // Pulls the first two items from the initialized stream and adds them to the on deck stream, the on deck stream array is used to load vlc with the next media block
    // This is done to for a future feature which will function in tandem with a user being able to change or rearrange an upcoming stream's media items.
    // To prevent a user from creating an issue which could cause the stream to desync with its original schedule, the schedule of the ondeck stream is locked in place
    initializeOnDeckStream();

    // Adds the first two media blocks to the VLC client and playlist
    await addInitialMediaBlocks();

    // Starts the VLC client playing the stream
    await playVLC();

    res.status(200).json({ message: "Stream Starting" });
    return;
}

export async function adHocStreamHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let args: StreamArgs = mapStreamStartRequestToInputArgs(req);

    setVLCClient(await createVLCClient(args.password));

    initializeStream(getConfig(), getContinuousStreamArgs(), getMedia());
    initializeOnDeckStream();

    await addInitialMediaBlocks();
    await playVLC();

    res.status(200).json({ message: "Stream Starting" });
    return;
}