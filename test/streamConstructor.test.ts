import { expect } from 'chai';
import { MediaType } from "../src/models/enum/mediaTypes";
import { Movie } from "../src/models/movie";
import { SelectedMedia } from "../src/models/selectedMedia";
import { getMovie, getScheduledMedia } from "../src/services/streamConstructor";
import { MovieBuilder } from "./resources/movieBuilder";
import { Media } from '../src/models/media';
import { AdhocStreamRequest, ContStreamRequest, IStreamRequest } from '../src/models/streamRequest';


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

    it('should throw an error if the loadTitle is empty', () => {
        expect(() => getMovie('', movieList, 1609459200)).to.throw('Empty movie titles are not a valid input');
    });

    it('should throw an error if the loadTitle is undefined', () => {
        expect(() => getMovie(undefined as unknown as string, movieList, 1609459200)).to.throw('Empty movie titles are not a valid input');
    });

    it('should throw an error if the loadTitle is not found in the movie list', () => {
        expect(() => getMovie('unknownmovie', movieList, 1609459200)).to.throw('unknownmovie load title, not found.');
    });

    it('should return a SelectedMedia object for a valid loadTitle', () => {
        const time = 1609459200;
        const selectedMedia = getMovie('movieone', movieList, time);
        expect(selectedMedia).to.be.instanceOf(SelectedMedia);
        expect(selectedMedia.Media.LoadTitle).to.equal('movieone');
        expect(selectedMedia.Type).to.equal(MediaType.Movie);
        expect(selectedMedia.Time).to.equal(time);
        expect(selectedMedia.Duration).to.equal(120);
        expect(selectedMedia.Tags).to.deep.equal(['action', 'thriller']);
    });
});

describe('getScheduledMedia', () => {
    let media: Media;

    const inception = new Movie('Inception', 'inception', 'inception', 'tt1375666', ['Sci-Fi'], '/path/inception.mp4', 8880, 9000, '', 0);
    const matrix = new Movie('The Matrix', 'thematrix', 'matrix', 'tt0133093', ['Action'], '/path/matrix.mp4', 8160, 9000, '', 0);
    const interstellar = new Movie('Interstellar', 'interstellar', 'interstellar', 'tt0816692', ['Sci-Fi'], '/path/interstellar.mp4', 10140, 10800, '', 0);

    beforeEach(() => {
        // Mock media data with Movie objects
        media = new Media(
            [], // Shows
            [
                inception,
                matrix,
                interstellar
            ],
            [], // Shorts
            [], // Music
            [], // Promos
            [], // Commercials
            []  // Collections
        );
    });

    it('should schedule movies based on the provided timestamps', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception::1656547200', 'interstellar::1656633600'], // Timestamps represent example Unix times
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const expected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"])
        ];

        const result = getScheduledMedia(media, args);

        expect(result).to.deep.equal(expected);
    });

    it('should ignore movies without the "::" delimiter', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception::1656547200', 'thematrix'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const expected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"])
        ];

        const result = getScheduledMedia(media, args);

        expect(result).to.deep.equal(expected);
    });

    it('should return an empty array when no movies are provided', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: [],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const result = getScheduledMedia(media, args);

        expect(result).to.deep.equal([]);
    });

    it('should sort the selected media based on time', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['interstellar::1656633600', 'inception::1656547200'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const expected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"])
        ];

        const result = getScheduledMedia(media, args);

        expect(result).to.deep.equal(expected);
    });

    it('should handle multiple types of stream requests', () => {
        const contArgs = new ContStreamRequest(
            "securepassword",
            "Continuous Stream",
            "production",
            ['inception::1656547200', 'thematrix::1656633600'],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            1656547200
        );

        const adhocArgs = new AdhocStreamRequest(
            "securepassword",
            "Adhoc Stream",
            "production",
            ['interstellar::1656633600', 'inception::1656547200'],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            1656547200,
            1656647200
        );

        const contExpected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(matrix, '', MediaType.Movie, 1656633600, 9000, ["Action"]),
        ];

        const adhocExpected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"]),
        ];

        const contResult = getScheduledMedia(media, contArgs);
        const adhocResult = getScheduledMedia(media, adhocArgs);

        expect(contResult).to.deep.equal(contExpected);
        expect(adhocResult).to.deep.equal(adhocExpected);
    });
});