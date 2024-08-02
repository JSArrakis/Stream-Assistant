import { ProgressionContext, WatchRecord } from "../models/progressionContext";
import { Show } from "../models/show";
import { IStreamRequest } from "../models/streamRequest";
import { keyNormalizer } from "../utils/utilities";
import { StreamType } from "../models/enum/streamTypes";

// This module is responsible for managing the progression of shows and movies. It is used to keep track of the episode number of the show that was last played and the next episode to be played.
// The progression is stored in the database and is loaded into the service on startup. The progression is updated when a show is played and the next episode is selected.
// The progression is also updated when there is 10% of the show episode remaining in the process of being played. As is the record contained in the DB.
// This is accomplished via a calculation within background service between the current time, the start time of the item, and the duration of the item.
// While this module is a singleton, it is meant to not save state bewtween executions of the service. The progression is loaded from the database on startup and should consider shows and movies played after then have been played by the background service.
// The progression is used mainly to prepopulate the on deck stream with movies and show episodes in order. As long as the stream is running, the progression will be maintained.

let progressionContextList: ProgressionContext[] = [];

export function SetLocalProgressionContextList(prog: ProgressionContext[]) {
    progressionContextList = prog;
}

export function ManageShowProgression(
    show: Show,
    numberOfEpisodes: number,
    args: IStreamRequest,
    streamType: StreamType,
    collection: string = ""
): number[] {
    // Array to hold the episode numbers
    let episodeNumbers: number[] = [];
    // Get the stream args to determine the correct media progression to pull the show progression from
    let mediaLoadTitle = keyNormalizer(args.Title);
    // Find the media progression in the media progression list
    let mediaProgression: ProgressionContext;
    if (collection !== "") {
        mediaProgression = GetProgressionContext(collection, keyNormalizer(collection), args.Env, StreamType.Collection);
    } else {
        mediaProgression = GetProgressionContext(args.Title, mediaLoadTitle, args.Env, streamType);
    }

    // Find the show progression in the media progression
    let showProgression = GetWatchRecord(mediaProgression, show.Title);

    // Get the episodes to add to the stream queue
    episodeNumbers = GetEpisodeNumbers(mediaLoadTitle, show, showProgression, numberOfEpisodes);
    return episodeNumbers;

}

export function GetProgressionContext(mediaTitle: string, mediaLoadTitle: string, environment: string, type: StreamType): ProgressionContext {
    // Find the media progression in the list
    let progressionContext = progressionContextList.find((prog) => prog.LoadTitle === mediaLoadTitle);
    // If the media progression is not found, create a new one
    if (!progressionContext) {
        progressionContext = new ProgressionContext(mediaTitle, mediaLoadTitle, environment, type, []);
        progressionContextList.push(progressionContext);
    }

    return progressionContext;
}

export function GetWatchRecord(mediaProgression: ProgressionContext, title: string): WatchRecord {
    // Find the progression in the media progression
    let progression = mediaProgression.WatchRecords.find((prog) => prog.LoadTitle === keyNormalizer(title));
    // If the progression is not found, create a new one in the media progression list
    if (!progression) {
        progression = new WatchRecord(title, keyNormalizer(title), 0, 0);
        // Find the media progression index
        let mediaProgressionIndex = progressionContextList.findIndex((prog) => prog.LoadTitle === mediaProgression.LoadTitle);
        // Add the progression to the media progression list
        progressionContextList[mediaProgressionIndex].WatchRecords.push(progression);
    }

    return progression;
}

export function GetEpisodeNumbers(progressionContextLoadTitle: string, show: Show, watchRecord: WatchRecord, numberOfEpisodes: number): number[] {
    // Array to hold the episode numbers
    let episodeNumbers: number[] = [];
    // If the show has not been played, start from the first episode
    let episodeNumber = 0;
    if (watchRecord.Episode === 0) {
        //Loop for number of episodes requested
        for (let i = 1; i <= numberOfEpisodes; i++) {
            // If the episode number selected exceeds the number of episodes, iterate through the episodes from the beginning again
            if (i > show.EpisodeCount) {
                episodeNumber++;
                if (episodeNumber > show.EpisodeCount) {
                    episodeNumber = 1;
                }
                episodeNumbers.push(episodeNumber);
                IncrementWatchRecord(progressionContextLoadTitle, watchRecord.LoadTitle, episodeNumber)
            } else {
                episodeNumbers.push(i);
                IncrementWatchRecord(progressionContextLoadTitle, watchRecord.LoadTitle, i)
            }
        }
    } else {
        // If the show has been played, start from the next episode
        //Loop for number of episodes requested
        episodeNumber = watchRecord.Episode;
        for (let i = 1; i <= numberOfEpisodes; i++) {
            episodeNumber++;
            // If the episode number selected exceeds the number of episodes, iterate through the episodes from the beginning again
            if (episodeNumber > show.EpisodeCount) {
                if (episodeNumber > show.EpisodeCount) {
                    episodeNumber = 1;
                }
                episodeNumbers.push(episodeNumber);
                IncrementWatchRecord(progressionContextLoadTitle, watchRecord.LoadTitle, episodeNumber)
            } else {
                episodeNumbers.push(episodeNumber);
                IncrementWatchRecord(progressionContextLoadTitle, watchRecord.LoadTitle, episodeNumber)
            }
        }
    }

    return episodeNumbers;
}

export function IncrementWatchRecord(progressionContext: string, loadTitle: string, episode: number): void {
    //Sets local progression to the next episode
    // Find the media progression index
    let progressionContextIdx = progressionContextList.findIndex((prog) => prog.LoadTitle === progressionContext);
    // Find the progression index
    let watchRecordIdx = progressionContextList[progressionContextIdx].WatchRecords.findIndex((prog) => prog.LoadTitle === loadTitle);
    // Increment the episode number
    progressionContextList[progressionContextIdx].WatchRecords[watchRecordIdx].Episode = episode;
}

export function AddAnthologyProgression(title: string, type: string, progressions: ProgressionContext[], anthology: string) {
    // TODO
}

// export function GetFilteredShowProgressions(shows: Show[]): WatchRecord[] {
//     // Get all WatchRecords that have a load title that matches the show load title
//     // If a show is not found in the progression list, it is assumed that the show has not been played
//     // and a watch record is not added to the returned list
//     let watchRecords: WatchRecord[] = [];


// }