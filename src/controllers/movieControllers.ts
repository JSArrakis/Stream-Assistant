import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MovieModel, Movie } from '../models/movie';
import { LoadTitleError } from '../models/loadTitleError';
import { createMediaValidation } from '../middleware/validationMiddleware';
import { getMediaDuration } from '../utils/utilities';


// ===========================================
//               MOVIE HANDLERS
// ===========================================

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
        let err = createMediaValidation(movieEntry);
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

async function updateMovieFromRequest(update: any, movie: any): Promise<Movie> {
    let parsedMovie: Movie = Movie.fromRequestObject(update)

    movie.Tags = parsedMovie.Tags;

    return movie;
}

async function transformMovieFromRequest(movie: any, loadTitle: string): Promise<Movie> {
    let parsedMovie: Movie = Movie.fromRequestObject(movie)

    parsedMovie.LoadTitle = loadTitle

    parsedMovie.Alias = parsedMovie.LoadTitle;
    if (parsedMovie.Duration > 0) {
        return parsedMovie;
    }
    console.log(`Getting duration for ${parsedMovie.Path}`);
    let durationInSeconds = await getMediaDuration(parsedMovie.Path);
    parsedMovie.Duration = durationInSeconds; // Update duration value
    parsedMovie.DurationLimit = (Math.floor(parsedMovie.Duration / 1800) * 1800) + ((parsedMovie.Duration % 1800 > 0) ? 1800 : 0);

    return parsedMovie;
}