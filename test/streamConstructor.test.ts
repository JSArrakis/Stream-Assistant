import { expect } from 'chai';
import { MediaType } from "../src/models/enum/mediaTypes";
import { Movie } from "../src/models/movie";
import { SelectedMedia } from "../src/models/selectedMedia";
import * as streamCon from "../src/services/streamConstructor";
import { MovieBuilder } from "./resources/movieBuilder";
import { Media } from '../src/models/media';
import { AdhocStreamRequest, ContStreamRequest, IStreamRequest } from '../src/models/streamRequest';
import exp from 'constants';
import moment from 'moment';
import { StagedMedia } from '../src/models/stagedMedia';

const inception = new Movie('Inception', 'inception', 'inception', 'tt1375666', ['Sci-Fi'], '/path/inception.mp4', 8880, 9000, '', 0);
const matrix = new Movie('The Matrix', 'thematrix', 'matrix', 'tt0133093', ['Action'], '/path/matrix.mp4', 8160, 9000, '', 0);
const interstellar = new Movie('Interstellar', 'interstellar', 'interstellar', 'tt0816692', ['Sci-Fi'], '/path/interstellar.mp4', 10140, 10800, '', 0);

const media = new Media(
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

    it('should return an error if the loadTitle is empty', () => {
        let movie = streamCon.getMovie('', movieList, 1609459200)
        expect(movie[0]).to.be.instanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).to.equal('');
        expect(movie[1]).to.equal('Empty movie titles are not a valid input');

    });

    it('should return an error if the loadTitle is undefined', () => {
        let movie = streamCon.getMovie(undefined as unknown as string, movieList, 1609459200)
        expect(movie[0]).to.be.instanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).to.equal('');
        expect(movie[1]).to.equal('Empty movie titles are not a valid input');
    });

    it('should return an error if the loadTitle is not found in the movie list', () => {
        let movie = streamCon.getMovie('unknownmovie', movieList, 1609459200)
        expect(movie[0]).to.be.instanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).to.equal('');
        expect(movie[1]).to.equal('unknownmovie load title, not found.');
    });

    it('should return a SelectedMedia object for a valid loadTitle', () => {
        const time = 1609459200;
        const selectedMedia = streamCon.getMovie('movieone', movieList, time);
        expect(selectedMedia[1]).to.equal('');
        expect(selectedMedia[0]).to.be.instanceOf(SelectedMedia);
        expect(selectedMedia[0].Media.LoadTitle).to.equal('movieone');
        expect(selectedMedia[0].Type).to.equal(MediaType.Movie);
        expect(selectedMedia[0].Time).to.equal(time);
        expect(selectedMedia[0].Duration).to.equal(120);
        expect(selectedMedia[0].Tags).to.deep.equal(['action', 'thriller']);
    });
});

describe('getScheduledMedia', () => {
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

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.equal('');
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

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.equal('');
    });

    it('should return an error when a movie is not found', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['unknownmovie::1656547200'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).to.deep.equal([]);
        expect(result[1]).to.equal('unknownmovie load title, not found.');
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

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).to.deep.equal([]);
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

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.equal('');
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

        const contResult = streamCon.getScheduledMedia(media, contArgs);
        const adhocResult = streamCon.getScheduledMedia(media, adhocArgs);

        expect(contResult[0]).to.deep.equal(contExpected);
        expect(contResult[1]).to.equal('');
        expect(adhocResult[0]).to.deep.equal(adhocExpected);
        expect(adhocResult[1]).to.equal('');
    });
});

describe('getInjectedMovies', () => {
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

        const result = streamCon.getInjectedMovies(args, media.Movies);

        expect(result[0]).to.deep.equal([]);
    });

    it('should return an error when any loadtitle provided does is not found', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['unknownmovie'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const result = streamCon.getInjectedMovies(args, media.Movies);

        expect(result[0]).to.deep.equal([]);
        expect(result[1]).to.equal('unknownmovie load title, not found.');
    });

    it('should return an empty array when no movies are provided without the "::" delimiter', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception::1656547200'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const result = streamCon.getInjectedMovies(args, media.Movies);

        expect(result[0]).to.deep.equal([]);
        expect(result[1]).to.equal('');
    });

    it('should return the movies that match the provided load titles', () => {
        const args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception', 'interstellar'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const expected = [
            new SelectedMedia(inception, '', MediaType.Movie, 0, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 0, 10800, ["Sci-Fi"])
        ];

        const result = streamCon.getInjectedMovies(args, media.Movies);

        expect(result[0]).to.deep.equal(expected);
        expect(result[1]).to.equal('');
    });
});

describe('compareSelectedEndTime', () => {
    it('should not return an error if the end time is greater than the last scheduled media plus its duration', () => {
        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"])
        ];

        const error = streamCon.compareSelectedEndTime(1656644400, selected);

        expect(error).to.equal('');
    });

    it('should return an error if the end time is less than the last scheduled media plus its duration', () => {
        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"])
        ];

        const error = streamCon.compareSelectedEndTime(1656633600, selected);

        expect(error).to.equal('Scheduled time for interstellar exceeds selected endTime');
    });
});

describe('evaluateStreamEndTime', () => {
    it('should return the scheduled end time if it exceeds the last media schedule time and its duration', () => {
        const adhocArgs = new AdhocStreamRequest(
            "securepassword",
            "Adhoc Stream",
            "production",
            ['interstellar::1656633600', 'inception::1656547200'],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            0,
            1656647200
        );
        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(interstellar, '', MediaType.Movie, 1656633600, 10800, ["Sci-Fi"])
        ];

        const result = streamCon.evaluateStreamEndTime(adhocArgs, selected);

        expect(result[0]).to.equal(1656647200);
        expect(result[1]).to.equal('');
    });

    it('should return the scheduled time plus the duration of the last scheduled media if no endTime was submitted', () => {
        const adhocArgs = new AdhocStreamRequest(
            "securepassword",
            "AdHoc Stream",
            "production",
            ['inception::1656547200', 'thematrix::1656633600'],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            0
        );
        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(matrix, '', MediaType.Movie, 1656633600, 9000, ["Action"]),
        ];

        const result = streamCon.evaluateStreamEndTime(adhocArgs, selected);

        expect(result[0]).to.equal(1656633600 + 9000);
        expect(result[1]).to.equal('');
    });

    it('should return the end of the day today if no endTime was submitted and no media was scheduled', () => {
        const adhocArgs = new AdhocStreamRequest(
            "securepassword",
            "Adhoc Stream",
            "production",
            [],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            0
        );
        const selected: SelectedMedia[] = [];

        const result = streamCon.evaluateStreamEndTime(adhocArgs, selected);

        expect(result[0]).to.equal(moment().startOf('day').add(1, "days").unix());
        expect(result[1]).to.equal('');
    });

    it('should return the end of the day today if it is a continuous stream', () => {
        const contArgs = new ContStreamRequest(
            "securepassword",
            "Continuous Stream",
            "production",
            ['inception::1656547200', 'thematrix::1656633600'],
            ['tag1', 'tag2'],
            [['multiTag1'], ['multiTag2']],
            ['Collection1'],
            0
        );

        const result = streamCon.evaluateStreamEndTime(contArgs, []);

        expect(result[0]).to.equal(moment().startOf('day').add(1, "days").unix());
        expect(result[1]).to.equal('');
    });
});

describe('setProceduralTags', () => {
    it('should populate the tags array of the args object with the tags of the selected media if the args tags array is empty', () => {
        let args: IStreamRequest = {
            Title: "Example Title",
            Env: "production",
            Movies: ['inception::1656547200', 'interstellar::1656633600'],
            Tags: [],
            MultiTags: [],
            Collections: [],
            StartTime: 1656547200,
            Password: "securepassword"
        };

        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(matrix, '', MediaType.Movie, 1656633600, 10800, ["Action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);
        streamCon.setProceduralTags(args, stagedMedia);

        expect(args.Tags).to.deep.equal(["Sci-Fi", "Action"]);
    });
});

describe('getInitialProceduralTimepoint', () => {
    it('should return the start time of the first scheduled media', () => {
        const rightNow = 1656546397

        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(matrix, '', MediaType.Movie, 1656633600, 10800, ["Action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).to.equal(1656547200);
        expect(error).to.equal('');
    });

    it('should return the staged media end time if no media is scheduled', () => {
        const rightNow = 1656546397

        const selected: SelectedMedia[] = [];

        const stagedMedia = new StagedMedia(selected, [], 1656633600);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).to.equal(1656633600);
        expect(error).to.equal('');
    });

    it('should return an error if the first scheduled media is in the past', () => {
        const rightNow = 1656547201

        const selected = [
            new SelectedMedia(inception, '', MediaType.Movie, 1656547200, 9000, ["Sci-Fi"]),
            new SelectedMedia(matrix, '', MediaType.Movie, 1656633600, 10800, ["Action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).to.equal(0);
        expect(error).to.equal('Time of first movie, collection, or selected end time needs to be in the future.');
    });
});