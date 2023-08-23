export class Commercial {
    Path: string;
    Duration: number;
    Type: string;
    Tags: string[];

    constructor(path: string, duration: number, type: string, tags: string[]) {
        this.Path = path;
        this.Duration = duration;
        this.Type = type;
        this.Tags = tags;
    }
}