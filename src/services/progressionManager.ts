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

let mediaProgressionList: ProgressionContext[] = [];

export function SetProgression(prog: ProgressionContext[]) {
    mediaProgressionList = prog;
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
        mediaProgression = GetMediaProgression(collection, keyNormalizer(collection), args.Env, StreamType.Collection);
    } else {
        mediaProgression = GetMediaProgression(args.Title, mediaLoadTitle, args.Env, streamType);
    }

    // Find the show progression in the media progression
    let showProgression = GetProgression(mediaProgression, show.Title);

    // Get the episodes to play
    episodeNumbers = GetEpisodesToPlay(mediaLoadTitle, show, showProgression, numberOfEpisodes);
    return episodeNumbers;

}

export function GetMediaProgression(mediaTitle: string, mediaLoadTitle: string, environment: string, type: StreamType): ProgressionContext {
    // Find the media progression in the list
    let mediaProgression = mediaProgressionList.find((prog) => prog.LoadTitle === mediaLoadTitle);
    // If the media progression is not found, create a new one
    if (!mediaProgression) {
        mediaProgression = new ProgressionContext(mediaTitle, mediaLoadTitle, environment, type, []);
        mediaProgressionList.push(mediaProgression);
    }

    return mediaProgression;
}

export function GetProgression(mediaProgression: ProgressionContext, title: string): WatchRecord {
    // Find the progression in the media progression
    let progression = mediaProgression.Progressions.find((prog) => prog.LoadTitle === title);
    // If the progression is not found, create a new one in the media progression list
    if (!progression) {
        progression = new WatchRecord(title, keyNormalizer(title), 1, 0);
        // Find the media progression index
        let mediaProgressionIndex = mediaProgressionList.findIndex((prog) => prog.LoadTitle === mediaProgression.LoadTitle);
        // Add the progression to the media progression list
        mediaProgressionList[mediaProgressionIndex].Progressions.push(progression);
    }

    return progression;
}

export function GetEpisodesToPlay(mediaLoadTitle: string, show: Show, progression: WatchRecord, numberOfEpisodes: number): number[] {
    // Array to hold the episode numbers
    let episodeNumbers: number[] = [];
    // If the show has not been played, start from the first episode
    if (progression.Episode === 0) {
        for (let i = 1; i <= numberOfEpisodes; i++) {
            // If the episode number selected exceeds the number of episodes, set the episode number to the first episode
            if (i > show.EpisodeCount) {
                episodeNumbers.push(1);
                IncrementProgression(mediaLoadTitle, progression.LoadTitle, 1)
            } else {
                episodeNumbers.push(i);
                IncrementProgression(mediaLoadTitle, progression.LoadTitle, i)
            }
        }
    } else {
        // If the show has been played, start from the next episode
        for (let i = progression.Episode + 1; i <= numberOfEpisodes; i++) {
            // If the episode number selected exceeds the number of episodes, set the episode number to the first episode
            if (i > show.EpisodeCount) {
                episodeNumbers.push(1);
                IncrementProgression(mediaLoadTitle, progression.LoadTitle, 1)
            } else {
                episodeNumbers.push(i);
                IncrementProgression(mediaLoadTitle, progression.LoadTitle, i)
            }
        }
    }

    return episodeNumbers;
}

export function IncrementProgression(mediaLoadTitle: string, loadTitle: string, episode: number): void {
    //Sets local progression to the next episode
    // Find the media progression index
    let mediaProgressionIndex = mediaProgressionList.findIndex((prog) => prog.LoadTitle === mediaLoadTitle);
    // Find the progression index
    let progressionIndex = mediaProgressionList[mediaProgressionIndex].Progressions.findIndex((prog) => prog.LoadTitle === loadTitle);
    // Increment the episode number
    mediaProgressionList[mediaProgressionIndex].Progressions[progressionIndex].Episode = episode;

}

export function AddAnthologyProgression(title: string, type: string, progression: ProgressionContext[], anthology: string) {

}