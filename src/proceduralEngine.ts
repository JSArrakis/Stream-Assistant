import { Config } from "../models/config";
import { MediaType } from "../models/enum/mediaTypes";
import { Media } from "../models/media";
import { MediaProgression, ShowProgression } from "../models/mediaProgression";
import { Movie } from "../models/movie";
import { SelectedMedia } from "../models/selectedMedia";
import { Episode, Show } from "../models/show";
import { StagedMedia } from "../models/stagedMedia";
import { ManageProgression } from "./utilities";

export function getProceduralBlock(
    config: Config,
    options: any,
    stagedMedia: StagedMedia,
    media: Media,
    prevMovies: Movie[],
    progression: MediaProgression[],
    duration: number,
    lastTimePoint: number
): SelectedMedia[] {
    let currDur: number = 0;
    let selectedMedia: SelectedMedia[] = [];
    let currentTimePoint = lastTimePoint;

    while (currDur < duration) {
        console.log("Current duration: " + currDur);
        console.log("Duration: " + duration);
        let durRemainder = duration - currDur;
        let injDurMovies = stagedMedia.InjectedMovies.filter(inj => inj.Duration <= durRemainder);
        let procDurMovies = media.Movies.filter(mov => mov.Duration <= durRemainder && !isMovieSelected(mov, prevMovies));
        if (injDurMovies.length > 0) {
            selectInjectedMovie(injDurMovies, stagedMedia, currentTimePoint, selectedMedia, prevMovies, currDur);
        } else {
            if (durRemainder > 5400) {
                //Movie or Show
                if (Math.random() < 0.5 && procDurMovies.length > 0) {
                    selectRandomMovie(options, procDurMovies, duration, selectedMedia, prevMovies, currDur, currentTimePoint);
                } else {
                    let result = selectShowUnderDuration(options, media.Shows, progression, duration);
                    result[0].forEach(episode => {
                        selectedMedia.push(new SelectedMedia(episode, result[1], MediaType.Episode, currentTimePoint, episode.DurationLimit, episode.Tags));

                        currDur = currDur + episode.DurationLimit;
                        currentTimePoint = currentTimePoint + episode.DurationLimit;
                    });
                }
            } else {
                //Show
                let result = selectShowUnderDuration(options, media.Shows, progression, duration);
                result[0].forEach(episode => {
                    selectedMedia.push(new SelectedMedia(episode, result[1], MediaType.Episode, currentTimePoint, episode.DurationLimit, episode.Tags));

                    currDur = currDur + episode.DurationLimit;
                    currentTimePoint = currentTimePoint + episode.DurationLimit;
                });
            }
        }
    }

    return selectedMedia;
}

export function selectRandomMovie(
    options: any, 
    movies: Movie[], 
    duration: number, 
    selectedMedia: SelectedMedia[], 
    prevMovies: Movie[], 
    currentDuration: number, 
    currentTimePoint: number
) {
    let selectedMovie = selectMovieUnderDuration(options, movies, prevMovies, duration);
    let selectedMediaItem: SelectedMedia = new SelectedMedia(selectedMovie, "", MediaType.Movie, currentTimePoint, selectedMovie.DurationLimit, selectedMovie.Tags)
    selectedMedia.push(selectedMediaItem);
    prevMovies.push(selectedMovie);

    currentDuration = currentDuration + selectedMovie.DurationLimit;
    currentTimePoint = currentTimePoint + selectedMovie.DurationLimit;
}

export function selectInjectedMovie(
    injectedMovies: SelectedMedia[], 
    stagedMedia: StagedMedia, 
    currentTimePoint: number, 
    selectedMedia: SelectedMedia[], 
    prevMovies: Movie[], 
    currentDuration: number
) {
    let injMovie = injectedMovies[Math.floor(Math.random() * injectedMovies.length)];
    let indexInInjectedMovies: number = stagedMedia.InjectedMovies.indexOf(injMovie);

    injMovie.Time = currentTimePoint;
    selectedMedia.push(injMovie);
    prevMovies.push(injMovie.Media as Movie);
    stagedMedia.InjectedMovies.splice(indexInInjectedMovies, 1);

    currentDuration = currentDuration + injMovie.Duration;
    currentTimePoint = currentTimePoint + injMovie.Duration;
}

export function selectMovieUnderDuration(options: any, movies: Movie[], prevMovies: Movie[], duration: number): Movie {
    let filteredMovies: Movie[] = movies.filter(movie =>
        movie.Tags.some(tag => options.tagsOR.includes(tag)) &&
        movie.DurationLimit <= duration
    );

    let notRepeatMovies: Movie[] = filteredMovies.filter((item) => !prevMovies.some((obj) => obj.LoadTitle === item.LoadTitle));

    let selectedMovie = notRepeatMovies.length > 0 ? 
    notRepeatMovies[Math.floor(Math.random() * notRepeatMovies.length)] : 
    filteredMovies[Math.floor(Math.random() * filteredMovies.length)];

    return selectedMovie;
}

export function selectShowUnderDuration(options: any, shows: Show[], progression: MediaProgression[], duration: number): [Episode[], string] {
    let episodes: Episode[] = [];

    let filteredShows: Show[] = shows.filter(show =>
        show.Tags.some(tag => options.tagsOR.includes(tag)) &&
        show.DurationLimit <= duration
    );

    let selectedShow = selectShowByDuration(duration, filteredShows)
    console.log("Selected show is " + selectedShow.Title);
    if(selectedShow === undefined) {
        throw "Something went wrong when selecting a show by Duration"
    }

    let episodeIdx: number[] = [];

    if (duration >= 3600) {
        if (selectedShow.OverDuration || selectedShow.DurationLimit > 1800) {
            //select 1
            episodeIdx = ManageProgression("Main", "Main", progression, selectedShow, 1);
        } else {
            //select 2
            
            episodeIdx = ManageProgression("Main", "Main", progression, selectedShow, 2);
        }
    } else {
        //select 1
        episodeIdx = ManageProgression("Main", "Main", progression, selectedShow, 1);
    }

    episodeIdx.forEach(idx => {
        episodes.push(selectedShow.Episodes[idx]);
    })

    return [episodes, selectedShow.Title];
}

function isMovieSelected(movie: Movie, prevMovies: Movie[]): boolean {
    return prevMovies.some(prevMovie => prevMovie.Title === movie.Title);
}

function selectShowByDuration(duration: number, shows: Show[]): Show | undefined {
    let filteredShows: Show[] = shows.filter(show => {
      if (duration < 3600) {
        return !show.OverDuration && show.DurationLimit <= duration;
      } else {
        return show.DurationLimit <= duration;
      }
    });
  
    if (filteredShows.length === 0) {
      return undefined;
    }
  
    const randomIndex = Math.floor(Math.random() * filteredShows.length);
    return filteredShows[randomIndex];
}
