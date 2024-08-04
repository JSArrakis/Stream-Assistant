import * as proEng from '../src/services/proceduralEngine';
import * as proMan from '../src/services/progressionManager';
import { Movie } from '../src/models/movie';
import { ContStreamRequest } from '../src/models/streamRequest';
import { Episode, Show } from '../src/models/show';
import { StreamType } from '../src/models/enum/streamTypes';
import { ProgressionContext, WatchRecord } from '../src/models/progressionContext';
import { Stream } from 'stream';
import { StagedMedia } from '../src/models/stagedMedia';
import { Media } from '../src/models/media';
import { SelectedMedia } from '../src/models/selectedMedia';
import { MediaType } from '../src/models/enum/mediaTypes';

const inception = new Movie('Inception', 'inception', 'inception', 'tt1375666', ['scifi'], '/path/inception.mp4', 8880, 9000, '', 0);
const matrix = new Movie('The Matrix', 'thematrix', 'matrix', 'tt0133093', ['action'], '/path/matrix.mp4', 8160, 9000, '', 1);
const interstellar = new Movie('Interstellar', 'interstellar', 'interstellar', 'tt0816692', ['scifi'], '/path/interstellar.mp4', 10140, 10800, '', 0);
const dune = new Movie('Dune', 'dune', 'dune', 'tt1160419', ['scifi'], '/path/dune.mp4', 9120, 10800, '', 1);

const sailor = new Show('Sailor Moon', 'sailormoon', 'sailormoon', 'tt0103369', 1800, false, false, ['fantasy', 'action'], [], 5, [
    new Episode(1, 1, 1, '/path/sailormoon1.mp4', "A Moon Star is Born", "", 1448, 1800, []),
    new Episode(1, 2, 2, '/path/sailormoon2.mp4', "Punishment Awaits! The House of Fortune is the Monster Mansion", "", 1449, 1800, []),
    new Episode(1, 3, 3, '/path/sailormoon3.mp4', "Talk Radio", "", 1448, 1800, []),
    new Episode(1, 4, 4, '/path/sailormoon4.mp4', "Slim City", "", 1449, 1800, []),
    new Episode(1, 5, 5, '/path/sailormoon5.mp4', "So You Want to be a Superstar", "", 1447, 1800, [])
]);
const reboot = new Show('Reboot', 'reboot', 'reboot', 'tt0108903', 1800, false, false, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/reboot1.mp4', "The Tearing", "", 1353, 1800, []),
    new Episode(1, 2, 2, '/path/reboot2.mp4', "Racing the Clock", "", 1355, 1800, []),
    new Episode(1, 3, 3, '/path/reboot3.mp4', "Quick and the Fed", "", 1340, 1800, []),
    new Episode(1, 4, 4, '/path/reboot4.mp4', "Medusa Bug", "", 1354, 1800, []),
    new Episode(1, 5, 5, '/path/reboot5.mp4', "In the Belly of the Beast", "", 1353, 1800, [])
]);
const dragonballz = new Show('Dragon Ball Z', 'dragonballz', 'dragonballz', 'tt0214341', 1800, false, false, ['action', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/dragonballz1.mp4', "The New Threat", "", 1244, 1800, []),
    new Episode(1, 2, 2, '/path/dragonballz2.mp4', "Reunions", "", 1165, 1800, []),
    new Episode(1, 3, 3, '/path/dragonballz3.mp4', "Unlikely Alliance", "", 1188, 1800, []),
    new Episode(1, 4, 4, '/path/dragonballz4.mp4', "Piccolo's Plan", "", 1166, 1800, []),
    new Episode(1, 5, 5, '/path/dragonballz5.mp4', "Gohan's Rage", "", 1189, 1800, [])
]);
const gundam = new Show('Gundam Wing', 'gundamwing', 'gundamwing', 'tt0122816', 1800, false, false, ['scifi', 'action'], [], 5, [
    new Episode(1, 1, 1, '/path/gundamwing1.mp4', "The Shooting Star She Saw", "", 1437, 1800, []),
    new Episode(1, 2, 2, '/path/gundamwing2.mp4', "The Gundam Deathscythe", "", 1442, 1800, []),
    new Episode(1, 3, 3, '/path/gundamwing3.mp4', "Five Gundams Confirmed", "", 1441, 1800, []),
    new Episode(1, 4, 4, '/path/gundamwing4.mp4', "The Victoria Nightmare", "", 1442, 1800, []),
    new Episode(1, 5, 5, '/path/gundamwing5.mp4', "Relena's Secret", "", 1442, 1800, [])
]);
const tenchi = new Show('Tenchi Muyo', 'tenchimuyo', 'tenchimuyo', 'tt0108921', 1800, true, false, ['scifi', 'comedy'], [], 5, [
    new Episode(1, 4, 1, '/path/tenchimuyo1.mp4', "Mihoshi Falls to the Land of Stars", "", 1778, 1800, []),
    new Episode(1, 5, 2, '/path/tenchimuyo2.mp4', "Kagato Attacks!", "", 1779, 1800, []),
    new Episode(1, 6, 3, '/path/tenchimuyo3.mp4', "We Need Tenchi", "", 1750, 1800, []),
    new Episode(1, 7, 4, '/path/tenchimuyo4.mp4', "The Night Before the Carnival", "", 2590, 3600, []),
    new Episode(2, 1, 5, '/path/tenchimuyo5.mp4', "Hello Baby!", "", 1721, 1800, [])
]);
const batman = new Show('Batman: The Animated Series', 'batmantheanimatedseries', 'batman', 'tt0103359', 1800, false, false, ['action', 'drama'], [], 5, [
    new Episode(1, 1, 1, '/path/batman1.mp4', "On Leather Wings", "", 1341, 1800, []),
    new Episode(1, 2, 2, '/path/batman2.mp4', "Christmas with the Joker", "", 1342, 1800, []),
    new Episode(1, 3, 3, '/path/batman3.mp4', "Nothing to Fear", "", 1345, 1800, []),
    new Episode(1, 4, 4, '/path/batman4.mp4', "The Last Laugh", "", 1338, 1800, []),
    new Episode(1, 5, 5, '/path/batman5.mp4', "Pretty Poison", "", 1340, 1800, [])
]);
const startrek = new Show('Star Trek: The Next Generation', 'startrekthenextgeneration', 'startrek', 'tt0092455', 3600, true, true, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/startrek1.mp4', "Encounter at Farpoint", "", 5484, 3600, []),
    new Episode(1, 2, 2, '/path/startrek2.mp4', "The Naked Now", "", 2763, 3600, []),
    new Episode(1, 3, 3, '/path/startrek3.mp4', "Code of Honor", "", 2763, 3600, []),
    new Episode(1, 4, 4, '/path/startrek4.mp4', "The Last Outpost", "", 2763, 3600, []),
    new Episode(1, 5, 5, '/path/startrek5.mp4', "Where No One Has Gone Before", "", 2756, 3600, [])
]);

const farscape = new Show('Farscape', 'farscape', 'farscape', 'tt0187636', 3600, false, false, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/farscape1.mp4', "Premiere", "", 2921, 3600, []),
    new Episode(1, 2, 2, '/path/farscape2.mp4', "I, E.T.", "", 2887, 3600, []),
    new Episode(1, 3, 3, '/path/farscape3.mp4', "Exodus from Genesis", "", 2976, 3600, []),
    new Episode(1, 4, 4, '/path/farscape5.mp4', "Back and Back and Back to the Future", "", 2887, 3600, []),
    new Episode(1, 5, 5, '/path/farscape4.mp4', "Throne for a Loss", "", 2888, 3600, [])

]);

const sailorWatchRecord = new WatchRecord('Sailor Moon', 'sailormoon', 0, 0, 1800);
const rebootWatchRecord = new WatchRecord('Reboot', 'reboot', 1, 0, 1800);
const gundamWatchRecord = new WatchRecord('Gundam Wing', 'gundamwing', 3, 0, 1800);
const tenchiWatchRecord = new WatchRecord('Tenchi Muyo', 'tenchimuyo', 2, 0, 1800);
const batmanWatchRecord = new WatchRecord('Batman: The Animated Series', 'batmantheanimatedseries', 5, 0, 1800);
const startrekWatchRecord = new WatchRecord('Star Trek: The Next Generation', 'startrekthenextgeneration', 0, 0, 7200);

const continuousProgression = new ProgressionContext('Continuous', 'continuous', 'Test', 0, [
    sailorWatchRecord,
    rebootWatchRecord,
    gundamWatchRecord,
    tenchiWatchRecord,
    batmanWatchRecord,
    startrekWatchRecord
]);

describe('isMovieSelected', () => {
    it('should return true if the movie is in the list of previous movies', () => {
        let prevMovies: Movie[] = [inception, matrix, interstellar];

        let result = proEng.isMovieSelected(inception, prevMovies);

        expect(result).toBeTrue;
    });

    it('should return false if the movie is not in the list of previous movies', () => {
        let prevMovies: Movie[] = [inception, matrix];

        let result = proEng.isMovieSelected(interstellar, prevMovies);

        expect(result).toBeFalse;
    });
});

describe('selectMovieUnderDuration', () => {
    it('should return a movie that is under the duration limit that has the tags in the request object', () => {
        let movies: Movie[] = [inception, matrix, interstellar, dune];
        let prevMovies: Movie[] = [];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi']);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);


        expect(result).toEqual(inception);
    });

    it('should return a movie that is under the duration limit that has the tags in the request object and has not been selected before', () => {
        let movies: Movie[] = [inception, matrix, interstellar, dune];
        let prevMovies: Movie[] = [inception, matrix, dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 10800);

        expect(result).toEqual(interstellar);
    });

    it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 1)', () => {
        let movies: Movie[] = [inception, matrix, interstellar, dune];
        let prevMovies: Movie[] = [inception, matrix, interstellar, dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.4);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);

        expect(result).toEqual(inception)

        randomSpy.mockRestore();
    });

    it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 2)', () => {
        let movies: Movie[] = [inception, matrix, interstellar, dune];
        let prevMovies: Movie[] = [inception, matrix, interstellar, dune];
        let args: ContStreamRequest = new ContStreamRequest('password', 'title', 'env', [], ['scifi', 'action']);
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

        let result = proEng.selectMovieUnderDuration(args, movies, prevMovies, 9000);

        expect(result).toEqual(matrix)

        randomSpy.mockRestore();
    });
});

describe('selectShowByDuration', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', continuousProgression.Title, continuousProgression.Environment);

    it('should return a show that is under the duration limit (result scenario 1)', () => {
        let shows: Show[] = [reboot, startrek, farscape];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 1800, shows, StreamType.Cont);

        expect(selectedShow).toEqual(reboot)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 2)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(farscape)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 3)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(startrek)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 4)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [farscape, reboot, dragonballz, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [farscape, dragonballz, reboot, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 7200, shows, StreamType.Cont);

        expect(selectedShow).toEqual(dragonballz)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 6)', () => {
        let shows: Show[] = [farscape, tenchi, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 1800, shows, StreamType.Cont);

        expect(selectedShow).toEqual(tenchi)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 7)', () => {
        let shows: Show[] = [farscape, tenchi, reboot, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(reboot)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 8)', () => {
        let shows: Show[] = [farscape, tenchi, reboot];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        proMan.IncrementWatchRecord(continuousProgression.LoadTitle, tenchiWatchRecord.LoadTitle, 3, tenchi);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(tenchi)
        expect(numberOfEpisodes).toEqual(1)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 8)', () => {
        let shows: Show[] = [farscape, batman];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(batman)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });

    it('should return a show that is under the duration limit (result scenario 9)', () => {
        let shows: Show[] = [farscape, batman];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        proMan.IncrementWatchRecord(continuousProgression.LoadTitle, batmanWatchRecord.LoadTitle, 4, batman);
        let [selectedShow, numberOfEpisodes] = proEng.selectShowByDuration(args, 3600, shows, StreamType.Cont);

        expect(selectedShow).toEqual(batman)
        expect(numberOfEpisodes).toEqual(2)
        randomSpy.mockRestore();
    });
});

describe('getEpisodesUnderDuration', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', continuousProgression.Title, continuousProgression.Environment, [], ['scifi', 'action']);

    it('should return an array of episodes that are under the duration limit (result scenario 1)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 1800, StreamType.Cont);

        expect(episodes).toEqual([reboot.Episodes[1]]);
        expect(showTitle).toEqual(reboot.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 2)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([reboot.Episodes[1], reboot.Episodes[2]]);
        expect(showTitle).toEqual(reboot.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 3)', () => {
        let shows: Show[] = [batman, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([batman.Episodes[0], batman.Episodes[1]]);
        expect(showTitle).toEqual(batman.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 4)', () => {
        let shows: Show[] = [batman, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
        proMan.IncrementWatchRecord(continuousProgression.LoadTitle, batmanWatchRecord.LoadTitle, 4, batman);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([batman.Episodes[4], batman.Episodes[0]]);
        expect(showTitle).toEqual(batman.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 5)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 3600, StreamType.Cont);

        expect(episodes).toEqual([farscape.Episodes[0]]);
        expect(showTitle).toEqual(farscape.Title);
        randomSpy.mockRestore();
    });

    it('should return an array of episodes that are under the duration limit (result scenario 6)', () => {
        let shows: Show[] = [reboot, farscape, startrek];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let [episodes, showTitle] = proEng.getEpisodesUnderDuration(args, shows, 7200, StreamType.Cont);

        expect(episodes).toEqual([startrek.Episodes[0]]);
        expect(showTitle).toEqual(startrek.Title);
        randomSpy.mockRestore();
    });
});

describe('getProceduralBlock', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    const args = new ContStreamRequest('securePassword', continuousProgression.Title, continuousProgression.Environment, [], ['scifi', 'action']);

    it('should fill the procedural block with available media (scenario 1)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [reboot, farscape, startrek],
            [inception, matrix, interstellar, dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 1800, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(reboot.Episodes[1], reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 2)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [reboot, farscape, startrek],
            [inception, matrix, interstellar, dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 3600, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(farscape.Episodes[0], farscape.Title, MediaType.Episode, latestTimePoint, 3600, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 3)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [reboot, farscape, startrek],
            [inception, matrix, interstellar, dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 3600, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(reboot.Episodes[1], reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure']),
            new SelectedMedia(reboot.Episodes[2], reboot.Title, MediaType.Episode, latestTimePoint + 1800, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 4)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [reboot, farscape, startrek],
            [inception, matrix, interstellar, dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 5400, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(farscape.Episodes[0], farscape.Title, MediaType.Episode, latestTimePoint, 3600, ['scifi', 'adventure']),
            new SelectedMedia(reboot.Episodes[1], reboot.Title, MediaType.Episode, latestTimePoint + 3600, 1800, ['scifi', 'adventure'])
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    it('should fill the procedural block with available media (scenario 5)', () => {
        let stagedMedia = new StagedMedia([], [], 0);
        let media = new Media(
            [reboot, farscape, startrek],
            [inception, matrix, interstellar, dune],
            [], [], [], [], []
        );
        let prevMovies: Movie[] = [];
        let latestTimePoint = 1722816000;
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

        let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 5400, latestTimePoint, StreamType.Cont);

        let expected: SelectedMedia[] = [
            new SelectedMedia(reboot.Episodes[1], reboot.Title, MediaType.Episode, latestTimePoint, 1800, ['scifi', 'adventure']),
            new SelectedMedia(reboot.Episodes[2], reboot.Title, MediaType.Episode, latestTimePoint + 1800, 1800, ['scifi', 'adventure']),
            new SelectedMedia(reboot.Episodes[3], reboot.Title, MediaType.Episode, latestTimePoint + 3600, 1800, ['scifi', 'adventure']),
        ];

        expect(proceduralBlock).toEqual(expected);
        randomSpy.mockRestore();
    });

    // it('should fill the procedural block with available media (scenario 6)', () => {
    //     let stagedMedia = new StagedMedia([], [], 0);
    //     let media = new Media(
    //         [reboot, farscape, startrek],
    //         [inception, matrix, interstellar, dune],
    //         [], [], [], [], []
    //     );
    //     let prevMovies: Movie[] = [];
    //     let latestTimePoint = 1722816000;
    //     const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

    //     let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 7200, latestTimePoint, StreamType.Cont);

    //     let expected: SelectedMedia[] = [
    //         new SelectedMedia(startrek.Episodes[0], startrek.Title, MediaType.Episode, latestTimePoint, 7200, ['scifi', 'adventure']),
    //     ];

    //     expect(proceduralBlock).toEqual(expected);
    //     randomSpy.mockRestore();
    // });

    // it('should fill the procedural block with available media (scenario 7)', () => {
    //     let stagedMedia = new StagedMedia([], [], 0);
    //     let media = new Media(
    //         [reboot, farscape, startrek],
    //         [inception, matrix, interstellar, dune],
    //         [], [], [], [], []
    //     );
    //     let prevMovies: Movie[] = [];
    //     let latestTimePoint = 1722816000;
    //     const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);

    //     let proceduralBlock = proEng.getProceduralBlock(args, stagedMedia, media, prevMovies, 5400, latestTimePoint, StreamType.Cont);

    //     let expected: SelectedMedia[] = [
    //     ];

    //     expect(proceduralBlock).toEqual(expected);
    //     randomSpy.mockRestore();
    // });
});