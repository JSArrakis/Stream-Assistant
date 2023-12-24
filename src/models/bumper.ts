export class Bumper {
    Title: string;
    Duration: number;
    Path: string;
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