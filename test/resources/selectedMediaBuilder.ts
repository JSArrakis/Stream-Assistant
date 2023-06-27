import { Collection } from "../../models/collection";
import { MediaType } from "../../models/enum/mediaTypes";
import { Movie } from "../../models/movie";
import { SelectedMedia } from "../../models/selectedMedia";
import { Episode } from "../../models/show";
import { MovieBuilder } from "./movieBuilder";

export class SelectedMediaBuilder {
    private media: (Movie | Collection | Episode);
    private type: MediaType;
    private time: number;
    private duration: number;
    private tags: string[];

    constructor() {
        this.media = new MovieBuilder().build();
        this.type = MediaType.Movie;
        this.time = 0;
        this.duration = 0;
        this.tags = [];
    }

    public withMedia(media: (Movie | Collection | Episode)): SelectedMediaBuilder {
        this.media = media
        return this;
    }

    public withType(type: MediaType): SelectedMediaBuilder {
        this.type = type
        return this;
    }

    public withTime(time: number): SelectedMediaBuilder {
        this.time = time
        return this;
    }

    public withDuration(duration: number): SelectedMediaBuilder {
        this.duration = duration
        return this;
    }

    public withTags(tags: string[]): SelectedMediaBuilder {
        this.tags = tags
        return this;
    }

    public addTag(tag: string): SelectedMediaBuilder {
        this.tags.push(tag)
        return this;
    }

    public build(): SelectedMedia {
        return new SelectedMedia(
            this.media,
            this.type,
            this.time,
            this.duration,
            this.tags
        );
    }
}