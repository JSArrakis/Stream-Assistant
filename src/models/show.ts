import mongoose, { Document, Model } from 'mongoose';

export interface IEpisode {
    Season: number;
    Episode: number;
    EpisodeNumber: number;
    Path: string;
    Title: string;
    LoadTitle: string;
    Duration: number;
    DurationLimit: number;
    Tags: string[];
}

export interface IShow extends Document {
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    DurationLimit: number;
    OverDuration: boolean;
    FirstEpisodeOverDuration: boolean;
    Tags: string[];
    SecondaryTags: string[];
    EpisodeCount: number;
    Episodes: IEpisode[];
}

export const EpisodeSchema = new mongoose.Schema({
    Season: Number,
    Episode: Number,
    EpisodeNumber: Number,
    Path: String,
    Title: String,
    LoadTitle: String,
    Duration: Number,
    DurationLimit: Number,
    Tags: [String]
});

export const ShowSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: {
        type: String,
        index: true,
    },
    Alias: String,
    IMDB: String,
    DurationLimit: Number,
    OverDuration: Boolean,
    FirstEpisodeOverDuration: Boolean,
    Tags: [String],
    SecondaryTags: [String],
    EpisodeCount: Number,
    Episodes: [EpisodeSchema]
});

export class ShowData {
    public Title: string;
    public LoadTitle: string;
    public Alias: string;
    public IMDB: string;
    public DurationLimit: number;
    public OverDuration: boolean;
    public FirstEpisodeOverDuration: boolean;
    public Tags: string[];
    public SecondaryTags: string[];
    public EpisodeCount: number;

    constructor(title: string, loadTitle: string, alias: string, imdb: string, durationLimit: number,
        overDuration: boolean, firstEpisodeOverDuration: boolean, tags: string[], secondaryTags: string[], episodeCount: number, episodes: Episode[]) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.DurationLimit = durationLimit;
        this.OverDuration = overDuration;
        this.FirstEpisodeOverDuration = firstEpisodeOverDuration;
        this.Tags = tags;
        this.SecondaryTags = secondaryTags;
        this.EpisodeCount = episodeCount;
    }
}

export class Episode {
    public Season: number;
    public Episode: number;
    public EpisodeNumber: number;
    public Path: string;
    public Title: string;
    public LoadTitle: string;
    public Duration: number;
    public DurationLimit: number;
    public Tags: string[];

    constructor(season: number, episode: number, episodeNumber: number, path: string, title: string,
        loadTitle: string, duration: number, durationLimit: number, tags: string[]) {
        this.Season = season;
        this.Episode = episode;
        this.EpisodeNumber = episodeNumber;
        this.Path = path;
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Duration = duration;
        this.DurationLimit = durationLimit;
        this.Tags = tags;
    }

    static fromMongoObject(mongoObject: any): Episode {
        return new Episode(
            mongoObject.season,
            mongoObject.episode,
            mongoObject.episodeNumber,
            mongoObject.path,
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.duration,
            mongoObject.durationLimit,
            mongoObject.tags
        );
    }

    static toMongoObject(episode: Episode): any {
        return {
            season: episode.Season,
            episode: episode.Episode,
            episodeNumber: episode.EpisodeNumber,
            path: episode.Path,
            title: episode.Title,
            loadTitle: episode.LoadTitle,
            duration: episode.Duration,
            durationLimit: episode.DurationLimit,
            tags: episode.Tags
        };
    }

    static fromRequestObject(requestObject: any): Episode {
        return new Episode(
            requestObject.season,
            requestObject.episode,
            requestObject.episodeNumber,
            requestObject.path,
            requestObject.title,
            requestObject.loadTitle,
            requestObject.duration,
            requestObject.durationLimit,
            requestObject.tags
        );
    }
}

export class Show {
    public Title: string;
    public LoadTitle: string;
    public Alias: string;
    public IMDB: string;
    public DurationLimit: number;
    public OverDuration: boolean;
    public FirstEpisodeOverDuration: boolean;
    public Tags: string[];
    public SecondaryTags: string[];
    public EpisodeCount: number;
    public Episodes: Episode[];

    constructor(title: string, loadTitle: string, alias: string, imdb: string, durationLimit: number,
        overDuration: boolean, firstEpisodeOverDuration: boolean, tags: string[], secondaryTags: string[], episodeCount: number, episodes: Episode[]) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.DurationLimit = durationLimit;
        this.OverDuration = overDuration;
        this.FirstEpisodeOverDuration = firstEpisodeOverDuration;
        this.Tags = tags;
        this.SecondaryTags = secondaryTags;
        this.EpisodeCount = episodeCount;
        this.Episodes = episodes;
    }

    static fromMongoObject(mongoObject: any): Show {
        return new Show(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.alias,
            mongoObject.imdb,
            mongoObject.durationLimit,
            mongoObject.overDuration,
            mongoObject.firstEpisodeOverDuration,
            mongoObject.tags,
            mongoObject.secondaryTags,
            mongoObject.episodeCount,
            mongoObject.episodes.map((episode: any) =>
                Episode.fromMongoObject(episode)
            )
        );
    }

    static toMongoObject(show: Show): any {
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
            episodes: show.Episodes.map((episode: Episode) =>
                Episode.toMongoObject(episode)
            )
        };
    }

    static fromRequestObject(requestObject: any): Show {
        return new Show(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.alias,
            requestObject.imdb,
            requestObject.durationLimit,
            requestObject.overDuration,
            requestObject.firstEpisodeOverDuration,
            requestObject.tags,
            requestObject.secondaryTags,
            requestObject.episodeCount,
            requestObject.episodes.map((episode: any) =>
                Episode.fromRequestObject(episode)
            )
        );
    }
}

export const ShowModel: Model<IShow> = mongoose.model<IShow>('Show', ShowSchema);