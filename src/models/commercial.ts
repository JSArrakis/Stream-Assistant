export class Commercial {
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
}