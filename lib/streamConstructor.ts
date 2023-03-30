import { Config } from "../models/config";
import { MediaProgression } from "../models/mediaProgression"
import { loadMedia, loadProgression, loadTranslationTags } from "../dataAccess/dataManager";
import { Media } from "../models/media";
import { Command } from "./saCommander";
import { Movie } from "../models/movie";
import { Collection } from "../models/collection";
import moment from "moment";
import { MediaType } from "../models/enum/mediaTypes";
import { SelectedMedia } from "../models/selectedMedia";
import { StagedMedia } from "../models/stagedMedia";
import { getProceduralBlock } from "./proceduralEngine";
import { Episode, Show } from "../models/show";
import { ManageProgression } from "./utilities";
import { TranslationTag } from "../models/translationTag";

export function constructStream(config: Config, options: Command): string[] {
    let progression: MediaProgression[] = loadProgression();
    const media: Media = loadMedia();
    const transaltionTags: TranslationTag[] = loadTranslationTags();

    setEnvironment(options);

    let scheduledMedia: SelectedMedia[] = getScheduledMedia(options, media, progression);
    let stagedMedia = new StagedMedia(
        scheduledMedia,
        getInjectedMovies(options, media.Movies),
        evaluateStreamEndTime(options, scheduledMedia)
    );

    setProceduralTags(options, stagedMedia);

    let stagedStream: SelectedMedia[] = getStagedStream(config, options, stagedMedia, media, progression);
    let prevBuffer: Media = new Media([], [], [], [], [], [], []);
    //HERE
}

function getStagedStream(config: Config,
    options: Command,
    stagedMedia: StagedMedia,
    media: Media,
    progression: MediaProgression[]): SelectedMedia[] {

    let firstTimePoint: number = stagedMedia.EndTime;
    let selectedMedia: SelectedMedia[] = [];
    const rightNow = moment().unix();

    if (stagedMedia.ScheduledMedia.length > 0) {
        firstTimePoint = stagedMedia.ScheduledMedia[0].Time;
    }

    let firstProceduralDuration = firstTimePoint - rightNow;
    if (firstProceduralDuration < 0) {
        throw "Time of first movie, collection, or selected end time needs to be in the future.";
    }

    let interval = config.interval;
    let preMediaDuration = 0;
    let initialProceduralBlockDuration = 0;
    if (firstProceduralDuration / interval >= 1) {
        preMediaDuration = firstProceduralDuration % interval;
        initialProceduralBlockDuration = firstProceduralDuration - preMediaDuration;
    } else {
        preMediaDuration = firstProceduralDuration;
    }

    let prevMovies: Movie[] = [];

    if (initialProceduralBlockDuration > 0) {
        let firstProceduralBlock = getProceduralBlock(
            config,
            options,
            stagedMedia,
            media,
            prevMovies,
            progression,
            initialProceduralBlockDuration,
            rightNow - preMediaDuration
        );
        selectedMedia.push(...firstProceduralBlock);
    }
    4
    stagedMedia.ScheduledMedia.forEach((item, index) => {
        selectedMedia.push(item);
        if (index < stagedMedia.ScheduledMedia.length - 1) {
            let intermediateProcBlock = getProceduralBlock(
                config,
                options,
                stagedMedia,
                media,
                prevMovies,
                progression,
                initialProceduralBlockDuration,
                stagedMedia.ScheduledMedia[index + 1].Time - stagedMedia.ScheduledMedia[index].Time
            );
            selectedMedia.push(...intermediateProcBlock);
        }
    })

    return selectedMedia;
}

function setProceduralTags(options: Command, stagedMedia: StagedMedia) {
    if (options.tagsAND === undefined
        && options.tagsOR === undefined) {

        let tagList: string[] = [];
        stagedMedia.InjectedMovies.forEach(inj => tagList.push(...inj.Media.Tags));
        stagedMedia.ScheduledMedia.forEach(sch => tagList.push(...sch.Media.Tags));
        options.tagsOR = [...new Set(tagList)];
        //TODO: v1.4 Create different combos of block tags for tagsAND to give a more streamlined experience
    }
}

function evaluateStreamEndTime(options: Command, scheduledMedia: SelectedMedia[]): number {
    let endTime: number = moment().startOf('day').add(1, "days").unix();

    if (options.endTime) {
        let selectedEndTime = parseInt(options.endTime);
        compareSelectedEndTime(selectedEndTime, scheduledMedia);
        endTime = selectedEndTime;
    } else if (scheduledMedia.length > 0) {
        let lastScheduledMedia = scheduledMedia[scheduledMedia.length - 1];
        let scheduledMediaEndTime = lastScheduledMedia.Time + lastScheduledMedia.Media.DurationLimit;
        if (scheduledMediaEndTime > endTime) {
            endTime = scheduledMediaEndTime;
        }
    }

    return endTime;
}

function compareSelectedEndTime(endTime: number, scheduledMedia: SelectedMedia[]) {
    scheduledMedia.forEach(item => {
        if (item.Time + item.Media.DurationLimit > endTime) {
            throw "Scheduled time for " + item.Media.LoadTitle + " exceeds selected endTime";
        }
    })
}

function getScheduledMedia(options: Command, media: Media, progression: MediaProgression[]): SelectedMedia[] {
    let selectedMedia: SelectedMedia[] = [];
    options.movies
        .filter((str: string) => str.includes('::'))
        .forEach((str: string) => {
            let parsedMovie = str.split("::");
            selectedMedia.push(getMovie(parsedMovie[0], media.Movies, parseInt(parsedMovie[1])));
        });

    options.blocks
        .forEach((str: string) => {
            let parsedCollection = str.split("::");
            selectedMedia.push(getCollection(parsedCollection[0], media, parseInt(parsedCollection[1]), progression));
        });

    return selectedMedia.sort((a, b) => a.Time - b.Time);
}

function getInjectedMovies(options: Command, movies: Movie[]): SelectedMedia[] {
    let selectedMedia: SelectedMedia[] = [];
    options.movies
        .filter((str: string) => !str.includes('::'))
        .forEach((str: string) => {
            selectedMedia.push(getMovie(str, movies, 0));
        });

    return selectedMedia;
}

function getMovie(loadTitle: string, movieList: Movie[], time: number): SelectedMedia {
    let selectedMovie: Movie | undefined = movieList.find(movie => movie.LoadTitle === loadTitle);
    if (selectedMovie === undefined) {
        throw loadTitle + " is not a valid load title for a movie, re-check your spelling or make sure the title youre attempting to load exists.";
    }
    return new SelectedMedia(
        selectedMovie,
        MediaType.Movie,
        time,
        selectedMovie.DurationLimit,
        selectedMovie.Tags
    )
}

function getCollection(loadTitle: string, media: Media, time: number, progression: MediaProgression[]): SelectedMedia {
    let selectedCollection: Collection | undefined = media.Collections.find(collection => collection.LoadTitle === loadTitle);
    if (selectedCollection === undefined) {
        throw loadTitle + " is not a valid load title for a collection, re-check your spelling or make sure the title youre attempting to load exists.";
    }

    assignCollEpisodes(selectedCollection, media.Shows, progression);

    return new SelectedMedia(
        selectedCollection,
        MediaType.Collection,
        time,
        selectedCollection.DurationLimit,
        selectedCollection.Tags
    )
}

function assignCollEpisodes(collection: Collection, shows: Show[], progression: MediaProgression[]): void {
    collection.Shows.forEach(show => {
        let selectedShow = shows.filter(item => item.LoadTitle = show.LoadTitle)[0];
        let episodeIdx = ManageProgression(collection.Title, "Collection", progression, selectedShow, 1)[0];
        show.Episode = selectedShow.Episodes[episodeIdx];
    })
}

function setEnvironment(options: Command) {
    if (options.env !== undefined) {
        options.env = 1;
    }
}