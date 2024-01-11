import mongoose, { Document, Model } from 'mongoose';

export interface IBufferMedia {
    Title: string;
    Path: string;
    Duration: number;
    Type: string;
    Tags: string[];
}

export const BufferMediaSchema = new mongoose.Schema({
    Title: String,
    Path: String,
    Duration: Number,
    Type: String,
    Tags: [String]
});

export class BufferMedia {
    Title: string;
    Path: string;
    Duration: number;
    Type: string;
    Tags: string[];

    constructor(title: string, duration: number, path: string, type: string, tags: string[]) {
        this.Title = title;
        this.Duration = duration;
        this.Path = path;
        this.Type = type;
        this.Tags = tags;
    }

    static fromMongoObject(mongoObject: any): BufferMedia {
        return new BufferMedia(
            mongoObject.Title,
            mongoObject.Duration,
            mongoObject.Path,
            mongoObject.Type,
            mongoObject.Tags
        );
    }

    static toMongoObject(movie: BufferMedia): any {
        return {
            Title: movie.Title,
            Duration: movie.Duration,
            Path: movie.Path,
            Type: movie.Type,
            Tags: movie.Tags
        };
    }

    static fromRequestObject(requestObject: any): BufferMedia {
        return new BufferMedia(
            requestObject.Title,
            requestObject.Duration,
            requestObject.Path,
            requestObject.Type,
            requestObject.Tags
        );
    }
}

export const BufferMediaModel: Model<IBufferMedia> = mongoose.model<IBufferMedia>('Buffer', BufferMediaSchema);