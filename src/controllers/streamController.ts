// src/controllers/streamController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StreamArgs } from '../models/streamArgs';
import { addInitialMediaBlocks, getConfig, getContinuousStreamArgs, initializeOnDeckStream, initializeStream, mapStreamStartRequestToInputArgs, setContinuousStream, setContinuousStreamArgs } from '../services/streamService';
import { createVLCClient } from '../services/vlcClient';
import { playVLC, setVLCClient } from '../services/backgroundService';
import { getMedia } from '../services/dataManager';

export async function continuousStreamHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // TODO - Check if Continuous stream is already running, if so return error
    // Important until I can rewrite module of vlc client to include the ability to close the client
    // Currently the only way to close the client is to close the application

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