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
        let durRemainder = duration - currDur;
        let injDurMovies = stagedMedia.InjectedMovies.filter(inj => inj.Duration <= durRemainder);
        if (injDurMovies.length > 0) {
            let injMovie = injDurMovies[Math.floor(Math.random() * injDurMovies.length)];
            let indexInInjectedMovies: number = stagedMedia.InjectedMovies.indexOf(injMovie);

            injMovie.Time = currentTimePoint;
            selectedMedia.push(injMovie);
            prevMovies.push(injMovie.Media as Movie);
            stagedMedia.InjectedMovies.splice(indexInInjectedMovies, 1);

            currDur = currDur + injMovie.Duration;
            currentTimePoint = currentTimePoint + injMovie.Duration;
        } else {
            if (durRemainder > 5400) {
                //Movie or Show
                if (Math.random() < 0.5) {
                    //Movie
                    let selectedMovie = selectMovieUnderDuration(options, media.Movies, duration);
                    let selectedMediaItem: SelectedMedia = new SelectedMedia(selectedMovie, MediaType.Movie, currentTimePoint, selectedMovie.DurationLimit, selectedMovie.Tags)
                    selectedMedia.push(selectedMediaItem);
                    prevMovies.push(selectedMovie);

                    currDur = currDur + selectedMovie.DurationLimit;
                    currentTimePoint = currentTimePoint + selectedMovie.DurationLimit;
                } else {
                    //Show
                    let selectedEpisodes = selectShowUnderDuration(options, media.Shows, progression, duration);
                    selectedEpisodes.forEach(episode => {
                        selectedMedia.push(new SelectedMedia(episode, MediaType.Episode, currentTimePoint, episode.DurationLimit, episode.Tags));

                        currDur = currDur + episode.DurationLimit;
                        currentTimePoint = currentTimePoint + episode.DurationLimit;
                    });

                }
            } else {
                //Show
                let selectedEpisodes = selectShowUnderDuration(options, media.Shows, progression, duration);
                selectedEpisodes.forEach(episode => {
                    selectedMedia.push(new SelectedMedia(episode, MediaType.Episode, currentTimePoint, episode.DurationLimit, episode.Tags));

                    currDur = currDur + episode.DurationLimit;
                    currentTimePoint = currentTimePoint + episode.DurationLimit;
                });
            }
        }
    }

    return selectedMedia;
}

function selectMovieUnderDuration(options: any, movies: Movie[], duration: number): Movie {
    let filteredMovies: Movie[] = movies.filter(movie =>
        movie.Tags.some(tag => options.tagsOR.includes(tag)) &&
        movie.DurationLimit <= duration
    );

    return filteredMovies[Math.floor(Math.random() * filteredMovies.length)];

}

function selectShowUnderDuration(options: any, shows: Show[], progression: MediaProgression[], duration: number): Episode[] {
    let episodes: Episode[] = [];

    let filteredShows: Show[] = shows.filter(show =>
        show.Tags.some(tag => options.tagsOR.includes(tag)) &&
        show.DurationLimit <= duration
    );

    let selectedShow = filteredShows.filter(item => {
        return duration < 3600 ? !item.OverDuration : true;
    })[Math.floor(Math.random() * filteredShows.length)];

    let episodeIdx: number[] = [];

    if (duration >= 3600) {
        if (selectedShow.OverDuration || selectedShow.DurationLimit >= 1800) {
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

    return episodes;
}


