// src/controllers/streamController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ShowModel } from '../models/show'; // Import the Show model
import { transformMovieFromRequest, transformShowFromRequest } from '../services/dataTransformationService';
import { MovieModel } from '../models/movie';


export async function createShowHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists
    const show = await ShowModel.findOne({ LoadTitle: req.body.loadTitle });

    // If it exists, return error
    if (show) {
        res.status(400).json({ message: "Show already exists" });
        return;
    }
    // If it doesn't exist, perform transformations
    let createdShow = await transformShowFromRequest(req.body);

    // Insert show into MongoDB
    await ShowModel.create(createdShow);

    res.status(200).json({ message: "Show Created" });
    return;
}


// Delete Show by Load Title
export async function deleteShowHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(400).json({ message: "Show does not exist" });
        return;
    }

    // If it exists, delete it
    await ShowModel.deleteOne({ _id: show._id });

    res.status(200).json({ message: "Show Deleted" });
    return;
}

export async function updateShowHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists
    const show = await ShowModel.findOne({ LoadTitle: req.body.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(400).json({ message: "Show does not exist" });
        return;
    }

    // If it exists, perform transformations
    let updatedShow = await transformShowFromRequest(req.body);

    // Update show in MongoDB
    await ShowModel.updateOne({ _id: show._id }, updatedShow);

    res.status(200).json({ message: "Show Updated" });
    return;
}

export async function getShowHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Show does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}

export async function createMovieHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve movie from MongoDB using show load title if it exists
    const movie = await MovieModel.findOne({ LoadTitle: req.body.loadTitle });

    // If it exists, return error
    if (movie) {
        res.status(400).json({ message: "Movie already exists" });
        return;
    }
    // If it doesn't exist, perform transformations
    let createdMovie = await transformMovieFromRequest(req.body);

    // Insert movie into MongoDB
    await MovieModel.create(createdMovie);

    res.status(200).json({ message: "Movie Created" });
    return;
}

export async function getMovieHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve movie from MongoDB using movie load title if it exists using request params
    const movie = await MovieModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!movie) {
        res.status(404).json({ message: "Movie does not exist" });
        return;
    }

    res.status(200).json(movie);
    return;
}

export async function getShortHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Show does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}

export async function getMusicHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Show does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}

export async function getCommercialHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Show does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}

export async function getPromoHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Show does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}