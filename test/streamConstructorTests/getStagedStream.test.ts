import { MediaType } from "../../src/models/enum/mediaTypes";
import { SelectedMedia } from "../../src/models/selectedMedia";
import * as streamCon from "../../src/services/streamConstructor";
import { Media } from '../../src/models/media';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { StagedMedia } from '../../src/models/stagedMedia';
import * as td from '../testData/testData';
import * as proMan from '../../src/services/progressionManager';
import { Config } from "../../src/models/config";
import { StreamType } from "../../src/models/enum/streamTypes";

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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
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
            [], [], [], [], [], [], [],
        );
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedMedia, error] = streamCon.getStagedStream(rightNow, config, args, stagedMedia, media, StreamType.Cont)

        let expected: SelectedMedia[] = [];

        expect(selectedMedia).toEqual(expected);
        expect(error).toBe("End time needs to be after the last scheduled media item.");

        randomSpy.mockRestore();
    });
});