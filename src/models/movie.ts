import mongoose, { Model } from 'mongoose';
import { BaseMedia } from './mediaInterface';

export interface IMovie extends BaseMedia{
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    Tags: string[];
    Path: string;
    Duration: number;
    DurationLimit: number;
    Collection: string[];
    CollectionSequence: number;
}

export const MovieSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Alias: String,
    IMDB: String,
    Tags: [String],
    Path: String,
    Duration: Number,
    DurationLimit: Number,
    Collection: [String],
    CollectionSequence: Number
});

export class Movie {
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    Tags: string[];
    Path: string;
    Duration: number;
    DurationLimit: number;
    Collection: string;
    CollectionSequence: number;

    constructor(
        title: string,
        loadTitle: string,
        alias: string,
        imdb: string,
        tags: string[],
        path: string,
        duration: number,
        durationLimit: number,
        collection: string,
        collectionSequence: number
    ) {

        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.Tags = tags;
        this.Path = path;
        this.Duration = duration;
        this.DurationLimit = durationLimit;
        this.Collection = collection;
        this.CollectionSequence = collectionSequence;
    }

    static fromMongoObject(mongoObject: any): Movie {
        return new Movie(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.alias,
            mongoObject.imdb,
            mongoObject.tags,
            mongoObject.path,
            mongoObject.duration,
            mongoObject.durationLimit,
            mongoObject.collection,
            mongoObject.collectionSequence
        );
    }

    static toMongoObject(movie: Movie): any {
        return {
            title: movie.Title,
            loadTitle: movie.LoadTitle,
            alias: movie.Alias,
            imdb: movie.IMDB,
            tags: movie.Tags,
            path: movie.Path,
            duration: movie.Duration,
            durationLimit: movie.DurationLimit,
            collection: movie.Collection,
            collectionSequence: movie.CollectionSequence
        };
    }

    static fromRequestObject(requestObject: any): Movie {
        return new Movie(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.alias,
            requestObject.imdb,
            requestObject.tags,
            requestObject.path,
            requestObject.duration,
            requestObject.durationLimit,
            requestObject.collection,
            requestObject.collectionSequence
        );
    }
}

export const MovieModel: Model<IMovie> = mongoose.model<IMovie>('Movie', MovieSchema);