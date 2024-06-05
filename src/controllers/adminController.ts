// src/controllers/streamController.ts

import e, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Show, ShowData, ShowModel } from '../models/show'; // Import the Show model
import { transformBufferFromRequest, transformMovieFromRequest, transformShowFromRequest, updateMovieFromRequest } from '../services/dataTransformationService';
import { MovieModel } from '../models/movie';
import { BufferMediaModel } from '../models/buffer';
import { LoadTitleError } from '../models/loadTitleError';
import { validate } from '../validators/streamValidator';


export async function createShowHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Retrieve show from MongoDB using show load title if it exists
    const show = await ShowModel.findOne({ LoadTitle: loadTitle });

    // If it exists, return error
    if (show) {
        res.status(400).json({ message: "Show already exists" });
        return;
    }
    // If it doesn't exist, perform transformations
    let createdShow = await transformShowFromRequest(req.body, loadTitle);

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

    let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Retrieve show from MongoDB using show load title if it exists
    const show = await ShowModel.findOne({ LoadTitle: loadTitle });

    // If it doesn't exist, return error
    if (!show) {
        res.status(400).json({ message: "Show does not exist" });
        return;
    }

    // If it exists, perform transformations
    let updatedShow = await transformShowFromRequest(req.body, loadTitle);

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

    let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Retrieve movie from MongoDB using show load title if it exists
    const movie = await MovieModel.findOne({ LoadTitle: loadTitle });

    // If it exists, return error
    if (movie) {
        res.status(400).json({ message: "Movie already exists" });
        return;
    }
    // If it doesn't exist, perform transformations
    let createdMovie = await transformMovieFromRequest(req.body, loadTitle);

    // Insert movie into MongoDB
    await MovieModel.create(createdMovie);

    res.status(200).json({ message: "Movie Created" });
    return;
}

export async function bulkCreateMovieHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    // Validate request body is an array
    if (!Array.isArray(req.body)) {
        res.status(400).json({ message: "Request body must be an array" });
        return;
    }
    // Validate request body is an array of objects
    if (!req.body.every((item: any) => typeof item === 'object')) {
        res.status(400).json({ message: "Request body must be an array of movie objects" });
        return;
    }
    let createdMovies: string[] = [];
    let responseErrors: LoadTitleError[] = [];
    for (const movieEntry of req.body) {
        let err = validateMovie(movieEntry);
        if (err !== '') {
            responseErrors.push(new LoadTitleError(movieEntry.title, err));
            continue;
        }
        let loadTitle = movieEntry.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        try {
            const movie = await MovieModel.findOne({ LoadTitle: loadTitle });
            if (movie) {
                // If it exists, return error
                responseErrors.push(new LoadTitleError(loadTitle, `Movie ${movieEntry.title} already exists`));
                continue;
            }

            let createdMovie = await transformMovieFromRequest(movieEntry, loadTitle);

            await MovieModel.create(createdMovie);
            createdMovies.push(createdMovie.LoadTitle);
        } catch (err) {
            responseErrors.push(new LoadTitleError(loadTitle, err as string));
        }
    }

    if (responseErrors.length === req.body.length) {
        res.status(400).json({ message: "Movies Not Created", createdMovies: [], errors: responseErrors });
        return;
    }


    res.status(200).json({ message: "Movies Created", createdMovies: createdMovies, errors: responseErrors });
    return;
}

export async function deleteMovieHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve movie from MongoDB using movie load title if it exists
    const movie = await MovieModel.findOne({ LoadTitle: req.query.loadTitle });

    // If it doesn't exist, return error
    if (!movie) {
        res.status(400).json({ message: "Movie does not exist" });
        return;
    }

    // If it exists, delete it
    await MovieModel.deleteOne({ _id: movie._id });

    res.status(200).json({ message: "Movie Deleted" });
    return;
}

export async function updateMovieHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    let loadTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    // Retrieve movie from MongoDB using movie load title if it exists
    const movie = await MovieModel.findOne({ LoadTitle: loadTitle });

    // If it doesn't exist, return error
    if (!movie) {
        res.status(404).json({ message: "Movie does not exist" });
        return;
    }

    // If it exists, perform transformations
    let updatedMovie = await updateMovieFromRequest(req.body, movie);

    // Update show in MongoDB
    await MovieModel.updateOne({ _id: movie._id }, updatedMovie);

    res.status(200).json({ message: "Movie Updated", movie: updatedMovie });
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

export async function getAllMoviesHandler(req: Request, res: Response): Promise<void> {
    const movies = await MovieModel.find();

    if (!movies || movies.length === 0) {
        res.status(404).json({ message: "No Movies Found" });
        return;
    }
    res.status(200).json(movies);
    return;
}

export async function getAllShowsDataHandler(req: Request, res: Response): Promise<void> {
    const shows = await ShowModel.find();

    if (!shows || shows.length === 0) {
        res.status(404).json({ message: "No Shows Found" });
        return;
    }
    let showsData = shows.map((show: any) => {
        return {
            title: show.Title,
            loadTitle: show.LoadTitle,
            alias: show.Alias,
            imdb: show.IMDB,
            durationLimit: show.DurationLimit,
            overDuration: show.OverDuration,
            firstEpisodeOverDuration: show.FirstEpisodeOverDuration,
            tags: show.Tags,
            secondaryTags: show.SecondaryTags,
            episodeCount: show.EpisodeCount,
        }
    });

    res.status(200).json(showsData);
    return;
}

export async function createBufferHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve buffer media from MongoDB using buffer media load title if it exists
    const buffer = await BufferMediaModel.findOne({ Path: req.body.path });

    // If it exists, return error
    if (buffer) {
        res.status(400).json({ message: "Buffer Media already exists" });
        return;
    }
    // If it doesn't exist, perform transformations
    let updatedBuffer = await transformBufferFromRequest(req.body);

    // Insert buffer media into MongoDB
    await BufferMediaModel.create(updatedBuffer);

    res.status(200).json({ message: "Buffer Media Created" });
    return;
}

export async function deleteBufferHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve buffer media from MongoDB using buffer media load title if it exists
    const buffer = await BufferMediaModel.findOne({ Path: req.query.path });

    // If it doesn't exist, return error
    if (!buffer) {
        res.status(400).json({ message: "Buffer Media does not exist" });
        return;
    }

    // If it exists, delete it
    await BufferMediaModel.deleteOne({ _id: buffer._id });

    res.status(200).json({ message: "Buffer Media Deleted" });
    return;
}

export async function updateBufferHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve buffer media from MongoDB using buffer media load title if it exists
    const buffer = await BufferMediaModel.findOne({ Path: req.body.path });

    // If it doesn't exist, return error
    if (!buffer) {
        res.status(400).json({ message: "Buffer Media does not exist" });
        return;
    }

    // If it exists, perform transformations
    let updatedBuffer = await transformBufferFromRequest(req.body);

    // Update buffer media in MongoDB
    await BufferMediaModel.updateOne({ _id: buffer._id }, updatedBuffer);

    res.status(200).json({ message: "Buffer Media Updated" });
    return;
}

export async function getBufferHandler(req: Request, res: Response): Promise<void> {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Retrieve show from MongoDB using show load title if it exists using request params
    const show = await ShowModel.findOne({ Path: req.query.path });

    // If it doesn't exist, return error
    if (!show) {
        res.status(404).json({ message: "Buffer Media does not exist" });
        return;
    }

    res.status(200).json(show);
    return;
}

function validateMovie(movie: any): string {
    let errors: string[] = [];
    if (!movie.title || typeof movie.title !== 'string') {
        return 'Movies must have a title field that is a string';
    }
    if (!movie.path || typeof movie.path !== 'string') {
        return 'Movies must have a path field that is the file path of the target media file a string';
    }
    if (!movie.tags || !Array.isArray(movie.tags) || movie.tags.length < 1 || !movie.tags.every((tag: any) => typeof tag === 'string')) {
        return 'Movies must have a tags field that must provided as a non-empty array of strings for each movie';
    }
    return '';
}