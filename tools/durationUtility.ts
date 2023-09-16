import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { Short } from '../models/short';
import { Commercial } from '../models/commercial';
import { Music } from '../models/music';
import { Promo } from '../models/promo';
import { Movie } from '../models/movie';
import { Media } from '../models/media';
import { Config } from '../models/config';
import { Show } from '../models/show';

export async function processMediaWithDurationDetection(config: Config, media: Media, mediaTypes: string[]): Promise<void> {
    console.log('Processing media duration...')
    console.log(mediaTypes);

    for (const mediaType of mediaTypes) {
        let mediaList: (Short[] | Commercial[] | Music[] | Promo[] | Movie[]) = [];
        let showList: Show[] = [];

        if (mediaType === 'shorts') {
            mediaList = media.Shorts;
        } else if (mediaType === 'commercials') {
            mediaList = media.Commercials;
        } else if (mediaType === 'music') {
            mediaList = media.Music;
        } else if (mediaType === 'promos') {
            mediaList = media.Promos;
        } else if (mediaType === 'movies') {
            mediaList = media.Movies;
        } else if (mediaType === 'shows') {
            showList = media.Shows;
        } else {
            throw new Error(
                "Any media types submitted for duration evaluation must be one of the following: shows, movies, shorts, music, promos, commercials"
            );
        }
        console.log(`Processing ${mediaList.length} ${mediaType}...`);
        if (mediaType === 'shows') {
            for (let show of media.Shows) {
                for (let episode of show.Episodes) {
                    let durationInSeconds = await getMediaDuration(episode.Path);
                    console.log(`Duration of ${episode.Title}: ${durationInSeconds}`);
                    episode.Duration = durationInSeconds; // Update duration value
                }
            }
        } else {
            for (let item of mediaList) {
                let durationInSeconds = await getMediaDuration(item.Path);
                console.log(`Duration of ${item.Title}: ${durationInSeconds}`);
                item.Duration = durationInSeconds; // Update duration value
                if (mediaType === 'movies') {
                    let movie = item as Movie;
                    movie.DurationLimit = (Math.floor(durationInSeconds / config.interval) * config.interval) + ((durationInSeconds % config.interval > 0) ? config.interval : 0);
                }
            }
        }


        console.log(`Finished processing ${mediaList.length} ${mediaType}.`)
        if (mediaType === 'shows') {
            fs.writeFileSync(config.dataFolder + "showsList.json", JSON.stringify(showList, null, 2));
        } else {
            fs.writeFileSync(config.dataFolder + `${mediaType}List.json`, JSON.stringify(mediaList, null, 2));
        }

    }
}

function getMediaDuration(filePath: string): Promise<number> {
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