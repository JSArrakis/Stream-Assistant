export class MediaProgression {
    Title: string;
    LoadTitle: string;
    Environment: string;
    Type: StreamType;
    Progressions: Progression[];

    constructor(title: string, loadTitle: string,  environment: string, type: StreamType, progressions: Progression[]) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Environment = environment;
        this.Type = type;
        this.Progressions = progressions;
    }

    static fromMongoObject(mongoObject: any): MediaProgression {
        return new MediaProgression(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.environment,
            mongoObject.type,
            mongoObject.progressions.map((progression: any) =>
                Progression.fromMongoObject(progression)
            )
        );
    }

    static toMongoObject(mediaProgression: MediaProgression): any {
        return {
            title: mediaProgression.Title,
            loadTitle: mediaProgression.LoadTitle,
            environment: mediaProgression.Environment,
            type: mediaProgression.Type,
            episodes: mediaProgression.Progressions.map((progression: Progression) =>
                Progression.toMongoObject(progression)
            )
        };
    }
    
}

export class Progression {
    Title: string;
    LoadTitle: string;
    Episode: number;
    LastPlayed: number;

    constructor(title: string, loadTitle: string, episode: number, lastPlayed: number) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Episode = episode;
        this.LastPlayed = lastPlayed
    }

    static fromMongoObject(mongoObject: any): Progression {
        return new Progression(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.episode,
            mongoObject.lastPlayed
        );
    }

    static toMongoObject(progression: Progression): any {
        return {
            title: progression.Title,
            loadTitle: progression.LoadTitle,
            episode: progression.Episode,
            lastPlayed: progression.LastPlayed
        };
    }
}

import mongoose, { Document, Model } from 'mongoose';
import { StreamType } from './enum/streamTypes';

export interface IProgression {
    Title: string;
    LoadTitle: string;
    Episode: number;
    LastPlayed: number;
}

export interface IMediaProgression extends Document {
    Title: string;
    LoadTitle: string;
    Type: string;
    Progressions: Progression[]
}

export const ProgressionSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Episode: Number,
    LastPlayed: Number
});

export const MediaProgressionSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: {
        type: String,
        index: true,
    },
    Type: String,
    Progressions: [ProgressionSchema]
});

export const MediaProgressionModel: Model<IMediaProgression> = mongoose.model<IMediaProgression>('Show', MediaProgressionSchema);