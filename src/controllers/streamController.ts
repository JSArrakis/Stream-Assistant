// src/controllers/streamController.ts

import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StreamArgs } from '../models/streamArgs';
import { addInitialMediaBlocks, getConfig, getContinuousStreamArgs, initializeOnDeckStream, initializeStream, mapStreamStartRequestToInputArgs, setContinuousStream, setContinuousStreamArgs } from '../services/streamService';
import * as fs from 'fs';
import { streamStartValidationRules } from "../validators/streamValidator";
import { createVLCClient, isVLCRunning, listRunningProcesses } from '../services/vlcClient';
import { playVLC, setVLCClient } from '../services/backgroundService';
import { getMedia, loadMedia } from '../../dataAccess/dataManager';
import { Media } from '../models/media';
import { MediaBlock } from '../models/mediaBlock';
import { constructStream } from '../streamConstructor';

export const streamController = express.Router();

export async function continuousStreamHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    //TODO - Check if Continuous stream is already running, if so return error
    //Important until I can rewrite module of vlc client to include the ability to close the client
    //Currently the only way to close the client is to close the application

    setContinuousStream(true);
    setContinuousStreamArgs(mapStreamStartRequestToInputArgs(req));
    setVLCClient(await createVLCClient(getContinuousStreamArgs().password));

    initializeStream(getConfig(), getContinuousStreamArgs(), getMedia());
    initializeOnDeckStream();

    await addInitialMediaBlocks();
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

export async function loadMediaHandler(req: Request, res: Response): Promise<void> {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(400).json({ errors: errors.array() });
    //     return;
    // }
    // let args: LoadMediaArgs = new LoadMediaArgs(req.body.password, req.body.media);

    // let currentProcesses = listRunningProcesses();
    // let vlcIsActive = isVLCRunning(currentProcesses);
    // if (!vlcIsActive) {
    //     execSync("start vlc")
    // }

    // vlc = new VLC.Client({
    //     ip: "localhost",
    //     port: 8080,
    //     username: "", // username is optional
    //     password: args.password
    // });

    // for (const item of args.media) {
    //     try {
    //         // Your asynchronous code logic goes here
    //         await vlc.addToPlaylist(item);
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //     }
    // }

    // // After all items are processed, you can send a response or perform other actions.
    // res.status(200).json({ message: 'Media added to playlist successfully' });
}
