import mongoose, { Document, Model } from 'mongoose';
import { StreamType } from './enum/streamTypes';

export class ProgressionContext {
    Title: string;
    LoadTitle: string;
    Environment: string;
    Type: StreamType;
    Progressions: WatchRecord[];

    constructor(title: string, loadTitle: string, environment: string, type: StreamType, progressions: WatchRecord[]) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Environment = environment;
        this.Type = type;
        this.Progressions = progressions;
    }

    static fromMongoObject(mongoObject: any): ProgressionContext {
        return new ProgressionContext(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.environment,
            mongoObject.type,
            mongoObject.progressions.map((progression: any) =>
                WatchRecord.fromMongoObject(progression)
            )
        );
    }

    static toMongoObject(mediaProgression: ProgressionContext): any {
        return {
            title: mediaProgression.Title,
            loadTitle: mediaProgression.LoadTitle,
            environment: mediaProgression.Environment,
            type: mediaProgression.Type,
            episodes: mediaProgression.Progressions.map((progression: WatchRecord) =>
                WatchRecord.toMongoObject(progression)
            )
        };
    }

}

export class WatchRecord {
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

    static fromMongoObject(mongoObject: any): WatchRecord {
        return new WatchRecord(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.episode,
            mongoObject.lastPlayed
        );
    }

    static toMongoObject(progression: WatchRecord): any {
        return {
            title: progression.Title,
            loadTitle: progression.LoadTitle,
            episode: progression.Episode,
            lastPlayed: progression.LastPlayed
        };
    }
}

export interface IWatchRecord {
    Title: string;
    LoadTitle: string;
    Episode: number;
    LastPlayed: number;
}

export interface IProgressionContext extends Document {
    Title: string;
    LoadTitle: string;
    Type: string;
    Progressions: WatchRecord[]
}

export const WatchRecordSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Episode: Number,
    LastPlayed: Number
});

export const ProgressionContextSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: {
        type: String,
        index: true,
    },
    Type: String,
    Progressions: [WatchRecordSchema]
});

export const ProgressionContextModel: Model<IProgressionContext> = mongoose.model<IProgressionContext>('Progression', ProgressionContextSchema);