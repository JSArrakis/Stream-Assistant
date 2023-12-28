import * as ffmpeg from 'fluent-ffmpeg';
import { Show } from "../models/show";

export async function transformShowFromRequest(show: any): Promise<Show> {
    let parsedShow: Show = Show.fromRequestObject(show)

    parsedShow.LoadTitle = parsedShow.Title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    parsedShow.Alias = parsedShow.LoadTitle;

    for (const episode of parsedShow.Episodes) {
        if (episode.Duration > 0) continue; // Skip if duration is already set
        console.log(`Getting duration for ${episode.Path}`);
        let durationInSeconds = await getMediaDuration(episode.Path);
        episode.Duration = durationInSeconds; // Update duration value
        episode.DurationLimit = (Math.floor(episode.Duration / 1800) * 1800) + ((episode.Duration % 1800 > 0) ? 1800 : 0);
        // set episode load title using show load title and episode number
    }

    //create an accounting of how many different duration limits there are and create a map of it
    let durationLimitsMap = new Map();
    parsedShow.Episodes.forEach(episode => {
        if (durationLimitsMap.has(episode.DurationLimit)) {
            durationLimitsMap.set(episode.DurationLimit, durationLimitsMap.get(episode.DurationLimit) + 1);
        } else {
            durationLimitsMap.set(episode.DurationLimit, 1);
        }
    });

    //use the map to determine which duration limit is the most common and use that as the show duration limit
    let maxCount = 0;
    let maxDurationLimit = 0;
    durationLimitsMap.forEach((value, key) => {
        if (value > maxCount) {
            maxCount = value;
            maxDurationLimit = key;
        }
    });
    parsedShow.DurationLimit = maxDurationLimit;

    //if there are episodes with durations over the duration limit, set the show to over duration
    parsedShow.OverDuration = parsedShow.Episodes.some(episode => episode.Duration > parsedShow.DurationLimit);

    //assume the episodes of the show are in order and set the episode number to the index of the episode in the array + 1
    parsedShow.Episodes.forEach((episode, index) => {
        episode.EpisodeNumber = index + 1;
        episode.LoadTitle = `${parsedShow.LoadTitle}-${episode.EpisodeNumber}`;
    });

    //set the episode count to the length of the episodes array
    parsedShow.EpisodeCount = parsedShow.Episodes.length;

    return parsedShow;
}

async function getMediaDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (!err) {
                const durationInSeconds: number = Math.round(Number(metadata.format.duration)) || 0;
                resolve(durationInSeconds);
            } else {
                reject(err);
            }
        });
    });
}