import { MediaType } from "../src/models/enum/mediaTypes";
import { Movie } from "../src/models/movie";
import { SelectedMedia } from "../src/models/selectedMedia";
import * as streamCon from "../src/services/streamConstructor";
import { Media } from '../src/models/media';
import { AdhocStreamRequest, ContStreamRequest, IStreamRequest } from '../src/models/streamRequest';
import moment from 'moment';
import { StagedMedia } from '../src/models/stagedMedia';
import * as td from './data/testData';
import * as proMan from '../src/services/progressionManager';
import { Config } from "../src/models/config";
import { StreamType } from "../src/models/enum/streamTypes";

describe('getMovie', () => {
    let movieList: Movie[];

    beforeEach(() => {
        movieList = [
            td.inception,
            td.matrix
        ];
    });

    it('should return an error if the loadTitle is empty', () => {
        let movie = streamCon.getMovie('', movieList, 1609459200)
        expect(movie[0]).toBeInstanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).toBe('');
        expect(movie[1]).toBe('Empty movie titles are not a valid input');

    });

    it('should return an error if the loadTitle is undefined', () => {
        let movie = streamCon.getMovie(undefined as unknown as string, movieList, 1609459200)
        expect(movie[0]).toBeInstanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).toBe('');
        expect(movie[1]).toBe('Empty movie titles are not a valid input');
    });

    it('should return an error if the loadTitle is not found in the movie list', () => {
        let movie = streamCon.getMovie('unknownmovie', movieList, 1609459200)
        expect(movie[0]).toBeInstanceOf(SelectedMedia);
        expect(movie[0].Media.LoadTitle).toBe('');
        expect(movie[1]).toBe('unknownmovie load title, not found.');
    });

    it('should return a SelectedMedia object for a valid loadTitle', () => {
        const time = 1609459200;
        const selectedMedia = streamCon.getMovie(movieList[0].LoadTitle, movieList, time);
        expect(selectedMedia[1]).toBe('');
        expect(selectedMedia[0]).toBeInstanceOf(SelectedMedia);
        expect(selectedMedia[0].Media.LoadTitle).toBe(movieList[0].LoadTitle);
        expect(selectedMedia[0].Type).toBe(MediaType.Movie);
        expect(selectedMedia[0].Time).toBe(time);
        expect(selectedMedia[0].Duration).toBe(9000);
        expect(selectedMedia[0].Tags).toEqual(['scifi']);
    });
});

describe('getScheduledMedia', () => {
    const media = new Media(
        [], // Shows
        [
            td.inception,
            td.matrix,
            td.interstellar
        ],
        [], // Shorts
        [], // Music
        [], // Promos
        [], // Commercials
        []  // Collections
    );

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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"])
        ];

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).toEqual(expected);
        expect(result[1]).toBe('');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"])
        ];

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).toEqual(expected);
        expect(result[1]).toBe('');
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

        expect(result[0]).toEqual([]);
        expect(result[1]).toBe('unknownmovie load title, not found.');
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

        expect(result[0]).toEqual([]);
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"])
        ];

        const result = streamCon.getScheduledMedia(media, args);

        expect(result[0]).toEqual(expected);
        expect(result[1]).toBe('');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 9000, ["action"]),
        ];

        const adhocExpected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"]),
        ];

        const contResult = streamCon.getScheduledMedia(media, contArgs);
        const adhocResult = streamCon.getScheduledMedia(media, adhocArgs);

        expect(contResult[0]).toEqual(contExpected);
        expect(contResult[1]).toBe('');
        expect(adhocResult[0]).toEqual(adhocExpected);
        expect(adhocResult[1]).toBe('');
    });
});

describe('getInjectedMovies', () => {
    const media = new Media(
        [], // Shows
        [
            td.inception,
            td.matrix,
            td.interstellar
        ],
        [], // Shorts
        [], // Music
        [], // Promos
        [], // Commercials
        []  // Collections
    );

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

        expect(result[0]).toEqual([]);
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

        expect(result[0]).toEqual([]);
        expect(result[1]).toBe('unknownmovie load title, not found.');
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

        expect(result[0]).toEqual([]);
        expect(result[1]).toBe('');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 0, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 0, 10800, ["scifi"])
        ];

        const result = streamCon.getInjectedMovies(args, media.Movies);

        expect(result[0]).toEqual(expected);
        expect(result[1]).toBe('');
    });
});

describe('compareSelectedEndTime', () => {
    it('should not return an error if the end time is greater than the last scheduled media plus its duration', () => {
        const selected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"])
        ];

        const error = streamCon.compareSelectedEndTime(1656644400, selected);

        expect(error).toBe('');
    });

    it('should return an error if the end time is less than the last scheduled media plus its duration', () => {
        const selected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"])
        ];

        const error = streamCon.compareSelectedEndTime(1656633600, selected);

        expect(error).toBe('Scheduled time for interstellar exceeds selected endTime');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.interstellar, '', MediaType.Movie, 1656633600, 10800, ["scifi"])
        ];

        const result = streamCon.evaluateStreamEndTime(adhocArgs, selected);

        expect(result[0]).toBe(1656647200);
        expect(result[1]).toBe('');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 9000, ["action"]),
        ];

        const result = streamCon.evaluateStreamEndTime(adhocArgs, selected);

        expect(result[0]).toBe(1656633600 + 9000);
        expect(result[1]).toBe('');
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

        expect(result[0]).toBe(moment().startOf('day').add(1, "days").unix());
        expect(result[1]).toBe('');
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

        expect(result[0]).toBe(moment().startOf('day').add(1, "days").unix());
        expect(result[1]).toBe('');
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
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 10800, ["action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);
        streamCon.setProceduralTags(args, stagedMedia);

        expect(args.Tags).toEqual(["scifi", "action"]);
    });
});

describe('getInitialProceduralTimepoint', () => {
    it('should return the start time of the first scheduled media', () => {
        const rightNow = 1656546397

        const selected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 10800, ["action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).toBe(1656547200);
        expect(error).toBe('');
    });

    it('should return the staged media end time if no media is scheduled', () => {
        const rightNow = 1656546397

        const selected: SelectedMedia[] = [];

        const stagedMedia = new StagedMedia(selected, [], 1656633600);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).toBe(1656633600);
        expect(error).toBe('');
    });

    it('should return an error if the first scheduled media is in the past', () => {
        const rightNow = 1656547201

        const selected = [
            new SelectedMedia(td.inception, '', MediaType.Movie, 1656547200, 9000, ["scifi"]),
            new SelectedMedia(td.matrix, '', MediaType.Movie, 1656633600, 10800, ["action"])
        ];

        const stagedMedia = new StagedMedia(selected, [], 1656633600 + 10800);

        const [result, error] = streamCon.getInitialProceduralTimepoint(rightNow, stagedMedia);

        expect(result).toBe(0);
        expect(error).toBe('Time of first scheduled movie, or collection needs to be in the future.');
    });
});

describe('setInitialBlockDuration', () => {
    it('should return the duration of the first procedural block (scenario 1)', () => {
        const rightNow = 1651750471
        const firstTimePoint = 1651752000
        const duration = firstTimePoint - rightNow

        let [preMediaDuration, initialProceduralBlockDuration] = streamCon.setInitialBlockDuration(1800, duration);
        expect(preMediaDuration).toBe(1529);
        expect(initialProceduralBlockDuration).toBe(0);
    });

    it('should return the duration of the first procedural block (scenario 2)', () => {
        const rightNow = 1651750471
        const firstTimePoint = 1651755600
        const duration = firstTimePoint - rightNow

        let [preMediaDuration, initialProceduralBlockDuration] = streamCon.setInitialBlockDuration(1800, duration);
        expect(preMediaDuration).toBe(1529);
        expect(initialProceduralBlockDuration).toBe(3600);
    });

    it('should return the duration of the first procedural block (scenario 3)', () => {
        const rightNow = 1651752000
        const firstTimePoint = 1651755600
        const duration = firstTimePoint - rightNow

        let [preMediaDuration, initialProceduralBlockDuration] = streamCon.setInitialBlockDuration(1800, duration);
        expect(preMediaDuration).toBe(0);
        expect(initialProceduralBlockDuration).toBe(3600);
    });
});

describe('getStagedStream', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    const rightNow = 1651750471
    const config = new Config("", 1800, "", "");
    const args = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment, [], ['scifi', 'action']);

    it('should return a list of selected media and an empty error message (scenario 1)', () => {
        let stagedMedia = new StagedMedia(
            [],
            [new SelectedMedia(td.matrix, "", MediaType.Movie, 0, 9000, ["action"])],
            1651753800
        );

        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)
        let expected = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651752000, 1800, ["scifi", "adventure"])
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 2)', () => {
        let stagedMedia = new StagedMedia(
            [],
            [new SelectedMedia(td.matrix, "", MediaType.Movie, 0, 9000, ["action"])],
            1651761000
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)
        let expected = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651752000, 9000, ["action"])
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 3)', () => {
        let stagedMedia = new StagedMedia(
            [],
            [new SelectedMedia(td.matrix, "", MediaType.Movie, 0, 9000, ["action"])],
            1651762800
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)
        let expected = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651752000, 9000, ["action"]),
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651761000, 1800, ["scifi", "adventure"])
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 4)', () => {
        let stagedMedia = new StagedMedia(
            [new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"])],
            [],
            1651762800
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)
        let expected = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651752000, 1800, ["scifi", "adventure"]),
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"])
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 5)', () => {
        let stagedMedia = new StagedMedia(
            [new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"])],
            [new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ["scifi"])],
            1651764600
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)
        let expected = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651752000, 1800, ["scifi", "adventure"]),
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
            new SelectedMedia(td.reboot.Episodes[2], td.reboot.Title, MediaType.Episode, 1651762800, 1800, ["scifi", "adventure"]),
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 6)', () => {
        let stagedMedia = new StagedMedia(
            [
                new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
                new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"])
            ],
            [
                new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ["scifi"]),
            ],
            1651777200
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651752000, 1800, ["scifi", "adventure"]),
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
            new SelectedMedia(td.farscape.Episodes[0], td.farscape.Title, MediaType.Episode, 1651762800, 3600, ["scifi", "adventure"]),
            new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"]),
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 7)', () => {
        let stagedMedia = new StagedMedia(
            [
                new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
                new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"])
            ],
            [
                new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ["scifi"]),
            ],
            1651795200
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)

        let expected = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, 1651752000, 1800, ["scifi", "adventure"]),
            new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
            new SelectedMedia(td.farscape.Episodes[0], td.farscape.Title, MediaType.Episode, 1651762800, 3600, ["scifi", "adventure"]),
            new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"]),
            new SelectedMedia(td.inception, "", MediaType.Movie, 1651777200, 9000, ["scifi"]),
            new SelectedMedia(td.startrek.Episodes[0], td.startrek.Title, MediaType.Episode, 1651786200, 7200, ["scifi", "adventure"]),
            new SelectedMedia(td.reboot.Episodes[2], td.reboot.Title, MediaType.Episode, 1651793400, 1800, ["scifi", "adventure"]),
        ];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe('');

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 8)', () => {
        let stagedMedia = new StagedMedia(
            [
                new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
                new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"])
            ],
            [
                new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ["scifi"]),
            ],
            1651750200
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)

        let expected: SelectedMedia[] = [];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe("End time needs to be in the future.");

        randomSpy.mockRestore();
    });

    it('should return a list of selected media and an empty error message (scenario 8)', () => {
        let stagedMedia = new StagedMedia(
            [
                new SelectedMedia(td.matrix, "", MediaType.Movie, 1651753800, 9000, ["action"]),
                new SelectedMedia(td.interstellar, "", MediaType.Movie, 1651766400, 10800, ["scifi"])
            ],
            [
                new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ["scifi"]),
            ],
            1651766400
        );
        let media = new Media(
            [
                td.reboot,
                td.farscape,
                td.startrek
            ],
            [
                td.inception,
                td.matrix,
                td.interstellar,
                td.dune
            ],
            [], [], [], [], []
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)

        let expected: SelectedMedia[] = [];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe("End time needs to be after the last scheduled media item.");

        randomSpy.mockRestore();
    });
});