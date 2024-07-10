import mongoose, { Model } from 'mongoose';

export interface IMovie {
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    Tags: string[];
    Path: string;
    Duration: number;
    DurationLimit: number;
    Anthology: string;
    Chapter: number;
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
    Anthology: String,
    Chapter: Number
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
    Anthology: string;
    Chapter: number;

    constructor(
        title: string,
        loadTitle: string,
        alias: string,
        imdb: string,
        tags: string[],
        path: string,
        duration: number,
        durationLimit: number,
        anthology: string,
        chapter: number
    ) {

        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.Tags = tags;
        this.Path = path;
        this.Duration = duration;
        this.DurationLimit = durationLimit;
        this.Anthology = anthology;
        this.Chapter = chapter;
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
            mongoObject.anthology,
            mongoObject.chapter
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
            anthology: movie.Anthology,
            chapter: movie.Chapter
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
            requestObject.anthology,
            requestObject.chapter
        );
    }
}

export const MovieModel: Model<IMovie> = mongoose.model<IMovie>('Movie', MovieSchema);