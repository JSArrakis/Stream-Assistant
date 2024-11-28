import * as ffmpeg from 'fluent-ffmpeg';
import { Show } from '../models/show';
import { Movie } from '../models/movie';
import { Commercial } from '../models/commercial';
import { Music } from '../models/music';
import { Promo } from '../models/promo';
import { Short } from '../models/short';
import { SegmentedTags } from '../models/segmentedTags';
import { Eras } from '../models/const/eras';
import { MainGenres } from '../models/const/mainGenres';
import { AgeGroups } from '../models/const/ageGroups';

export async function transformShowFromRequest(
  show: any,
  loadTitle: string,
): Promise<Show> {
  let parsedShow: Show = Show.fromRequestObject(show);

  parsedShow.LoadTitle = loadTitle;

  parsedShow.Alias = parsedShow.LoadTitle;

  for (const episode of parsedShow.Episodes) {
    if (episode.Duration > 0) continue; // Skip if duration is already set
    console.log(`Getting duration for ${episode.Path}`);
    let durationInSeconds = await getMediaDuration(episode.Path);
    episode.Duration = durationInSeconds; // Update duration value
    episode.DurationLimit =
      Math.floor(episode.Duration / 1800) * 1800 +
      (episode.Duration % 1800 > 0 ? 1800 : 0);
    // set episode load title using show load title and episode number
  }

  //create an accounting of how many different duration limits there are and create a map of it
  let durationLimitsMap = new Map();
  parsedShow.Episodes.forEach(episode => {
    if (durationLimitsMap.has(episode.DurationLimit)) {
      durationLimitsMap.set(
        episode.DurationLimit,
        durationLimitsMap.get(episode.DurationLimit) + 1,
      );
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
  parsedShow.OverDuration = parsedShow.Episodes.some(
    episode => episode.Duration > parsedShow.DurationLimit,
  );

  //assume the episodes of the show are in order and set the episode number to the index of the episode in the array + 1
  parsedShow.Episodes.forEach((episode, index) => {
    episode.EpisodeNumber = index + 1;
    episode.LoadTitle = `${parsedShow.LoadTitle}-${episode.EpisodeNumber}`;
  });

  //set the episode count to the length of the episodes array
  parsedShow.EpisodeCount = parsedShow.Episodes.length;

  return parsedShow;
}

export async function transformMovieFromRequest(
  movie: any,
  loadTitle: string,
): Promise<Movie> {
  let parsedMovie: Movie = Movie.fromRequestObject(movie);

  parsedMovie.LoadTitle = loadTitle;

  parsedMovie.Alias = parsedMovie.LoadTitle;
  if (parsedMovie.Duration > 0) {
    return parsedMovie;
  }
  console.log(`Getting duration for ${parsedMovie.Path}`);
  let durationInSeconds = await getMediaDuration(parsedMovie.Path);
  parsedMovie.Duration = durationInSeconds; // Update duration value
  parsedMovie.DurationLimit =
    Math.floor(parsedMovie.Duration / 1800) * 1800 +
    (parsedMovie.Duration % 1800 > 0 ? 1800 : 0);

  return parsedMovie;
}

export async function updateMovieFromRequest(
  update: any,
  movie: any,
): Promise<Movie> {
  let parsedMovie: Movie = Movie.fromRequestObject(update);

  movie.Tags = parsedMovie.Tags;

  return movie;
}

export async function transformCommercialFromRequest(
  buffer: any,
): Promise<Commercial> {
  let parsedCommercial: Commercial = Commercial.fromRequestObject(buffer);

  if (parsedCommercial.Duration > 0) {
    return parsedCommercial;
  }
  console.log(`Getting duration for ${parsedCommercial.Path}`);
  let durationInSeconds = await getMediaDuration(parsedCommercial.Path);
  parsedCommercial.Duration = durationInSeconds; // Update duration value

  return parsedCommercial;
}

export async function transformMusicFromRequest(buffer: any): Promise<Music> {
  let parsedMusic: Music = Music.fromRequestObject(buffer);

  if (parsedMusic.Duration > 0) {
    return parsedMusic;
  }
  console.log(`Getting duration for ${parsedMusic.Path}`);
  let durationInSeconds = await getMediaDuration(parsedMusic.Path);
  parsedMusic.Duration = durationInSeconds; // Update duration value

  return parsedMusic;
}

export async function transformPromoFromRequest(buffer: any): Promise<Promo> {
  let parsedPromo: Promo = Promo.fromRequestObject(buffer);

  if (parsedPromo.Duration > 0) {
    return parsedPromo;
  }
  console.log(`Getting duration for ${parsedPromo.Path}`);
  let durationInSeconds = await getMediaDuration(parsedPromo.Path);
  parsedPromo.Duration = durationInSeconds; // Update duration value

  return parsedPromo;
}

export async function transformShortFromRequest(buffer: any): Promise<Short> {
  let parsedShort: Short = Short.fromRequestObject(buffer);

  if (parsedShort.Duration > 0) {
    return parsedShort;
  }
  console.log(`Getting duration for ${parsedShort.Path}`);
  let durationInSeconds = await getMediaDuration(parsedShort.Path);
  parsedShort.Duration = durationInSeconds; // Update duration value

  return parsedShort;
}

export async function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (!err) {
        const durationInSeconds: number =
          Math.round(Number(metadata.format.duration)) || 0;
        resolve(durationInSeconds);
      } else {
        reject(err);
      }
    });
  });
}

export function segmentTags(tags: string[]): SegmentedTags {
  let segmentedTags: SegmentedTags = new SegmentedTags([], [], [], [], []);

  tags.forEach(tag => {
    if (Object.values(Eras).includes(tag)) {
      segmentedTags.EraTags.push(tag);
    } else if (Object.values(MainGenres).includes(tag)) {
      segmentedTags.GenreTags.push(tag);
    } else if (Object.values(AgeGroups).includes(tag)) {
      segmentedTags.AgeGroupTags.push(tag);
    } else {
      segmentedTags.SpecialtyTags.push(tag);
    }
  });

  segmentedTags.EraTags = [...new Set(segmentedTags.EraTags)];
  segmentedTags.GenreTags = [...new Set(segmentedTags.GenreTags)];
  segmentedTags.SpecialtyTags = [...new Set(segmentedTags.SpecialtyTags)];
  segmentedTags.AgeGroupTags = [...new Set(segmentedTags.AgeGroupTags)];
  segmentedTags.HolidayTags = [...new Set(segmentedTags.HolidayTags)];

  return segmentedTags;
}
