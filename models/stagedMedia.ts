import { SelectedMedia } from "./selectedMedia";

export class StagedMedia {
    ScheduledMedia: SelectedMedia[];
    InjectedMovies: SelectedMedia[];
    EndTime: number;

    constructor(scheduledMedia: SelectedMedia[], injectedMovies: SelectedMedia[], endTime: number) {
        this.ScheduledMedia = scheduledMedia;
        this.InjectedMovies = injectedMovies;
        this.EndTime = endTime;
    }
}