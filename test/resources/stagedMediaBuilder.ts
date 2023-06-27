import { SelectedMedia } from "../../models/selectedMedia";
import { StagedMedia } from "../../models/stagedMedia"
import { getInjectedMovies } from "../../src/streamConstructor";

export class StagedMediaBuilder {
    private scheduledMedia: SelectedMedia[];
    private injectedMedia: SelectedMedia[];
    private endTime: number

    constructor() {
        this.scheduledMedia = [];
        this.injectedMedia = [];
        this.endTime = 0;
    }

    public WithScheduledMedia(scheduledMedia: SelectedMedia[]) {
        this.scheduledMedia = scheduledMedia;
        return this;
    }

    public AddScheduledMedia(scheduledMedia: SelectedMedia) {
        this.scheduledMedia.push(scheduledMedia);
        return this;
    }

    public WithInjectedMedia(injectedMedia: SelectedMedia[]) {
        this.injectedMedia = injectedMedia;
        return this;
    }

    public AddInjectedMedia(injectedMedia: SelectedMedia) {
        this.injectedMedia.push(injectedMedia);
        return this;
    }

    public EndTime(endTime: number) {
        this.endTime = endTime;
        return this;
    }

    private
    public build(): StagedMedia {
        return new StagedMedia(
            this.scheduledMedia,
            this.injectedMedia,
            this.endTime
        );
    }
}

