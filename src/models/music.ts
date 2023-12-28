export class Music {
    Title: string;
    Path: string;
    Duration: number;
    Type: string;
    Tags: string[];

    constructor(title: string, path: string, duration: number, type: string, tags: string[]) {
        this.Title = title;
        this.Path = path;
        this.Duration = duration;
        this.Type = type;
        this.Tags = tags;
    }
}