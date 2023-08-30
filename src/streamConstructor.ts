import { Config } from "../models/config";
import { MediaProgression } from "../models/mediaProgression"
import { loadMedia, loadProgression, loadTranslationTags } from "../dataAccess/dataManager";
import { Media } from "../models/media";
import { Movie } from "../models/movie";
import { Collection } from "../models/collection";
import * as moment from 'moment';
import { MediaType } from "../models/enum/mediaTypes";
import { SelectedMedia } from "../models/selectedMedia";
import { StagedMedia } from "../models/stagedMedia";
import { getProceduralBlock } from "./proceduralEngine";
import { Episode, Show } from "../models/show";
import { ManageProgression, ReduceProgression } from "./utilities";
import { TranslationTag } from "../models/translationTag";
import { createBuffer } from "./bufferEngine";
import { Commercial } from "../models/commercial";
import { Music } from "../models/music";
import { Promo } from "../models/promo";
import { Short } from "../models/short";

export function constructStream(
    config: Config,
    options: any,
    media: Media = loadMedia(),
    transaltionTags: TranslationTag[] = loadTranslationTags(),
    progression: MediaProgression[] = loadProgression(),
    rightNow: number = moment().unix()):
    [string[], (Promo | Music | Commercial | Short | Episode | Movie)[]] {

    let streamPaths: string[] = []
    let streamObjects: (Promo | Music | Commercial | Short | Episode | Movie)[] = [];

    setEnvironment(options);

    let scheduledMedia: SelectedMedia[] = getScheduledMedia(options, media, progression);
    let stagedMedia = new StagedMedia(
        scheduledMedia,
        getInjectedMovies(options, media.Movies),
        evaluateStreamEndTime(options, scheduledMedia)
    );

    setProceduralTags(options, stagedMedia);
    let stagedStream: SelectedMedia[] = getStagedStream(rightNow, config, options, stagedMedia, media, progression);
    let prevBuffer: Media = new Media([], [], [], [], [], [], []);

    let initialBuffer = createBuffer(
        stagedStream[0].Time - rightNow,
        options,
        media,
        [],
        stagedStream[0].Tags,
        transaltionTags,
        prevBuffer)

    streamPaths.push(...initialBuffer[0].map(obj => obj.Path));
    streamObjects.push(...initialBuffer[0]);

    let remainder = initialBuffer[1];
    stagedStream.forEach((item, index) => {
        let firstItem = index === 0 ? true : false;
        let lastItem = index === stagedStream.length - 1 ? true : false;
        if (item.Type == MediaType.Episode || item.Type == MediaType.Movie) {
            let mediaItem = item.Media;
            streamPaths.push(mediaItem.Path);
            streamObjects.push(mediaItem);
            let bufferDuration = mediaItem.DurationLimit - mediaItem.Duration
            let buffer = createBuffer(
                bufferDuration + remainder,
                options,
                media,
                firstItem ? [] : stagedStream[index - 1].Tags,
                lastItem ? [] : stagedStream[index + 1].Tags,
                transaltionTags,
                prevBuffer);
            streamPaths.push(...buffer[0].map(obj => obj.Path));
            streamObjects.push(...buffer[0]);
            remainder = buffer[1];
        }
        //TODO
        // else if (item.Media instanceof Collection) {
        //     let collection = item.Media;
        //     let collectionBlock = createCollectionBlock(
        //         collection,
        //         progression,
        //         options,
        //         media,
        //         transaltionTags,
        //         prevBuffer);
        //     streamPaths.push(...collectionBlock[0]);
        //     remainder = collectionBlock[1];
        // }
    })
    return [streamPaths, streamObjects];
}

function createCollectionBlock(
    collection: Collection,
    progression: MediaProgression[],
    options: any,
    media: Media,
    transaltionTags: TranslationTag[],
    prevBuffer: Media): [string[], number] {
    /* 
    -- This logic is to determine if a show should be populated in the stream for a collection. If the show
    runs longer than the alloted time block for that show, skip the show following it. 
    Time remaining will be filled with buffer media 
    */

    /*
    -- Author note:: A good example of this is with the summer 2000 broadcast of Toonami with Tenchi Muyo. 
    Tenchi has a few episodes that are weirdly 45 minutes instead of 30 minutes randomly with no real rhyme 
    or reason. To handle this randomness, Toonami in it's original broadcast pulled the episode of Batman the 
    Animated series which usually followed Tenchi for that day only and populated the remainder of the 
    15 minutes that would have normally been Batman with Power Puff Girl episodes instead. This allowed 
    Toonami to keep the fidelity of a 3 hour block run time and decreasing dead time and keeping interest of the 
    audience while staying within theme (Toonami being a series of mostly violence driven animated shows 
    in which the only Cartoon Network licensed property that fit in the alloted time slot that was also 
    themed correctly was PPG)
    */
    let remainder = 0;
    let stream: string[] = [];
    collection.Shows.forEach((show, index) => {
        let lastShowEpisode = collection.Shows[index - 1].Episode;
        if (lastShowEpisode) {
            if (lastShowEpisode.Duration > lastShowEpisode.DurationLimit) {
                ReduceProgression(collection.Title, show.LoadTitle, progression)
            } else {
                let episode = show.Episode;
                if (episode) {
                    stream.push(episode.Path)
                    if (episode.Duration > episode.DurationLimit) {
                        let nextShowEpisode = collection.Shows[index + 1].Episode;
                        if (nextShowEpisode) {
                            let overDurationLength = (nextShowEpisode.DurationLimit + episode.DurationLimit) - episode.Duration + remainder;
                            let overBuffer = createBuffer(overDurationLength, options, media, [collection.LoadTitle], [collection.LoadTitle], transaltionTags, prevBuffer)
                            stream.push(...overBuffer[0].map(obj => obj.Path));
                            remainder = overBuffer[1];
                        }
                    } else {
                        let underBuffer = createBuffer(episode.DurationLimit - episode.Duration, options, media, [collection.LoadTitle], [collection.LoadTitle], transaltionTags, prevBuffer)
                        stream.push(...underBuffer[0].map(obj => obj.Path));
                        remainder = underBuffer[1];
                    }
                }
            }
        }
    });
    return [stream, remainder];
}

export function getFirstProceduralDuration(rightNow: number, stagedMedia: StagedMedia): number {
    let firstTimePoint: number = stagedMedia.EndTime;

    if (stagedMedia.ScheduledMedia.length > 0) {
        firstTimePoint = stagedMedia.ScheduledMedia[0].Time;
    }

    return firstTimePoint - rightNow;
}

export function setProceduralBlockDurations(interval: number, firstProceduralDuration: number) {
    let preMediaDuration = 0;
    let initialProceduralBlockDuration = 0;

    if (firstProceduralDuration / interval >= 1) {
        preMediaDuration = firstProceduralDuration % interval;
        initialProceduralBlockDuration = firstProceduralDuration - preMediaDuration;
    } else {
        preMediaDuration = firstProceduralDuration;
    }

    return { preMediaDuration, initialProceduralBlockDuration };
}

export function getStagedStream(
    rightNow: number,
    config: Config,
    options: any,
    stagedMedia: StagedMedia,
    media: Media,
    progression: MediaProgression[]): SelectedMedia[] {

    let firstProceduralDuration = getFirstProceduralDuration(rightNow, stagedMedia);
    if (firstProceduralDuration < 0) {
        throw "Time of first movie, collection, or selected end time needs to be in the future.";
    }

    let interval = config.interval;
    let { preMediaDuration, initialProceduralBlockDuration } = setProceduralBlockDurations(interval, firstProceduralDuration);
    let selectedMedia: SelectedMedia[] = [];
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
            rightNow + preMediaDuration
        );
        selectedMedia.push(...firstProceduralBlock);
    }

    stagedMedia.ScheduledMedia.forEach((item, index) => {
        selectedMedia.push(item);
        if (index < stagedMedia.ScheduledMedia.length - 1) {
            let procDuration = stagedMedia.ScheduledMedia[index + 1].Time - stagedMedia.ScheduledMedia[index].Time - stagedMedia.ScheduledMedia[index].Duration;
            if (procDuration > 0) {
                let intermediateProcBlock = getProceduralBlock(
                    config,
                    options,
                    stagedMedia,
                    media,
                    prevMovies,
                    progression,
                    procDuration,
                    stagedMedia.ScheduledMedia[index].Time + stagedMedia.ScheduledMedia[index].Duration
                );
                selectedMedia.push(...intermediateProcBlock);
            }
        }
    })

    if (stagedMedia.ScheduledMedia.length > 0) {
        let lastScheduledMedia = stagedMedia.ScheduledMedia[stagedMedia.ScheduledMedia.length - 1];
        let scheduledEndTime = stagedMedia.EndTime;
        let endProcDuration = scheduledEndTime - lastScheduledMedia.Time - lastScheduledMedia.Duration;
        if (endProcDuration > 0) {
            let endProcBlock = getProceduralBlock(
                config,
                options,
                stagedMedia,
                media,
                prevMovies,
                progression,
                endProcDuration,
                stagedMedia.ScheduledMedia[stagedMedia.ScheduledMedia.length - 1].Time + stagedMedia.ScheduledMedia[stagedMedia.ScheduledMedia.length - 1].Duration
            );
            selectedMedia.push(...endProcBlock);
        }
    }

    return selectedMedia;
}

export function setProceduralTags(options: any, stagedMedia: StagedMedia) {
    if (options.tagsAND === undefined
        && options.tagsOR === undefined) {

        let tagList: string[] = [];
        stagedMedia.InjectedMovies.forEach(inj => tagList.push(...inj.Media.Tags));
        stagedMedia.ScheduledMedia.forEach(sch => tagList.push(...sch.Media.Tags));
        let uniquetags: string[] = [];
        for (let i = 0; i < tagList.length; i++) {
            if (uniquetags.indexOf(tagList[i]) === -1) {
                uniquetags.push(tagList[i]);
            }
        }
        options.tagsOR = uniquetags;
        //TODO: v1.4 Create different combos of block tags for tagsAND to give a more streamlined experience
    }
}

export function evaluateStreamEndTime(options: any, scheduledMedia: SelectedMedia[]): number {
    let endTime: number = moment().startOf('day').add(1, "days").unix();

    if (options.endTime) {
        let selectedEndTime = parseInt(options.endTime);
        compareSelectedEndTime(selectedEndTime, scheduledMedia);
        endTime = selectedEndTime;
    } else if (scheduledMedia.length > 0) {
        let lastScheduledMedia = scheduledMedia[scheduledMedia.length - 1];
        endTime = lastScheduledMedia.Time + lastScheduledMedia.Media.DurationLimit;
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

export function getScheduledMedia(options: any, media: Media, progression: MediaProgression[]): SelectedMedia[] {
    let selectedMedia: SelectedMedia[] = [];
    if (options.movies) {
        options.movies
            .filter((str: string) => str.includes('::'))
            .forEach((str: string) => {
                let parsedMovie = str.split("::");
                selectedMedia.push(getMovie(parsedMovie[0], media.Movies, parseInt(parsedMovie[1])));
            });
    }

    if (options.blocks) {
        options.blocks
            .filter((str: string) => str.includes('::'))
            .forEach((str: string) => {
                let parsedCollection = str.split("::");
                selectedMedia.push(getCollection(parsedCollection[0], media, parseInt(parsedCollection[1]), progression));
            });
    }
    let sorted = selectedMedia.sort((a, b) => a.Time - b.Time);
    return sorted;
}

export function getInjectedMovies(options: any, movies: Movie[]): SelectedMedia[] {
    let selectedMedia: SelectedMedia[] = [];
    options.movies
        .filter((str: string) => !str.includes('::'))
        .forEach((str: string) => {
            selectedMedia.push(getMovie(str, movies, 0));
        });

    return selectedMedia;
}

export function getMovie(loadTitle: string, movieList: Movie[], time: number): SelectedMedia {
    if (loadTitle === "" || loadTitle === undefined) {
        throw loadTitle + "Empty movie titles are not a valid input";
    }
    let selectedMovie: Movie | undefined = movieList.find(movie => movie.LoadTitle === loadTitle);
    if (selectedMovie === undefined) {
        throw loadTitle + " is not a valid load title for a movie, re-check your spelling or make sure the title youre attempting to load exists.";
    }
    return new SelectedMedia(
        selectedMovie,
        "",
        MediaType.Movie,
        time,
        selectedMovie.DurationLimit,
        selectedMovie.Tags
    )
}

export function getCollection(loadTitle: string, media: Media, time: number, progression: MediaProgression[]): SelectedMedia {
    let selectedCollection: Collection | undefined = media.Collections.find(collection => collection.LoadTitle === loadTitle);
    if (selectedCollection === undefined) {
        throw loadTitle + " is not a valid load title for a collection, re-check your spelling or make sure the title youre attempting to load exists.";
    }

    assignCollEpisodes(selectedCollection, media.Shows, progression);

    return new SelectedMedia(
        selectedCollection,
        "",
        MediaType.Collection,
        time,
        selectedCollection.DurationLimit,
        selectedCollection.Tags
    )
}

export function assignCollEpisodes(collection: Collection, shows: Show[], progression: MediaProgression[]): void {
    collection.Shows.forEach(collShow => {
        let selectedShow = shows.filter(item => item.LoadTitle === collShow.LoadTitle)[0];
        let episodeNum = ManageProgression(collection.Title, "Collection", progression, selectedShow, 1)[0];
        collShow.Episode = selectedShow.Episodes.filter(ep => ep.EpisodeNumber === episodeNum)[0];
    })
}

function setEnvironment(options: any) {
    if (options.env !== undefined) {
        options.env = 1;
    } else {
        options.env = 1;
    }
}