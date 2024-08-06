import * as proEng from '../src/services/proceduralEngine';
import * as proMan from '../src/services/progressionManager';
import { Movie } from '../src/models/movie';
import { ContStreamRequest } from '../src/models/streamRequest';
import { Episode, Show } from '../src/models/show';
import { StreamType } from '../src/models/enum/streamTypes';
import { ProgressionContext, WatchRecord } from '../src/models/progressionContext';
import { StagedMedia } from '../src/models/stagedMedia';
import { Media } from '../src/models/media';
import { SelectedMedia } from '../src/models/selectedMedia';
import { MediaType } from '../src/models/enum/mediaTypes';
import * as td from './data/testData';

describe('isMovieSelected', () => {
    it('should return true if the movie is in the list of previous movies', () => {
        let prevMovies: Movie[] = [td.inception, td.matrix, td.interstellar];

        let result = proEng.isMoviePreviouslySelected(td.inception, prevMovies);

        expect(result).toBeTrue;
    });

    it('should return false if the movie is not in the list of previous movies', () => {
        let prevMovies: Movie[] = [td.inception, td.matrix];

        let result = proEng.isMoviePreviouslySelected(td.interstellar, prevMovies);

        expect(result).toBeFalse;
    });
});

describe('selectMovieUnderDuration', () => {
    it('should return a movie that is under the duration limit that has the tags in the request object', () => {
        let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let prevMovies: Movie[] = [];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi']);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);


        expect(result).toEqual(td.inception);
    });

    it('should return a movie that is under the duration limit that has the tags in the request object and has not been selected before', () => {
        let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let prevMovies: Movie[] = [td.inception, td.matrix, td.dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 10800);

        expect(result).toEqual(td.interstellar);
    });

    it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 1)', () => {
        let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let prevMovies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.4);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);

        expect(result).toEqual(td.inception)

        randomSpy.mockRestore();
    });

    it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 2)', () => {
        let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let prevMovies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);

        expect(result).toEqual(td.matrix)

        randomSpy.mockRestore();
    });
});

describe('selectShowByDuration', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment);

    it('should return a show that is under the duration limit (result scenario 1)', () => {
        let shows: Show[] = [td.reboot, td.startrek, td.farscape];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 1800, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.reboot)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 2)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.farscape)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 3)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.startrek)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 4)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [td.farscape, td.reboot, td.dragonballz, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [td.farscape, td.dragonballz, td.reboot, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.dragonballz)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 6)', () => {
        let shows: Show[] = [td.farscape, td.tenchi, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 1800, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.tenchi)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 7)', () => {
        let shows: Show[] = [td.farscape, td.tenchi, td.reboot, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 8)', () => {
        let shows: Show[] = [td.farscape, td.tenchi, td.reboot];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        proMan.IncrementWatchRecord(td.continuousProgression.LoadTitle, td.tenchiWatchRecord.LoadTitle, 3, td.tenchi);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.tenchi)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 8)', () => {
        let shows: Show[] = [td.farscape, td.batman];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.batman)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 9)', () => {
        let shows: Show[] = [td.farscape, td.batman];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        proMan.IncrementWatchRecord(td.continuousProgression.LoadTitle, td.batmanWatchRecord.LoadTitle, 4, td.batman);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(td.batman)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });
});

describe('getEpisodesUnderDuration', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment, [], ['scifi', 'action']);

    it('should return an array of episodes that are under the duration limit (result scenario 1)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 1800, StreamType.Cont);

        expect(episodes).toEqual([td.reboot.Episodes[1]]);
        expect(showTitle).toEqual(td.reboot.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 2)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([td.reboot.Episodes[1], td.reboot.Episodes[2]]);
        expect(showTitle).toEqual(td.reboot.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 3)', () => {
        let shows: Show[] = [td.batman, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([td.batman.Episodes[0], td.batman.Episodes[1]]);
        expect(showTitle).toEqual(td.batman.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 4)', () => {
        let shows: Show[] = [td.batman, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        proMan.IncrementWatchRecord(td.continuousProgression.LoadTitle, td.batmanWatchRecord.LoadTitle, 4, td.batman);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([td.batman.Episodes[4], td.batman.Episodes[0]]);
        expect(showTitle).toEqual(td.batman.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([td.farscape.Episodes[0]]);
        expect(showTitle).toEqual(td.farscape.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 6)', () => {
        let shows: Show[] = [td.reboot, td.farscape, td.startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 7200, StreamType.Cont);

        expect(episodes).toEqual([td.startrek.Episodes[0]]);
        expect(showTitle).toEqual(td.startrek.Title);
        randomSpy.mockRestore();
    });
});

describe('getProceduralBlock', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment, [], ['scifi', 'action']);

    it('should fill the procedural block with available media (scenario 1)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 1800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 2)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 3600, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.farscape.Episodes[0], td.farscape.Title, MediaType.Episode, latestTimePoint, 3600, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 3)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 3600, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[2], td.reboot.Title, MediaType.Episode, latestTimePoint + 1800, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 4)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 5400, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.farscape.Episodes[0], td.farscape.Title, MediaType.Episode, latestTimePoint, 3600, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint + 3600, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 5)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 5400, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[2], td.reboot.Title, MediaType.Episode, latestTimePoint + 1800, 1800, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[3], td.reboot.Title, MediaType.Episode, latestTimePoint + 3600, 1800, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 6)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 7200, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.startrek.Episodes[0], td.startrek.Title, MediaType.Episode, latestTimePoint, 7200, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 7)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 9000, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, latestTimePoint, 9000, ['action']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 8)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 10800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.dune, "", MediaType.Movie, latestTimePoint, 10800, ['scifi']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 9)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 10800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.interstellar, "", MediaType.Movie, latestTimePoint, 10800, ['scifi']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 9)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.interstellar, td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 10800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, latestTimePoint, 9000, ['action']),
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint + 9000, 1800, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 9)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 10800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.startrek.Episodes[0], td.startrek.Title, MediaType.Episode, latestTimePoint, 7200, ['scifi', 'adventure']),
            new SelectedMedia(td.startrek.Episodes[1], td.startrek.Title, MediaType.Episode, latestTimePoint + 7200, 3600, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 10)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.interstellar, td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 18000, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, latestTimePoint, 9000, ['action']),
            new SelectedMedia(td.inception, "", MediaType.Movie, latestTimePoint + 9000, 9000, ['scifi']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 11)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.interstellar, td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 27000, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.matrix, "", MediaType.Movie, latestTimePoint, 9000, ['action']),
            new SelectedMedia(td.inception, "", MediaType.Movie, latestTimePoint + 9000, 9000, ['scifi']),
            new SelectedMedia(td.startrek.Episodes[0], td.startrek.Title, MediaType.Episode, latestTimePoint + 18000, 7200, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint + 25200, 1800, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 12)', () => {
        let stagedMedia = new StagedMedia([], [
            new SelectedMedia(td.inception, "", MediaType.Movie, 0, 9000, ['scifi']),
            new SelectedMedia(td.interstellar, "", MediaType.Movie, 0, 10800, ['scifi']),
        ], 0);
        let media = new Media(
            [td.reboot, td.farscape, td.startrek],
            [td.inception, td.matrix, td.interstellar, td.dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [td.interstellar, td.dune];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 27000, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(td.inception, "", MediaType.Movie, latestTimePoint, 9000, ['scifi']),
            new SelectedMedia(td.matrix, "", MediaType.Movie, latestTimePoint + 9000, 9000, ['action']),
            new SelectedMedia(td.startrek.Episodes[0], td.startrek.Title, MediaType.Episode, latestTimePoint + 18000, 7200, ['scifi', 'adventure']),
            new SelectedMedia(td.reboot.Episodes[1], td.reboot.Title, MediaType.Episode, latestTimePoint + 25200, 1800, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });
});