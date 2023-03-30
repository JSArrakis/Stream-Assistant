import { Collection } from "./collection";
import { MediaType } from "./enum/mediaTypes";
import { Movie } from "./movie";
import { Episode, Show } from "./show";

export class SelectedMedia {
    Media: Movie | Show | Collection | Episode;
    Type: MediaType;
    Time: number;
    Duration: number;
    Tags: string[];

    constructor(media: Movie | Show | Collection | Episode, type: MediaType, time: number, duration: number, tags: string[]) {
        this.Media = media;
        this.Type = type;
        this.Time = time;
        this.Duration = duration;
        this.Tags = tags;
    }
}