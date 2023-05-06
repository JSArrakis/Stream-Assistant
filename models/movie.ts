export class Movie {
    Title: string;
    LoadTitle: string;
    Alias: string;
    IMDB: string;
    Tags: string[];
    Path: string;
    Duration: number;
    DurationLimit: number;
    Collection: string;
    CollectionSequence: number;

    constructor(title: string,
        loadTitle: string,
        alias: string,
        imdb: string,
        tags: string[],
        path: string,
        duration: number,
        durationLimit: number,
        collection: string,
        collectionSequence: number
    ) {

        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Alias = alias;
        this.IMDB = imdb;
        this.Tags = tags;
        this.Path = path;
        this.Duration = duration;
        this.DurationLimit = durationLimit;
        this.Collection = collection;
        this.CollectionSequence = collectionSequence;
    }
}