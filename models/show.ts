export class Show {
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    DurationLimit: number;
    OverDuration: boolean;
    Tags: string[];
    EpisodeCount: number;
    Episodes: Episode[];
}

export class Episode {
    Season: number;
    Episode: number;
    EpisodeNumber: number;
    EpisodePath: string;
    EpisodeTitle: string;
    LoadTitle: string
    Duration: number;
    DurationLimit: number;
    Tags: string[];
}