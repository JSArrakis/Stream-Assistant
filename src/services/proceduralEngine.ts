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
    latestTimePoint: number
): SelectedMedia[] {
    let currDur: number = 0;
    let selectedMedia: SelectedMedia[] = [];
    let currentTimePoint = latestTimePoint;

    while (currDur < duration) {
        let durRemainder = duration - currDur;
        let injDurMovies = stagedMedia.InjectedMovies.filter(inj => inj.Duration <= durRemainder);
        let procDurMovies = media.Movies.filter(mov => mov.Duration <= durRemainder && !isMovieSelected(mov, prevMovies));
        if (injDurMovies.length > 0) {
            //TODO: Add logic to select injected movie based on tags
            //separate movies that share tags with all scheduled movies that have gaps big enough to fit the duration
            //of the injected movies in the selection (so gaps that are 2 hours or more)
            //first match up all injected movies available with the adjacent tags into the appropriate gaps, then
            //the movies filling the gaps will be selected at random from the groupings by tag
            //now this will get complicated, but to make this intelligent, we will want to put anthologies in order through
            //the entire stream duration. So if we have multiple gaps that have tags where a movie that is part of an anthology
            //can be selected, we will want to select the movie that is next in the anthology. When an anthology movie is selected,
            //we will want to check against an anthology object array to see if this anthology has already been selected, and if so,
            //we will want to select the next movie in the anthology. If the anthology has not been selected, 
            let injMovie = injDurMovies[Math.floor(Math.random() * injDurMovies.length)];
            let indexInInjectedMovies: number = stagedMedia.InjectedMovies.indexOf(injMovie);

            injMovie.Time = currentTimePoint;
            stagedMedia.InjectedMovies.splice(indexInInjectedMovies, 1);
            selectedMedia.push(injMovie);
            prevMovies.push(injMovie.Media as Movie);
            currentTimePoint = currentTimePoint + injMovie.Duration
            currDur = currDur + injMovie.Duration;
        } else {
            if (durRemainder > 5400) {
                //Movie or Show
                let selectedMovie = selectMovieUnderDuration(options, media.Movies, prevMovies, durRemainder);
                if (Math.random() < 0.5 && procDurMovies.length > 0 && selectedMovie !== undefined) {
                    let selectedMediaItem: SelectedMedia = new SelectedMedia(selectedMovie, "", MediaType.Movie, currentTimePoint, selectedMovie.DurationLimit, selectedMovie.Tags)
                    selectedMedia.push(selectedMediaItem);
                    prevMovies.push(selectedMovie);

                    currDur = currDur + selectedMovie.DurationLimit;
                    currentTimePoint = currentTimePoint + selectedMovie.DurationLimit;
                } else {
                    let result = selectShowUnderDuration(options, media.Shows, progression, durRemainder);
                    result[0].forEach(episode => {

                        selectedMedia.push(new SelectedMedia(episode, result[1], MediaType.Episode, currentTimePoint, episode.DurationLimit, episode.Tags));
                        currDur = currDur + episode.DurationLimit;
                        currentTimePoint = currentTimePoint + episode.DurationLimit;
                    });
                }
            } else {
                //Show
                let result = selectShowUnderDuration(options, media.Shows, progression, durRemainder);
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

    let selectedShow = selectShowByDuration(duration, filteredShows);
    if (selectedShow === undefined) {
        throw new Error(
            "Something went wrong when selecting a show by Duration"
        );
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
        if (selectedShow !== undefined) {
            let episode = selectedShow.Episodes[idx - 1]
            //add selectedShow tags to episode tags that dont already exist
            episode.Tags = [...new Set([...selectedShow.Tags, ...episode.Tags])];
            episodes.push(episode);
        }
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
