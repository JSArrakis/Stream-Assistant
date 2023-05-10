export class Bumper {
    Duration: number;
    Path: string;
    Tags: string[];

    constructor(
        duration: number,
        path: string,
        tags: string[]
    ) {

        this.Duration = duration;
        this.Path = path;
        this.Tags = tags;
    }
}