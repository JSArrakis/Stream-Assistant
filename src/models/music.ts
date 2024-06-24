import mongoose, { Model } from 'mongoose';
import { MediaType } from './enum/mediaTypes';

export interface IMusic {
    Title: string;
    LoadTitle: string;
    Duration: number;
    Path: string;
    Type: number;
    Tags: string[];
}

export const MusicSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Duration: Number,
    Path: String,
    Type: Number,
    Tags: [String],
});

export class Music {
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

    static fromMongoObject(mongoObject: any): Music {
        return new Music(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.duration,
            mongoObject.path,
            mongoObject.type,
            mongoObject.tags,
        );
    }

    static toMongoObject(movie: Music): any {
        return {
            title: movie.Title,
            loadTitle: movie.LoadTitle,
            duration: movie.Duration,
            path: movie.Path,
            type: movie.Type,
            tags: movie.Tags,
        };
    }

    static fromRequestObject(requestObject: any): Music {
        return new Music(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.duration,
            requestObject.path,
            MediaType.Music,
            requestObject.tags,
        );
    }
}

export const MusicModel: Model<IMusic> = mongoose.model<IMusic>('Music', MusicSchema);