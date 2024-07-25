import test from "node:test";
import { Movie } from "../../src/models/movie";
import { getMovie } from "../../src/services/streamConstructor";
import { MovieBuilder } from "./movieBuilder";
import { SelectedMedia } from "../../src/models/selectedMedia";
import { MediaType } from "../../src/models/enum/mediaTypes";


describe('getMovie', () => {
    let movieList: Movie[];

    beforeEach(() => {
        movieList = [
            new MovieBuilder()
                .setTitle('Movie One')
                .setLoadTitle('movieone')
                .setDuration(120)
                .setDurationLimit(120)
                .setTags(['action', 'thriller'])
                .build(),
            new MovieBuilder()
                .setTitle('Movie Two')
                .setLoadTitle('movietwo')
                .setDuration(90)
                .setDurationLimit(90)
                .setTags(['comedy'])
                .build(),
        ];
    });

    test('should throw an error if the loadTitle is empty', () => {
        expect(() => getMovie('', movieList, 1609459200)).toThrow('Empty movie titles are not a valid input');
    });

    test('should throw an error if the loadTitle is undefined', () => {
        expect(() => getMovie(undefined as unknown as string, movieList, 1609459200)).toThrow('Empty movie titles are not a valid input');
    });

    test('should throw an error if the loadTitle is not found in the movie list', () => {
        expect(() => getMovie('unknownmovie', movieList, 1609459200)).toThrow('unknownmovie load title, not found.');
    });

    test('should return a SelectedMedia object for a valid loadTitle', () => {
        const selectedMedia = getMovie('movieone', movieList, 1609459200);
        expect(selectedMedia).toBeInstanceOf(SelectedMedia);
        expect(selectedMedia.Media.LoadTitle).toBe('movieone');
        expect(selectedMedia.Type).toBe(MediaType.Movie);
        expect(selectedMedia.Time).toBe(1609459200);
        expect(selectedMedia.Duration).toBe(120);
        expect(selectedMedia.Tags).toEqual(['action', 'thriller']);
    });
});