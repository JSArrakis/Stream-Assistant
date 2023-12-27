import mongoose from 'mongoose';
export class Show {
    public Title: string;
    public LoadTitle: string;
    public Alias: string;
    public IMDB: string;
    public DurationLimit: number;
    public OverDuration: boolean;
    public Tags: string[];
    public SecondaryTags: string[];
    public EpisodeCount: number;
    public Episodes: Episode[];

    constructor(title: string, loadTitle: string, alias: string, imdb: string, durationLimit: number,
        overDuration: boolean, tags: string[], secondaryTags: string[], episodeCount: number, episodes: Episode[]) {
        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.DurationLimit = durationLimit;
        this.OverDuration = overDuration;
        this.Tags = tags;
        this.SecondaryTags = secondaryTags;
        this.EpisodeCount = episodeCount;
        this.Episodes = episodes;
    }
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
    Tags: [String],
});

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
}

export const ShowSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: String,
    Alias: String,
    IMDB: String,
    DurationLimit: Number,
    OverDuration: Boolean,
    Tags: [String],
    SecondaryTags: [String],
    EpisodeCount: Number,
    Episodes: [EpisodeSchema],  // Use the EpisodeSchema here
});

export const ShowModel = mongoose.model('Show', ShowSchema);