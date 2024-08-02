import * as proEng from '../src/services/proceduralEngine';
import { Movie } from '../src/models/movie';
import { ContStreamRequest } from '../src/models/streamRequest';
import { Episode, Show } from '../src/models/show';

const inception = new Movie('Inception', 'inception', 'inception', 'tt1375666', ['scifi'], '/path/inception.mp4', 8880, 9000, '', 0);
const matrix = new Movie('The Matrix', 'thematrix', 'matrix', 'tt0133093', ['action'], '/path/matrix.mp4', 8160, 9000, '', 1);
const interstellar = new Movie('Interstellar', 'interstellar', 'interstellar', 'tt0816692', ['scifi'], '/path/interstellar.mp4', 10140, 10800, '', 0);
const dune = new Movie('Dune', 'dune', 'dune', 'tt1160419', ['scifi'], '/path/dune.mp4', 9120, 10800, '', 1);

const sailor = new Show('Sailor Moon', 'sailormoon', 'sailormoon', 'tt0103369', 1800, false, false, ['fantasy', 'action'], [], 0, [
    new Episode(1, 1, 1, '/path/sailormoon1.mp4', "A Moon Star is Born", "", 1448, 1800, []),
    new Episode(1, 2, 2, '/path/sailormoon2.mp4', "Punishment Awaits! The House of Fortune is the Monster Mansion", "", 1449, 1800, []),
    new Episode(1, 3, 3, '/path/sailormoon3.mp4', "Talk Radio", "", 1448, 1800, []),
    new Episode(1, 4, 4, '/path/sailormoon4.mp4', "Slim City", "", 1449, 1800, []),
    new Episode(1, 5, 5, '/path/sailormoon5.mp4', "So You Want to be a Superstar", "", 1447, 1800, [])
]);
const reboot = new Show('Reboot', 'reboot', 'reboot', 'tt0108903', 1800, false, false, ['scifi', 'adventure'], [], 0, [
    new Episode(1, 1, 1, '/path/reboot1.mp4', "The Tearing", "", 1353, 1800, []),
    new Episode(1, 2, 2, '/path/reboot2.mp4', "Racing the Clock", "", 1355, 1800, []),
    new Episode(1, 3, 3, '/path/reboot3.mp4', "Quick and the Fed", "", 1340, 1800, []),
    new Episode(1, 4, 4, '/path/reboot4.mp4', "Medusa Bug", "", 1354, 1800, []),
    new Episode(1, 5, 5, '/path/reboot5.mp4', "In the Belly of the Beast", "", 1353, 1800, [])
]);
const dragonballz = new Show('Dragon Ball Z', 'dragonballz', 'dragonballz', 'tt0214341', 1800, false, false, ['action', 'adventure'], [], 0, [
    new Episode(1, 1, 1, '/path/dragonballz1.mp4', "The New Threat", "", 1244, 1800, []),
    new Episode(1, 2, 2, '/path/dragonballz2.mp4', "Reunions", "", 1165, 1800, []),
    new Episode(1, 3, 3, '/path/dragonballz3.mp4', "Unlikely Alliance", "", 1188, 1800, []),
    new Episode(1, 4, 4, '/path/dragonballz4.mp4', "Piccolo's Plan", "", 1166, 1800, []),
    new Episode(1, 5, 5, '/path/dragonballz5.mp4', "Gohan's Rage", "", 1189, 1800, [])
]);
const gundam = new Show('Gundam Wing', 'gundamwing', 'gundamwing', 'tt0122816', 1800, false, false, ['scifi', 'action'], [], 0, [
    new Episode(1, 1, 1, '/path/gundamwing1.mp4', "The Shooting Star She Saw", "", 1437, 1800, []),
    new Episode(1, 2, 2, '/path/gundamwing2.mp4', "The Gundam Deathscythe", "", 1442, 1800, []),
    new Episode(1, 3, 3, '/path/gundamwing3.mp4', "Five Gundams Confirmed", "", 1441, 1800, []),
    new Episode(1, 4, 4, '/path/gundamwing4.mp4', "The Victoria Nightmare", "", 1442, 1800, []),
    new Episode(1, 5, 5, '/path/gundamwing5.mp4', "Relena's Secret", "", 1442, 1800, [])
]);
const tenchi = new Show('Tenchi Muyo', 'tenchimuyo', 'tenchimuyo', 'tt0108921', 1800, true, false, ['scifi', 'comedy'], [], 0, [
    new Episode(1, 1, 1, '/path/tenchimuyo1.mp4', "Ryoko Resurrected", "", 1729, 1800, []),
    new Episode(1, 2, 2, '/path/tenchimuyo2.mp4', "Here Comes Ayeka!", "", 1784, 1800, []),
    new Episode(1, 3, 3, '/path/tenchimuyo3.mp4', "Hello Ryo-ohki!", "", 1779, 1800, []),
    new Episode(1, 4, 4, '/path/tenchimuyo4.mp4', "Mihoshi Falls to the Land of Stars", "", 1778, 1800, []),
    new Episode(1, 5, 5, '/path/tenchimuyo5.mp4', "Kagato Attacks!", "", 1779, 1800, [])
]);
const batman = new Show('Batman: The Animated Series', 'batman', 'batman', 'tt0103359', 1800, false, false, ['action', 'drama'], [], 0, [
    new Episode(1, 1, 1, '/path/batman1.mp4', "On Leather Wings", "", 1341, 1800, []),
    new Episode(1, 2, 2, '/path/batman2.mp4', "Christmas with the Joker", "", 1342, 1800, []),
    new Episode(1, 3, 3, '/path/batman3.mp4', "Nothing to Fear", "", 1345, 1800, []),
    new Episode(1, 4, 4, '/path/batman4.mp4', "The Last Laugh", "", 1338, 1800, []),
    new Episode(1, 5, 5, '/path/batman5.mp4', "Pretty Poison", "", 1340, 1800, [])
]);
const startrek = new Show('Star Trek: The Next Generation', 'startrek', 'startrek', 'tt0092455', 3600, true, true, ['scifi', 'adventure'], [], 0, [
    new Episode(1, 1, 1, '/path/startrek1.mp4', "Encounter at Farpoint", "", 5484, 3600, []),
    new Episode(1, 2, 2, '/path/startrek2.mp4', "The Naked Now", "", 2763, 3600, []),
    new Episode(1, 3, 3, '/path/startrek3.mp4', "Code of Honor", "", 2763, 3600, []),
    new Episode(1, 4, 4, '/path/startrek4.mp4', "The Last Outpost", "", 2763, 3600, []),
    new Episode(1, 5, 5, '/path/startrek5.mp4', "Where No One Has Gone Before", "", 2756, 3600, [])
]);

const farscape = new Show('Farscape', 'farscape', 'farscape', 'tt0187636', 3600, false, false, ['scifi', 'adventure'], [], 0, [
    new Episode(1, 1, 1, '/path/farscape1.mp4', "Premiere", "", 2921, 3600, []),
    new Episode(1, 2, 2, '/path/farscape2.mp4', "I, E.T.", "", 2887, 3600, []),
    new Episode(1, 3, 3, '/path/farscape3.mp4', "Exodus from Genesis", "", 2976, 3600, []),
    new Episode(1, 4, 4, '/path/farscape5.mp4', "Back and Back and Back to the Future", "", 2887, 3600, []),
    new Episode(1, 5, 5, '/path/farscape4.mp4', "Throne for a Loss", "", 2888, 3600, [])

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
    it('should return a show that is under the duration limit (result scenario 1)', () => {
        let shows: Show[] = [reboot, startrek, farscape];
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);

        let result = proEng.selectShowByDuration(1800, shows);

        expect(result).toEqual(reboot)
        randomSpy.mockRestore();
    });

    // it('should return a show that is under the duration limit (result scenario 2)', () => {
    //     let shows: Show[] = [reboot, startrek, farscape];
    //     const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    //     let result = proEng.selectShowByDuration(3600, shows);

    //     expect(result).toEqual(farscape)
    //     randomSpy.mockRestore();
    // });
});

// describe('getProceduralBlock', () => {
// });