import mongoose, { Model } from 'mongoose';
import { MediaType } from "./enum/mediaTypes";

export interface ICommercial {
    Title: string;
    LoadTitle: string;
    Duration: number;
    Path: string;
    Type: Number;
    Tags: string[];
}

export const CommercialSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Duration: Number,
    Path: String,
    Type: Number,
    Tags: [String],
});

export class Commercial {
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

    static fromMongoObject(mongoObject: any): Commercial {
        return new Commercial(
            mongoObject.Title,
            mongoObject.LoadTitle,
            mongoObject.Duration,
            mongoObject.Path,
            MediaType.Commercial,
            mongoObject.Tags,
        );
    }

    static toMongoObject(commercial: Commercial): any {
        return {
            title: commercial.Title,
            loadTitle: commercial.LoadTitle,
            duration: commercial.Duration,
            path: commercial.Path,
            type: commercial.Type,
            tags: commercial.Tags,
        };
    }

    static fromRequestObject(requestObject: any): Commercial {
        return new Commercial(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.duration,
            requestObject.path,
            MediaType.Commercial,
            requestObject.tags,
        );
    }
}

export const CommercialModel: Model<ICommercial> = mongoose.model<ICommercial>('Commercial', CommercialSchema);