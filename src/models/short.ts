import mongoose, { Document, Model } from 'mongoose';
import { MediaType } from './enum/mediaTypes';

export interface IShort {
    Title: string;
    LoadTitle: string;
    Duration: number;
    Path: string;
    Type: number;
    Tags: string[];
}

export const ShortSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Duration: Number,
    Path: String,
    Type: Number,
    Tags: [String],
});

export class Short {
    Title: string;
    LoadTitle: string;
    Duration: number;
    Path: string;
    Type: number;
    Tags: string[];

    constructor(title: string, loadtitle: string, duration: number, path: string, type: number, tags: string[]) {
        this.Title = title;
        this.LoadTitle = loadtitle;
        this.Duration = duration;
        this.Path = path;
        this.Type = type;
        this.Tags = tags;
    }

    static fromMongoObject(mongoObject: any): Short {
        return new Short(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.duration,
            mongoObject.path,
            mongoObject.type,
            mongoObject.tags,
        );
    }

    static toMongoObject(movie: Short): any {
        return {
            title: movie.Title,
            loadTitle: movie.LoadTitle,
            duration: movie.Duration,
            path: movie.Path,
            type: movie.Type,
            tags: movie.Tags,
        };
    }

    static fromRequestObject(requestObject: any): Short {
        return new Short(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.duration,
            requestObject.path,
            MediaType.Short,
            requestObject.tags,
        );
    }
}

export const ShortModel: Model<IShort> = mongoose.model<IShort>('Short', ShortSchema);