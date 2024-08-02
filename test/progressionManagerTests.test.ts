import { after } from 'node:test';
import { StreamType } from '../src/models/enum/streamTypes';
import { ProgressionContext, WatchRecord } from '../src/models/progressionContext';
import * as proMan from '../src/services/progressionManager';
import { Episode, Show } from '../src/models/show';
import { watch } from 'node:fs';
import { ContStreamRequest } from '../src/models/streamRequest';

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
    new Episode(1, 1, 1, '/path/tenchimuyo1.mp4', "Ryoko Resurrected", "", 1729, 1800, []),
    new Episode(1, 2, 2, '/path/tenchimuyo2.mp4', "Here Comes Ayeka!", "", 1784, 1800, []),
    new Episode(1, 3, 3, '/path/tenchimuyo3.mp4', "Hello Ryo-ohki!", "", 1779, 1800, []),
    new Episode(1, 4, 4, '/path/tenchimuyo4.mp4', "Mihoshi Falls to the Land of Stars", "", 1778, 1800, []),
    new Episode(1, 5, 5, '/path/tenchimuyo5.mp4', "Kagato Attacks!", "", 1779, 1800, [])
]);
const batman = new Show('Batman: The Animated Series', 'batmantheanimatedseries', 'batman', 'tt0103359', 1800, false, false, ['action', 'drama'], [], 5, [
    new Episode(1, 1, 1, '/path/batman1.mp4', "On Leather Wings", "", 1341, 1800, []),
    new Episode(1, 2, 2, '/path/batman2.mp4', "Christmas with the Joker", "", 1342, 1800, []),
    new Episode(1, 3, 3, '/path/batman3.mp4', "Nothing to Fear", "", 1345, 1800, []),
    new Episode(1, 4, 4, '/path/batman4.mp4', "The Last Laugh", "", 1338, 1800, []),
    new Episode(1, 5, 5, '/path/batman5.mp4', "Pretty Poison", "", 1340, 1800, [])
]);
const startrek = new Show('Star Trek: The Next Generation', 'startrek', 'startrek', 'tt0092455', 3600, true, true, ['scifi', 'adventure'], [], 5, [
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

const sailorWatchRecord = new WatchRecord('Sailor Moon', 'sailormoon', 0, 0);
const rebootWatchRecord = new WatchRecord('Reboot', 'reboot', 1, 0);
const gundamWatchRecord = new WatchRecord('Gundam Wing', 'gundamwing', 3, 0);
const tenchiWatchRecord = new WatchRecord('Tenchi Muyo', 'tenchimuyo', 4, 0);
const batmanWatchRecord = new WatchRecord('Batman: The Animated Series', 'batmantheanimatedseries', 5, 0);
const startrekWatchRecord = new WatchRecord('Star Trek: The Next Generation', 'startrekthenextgeneration', 0, 0);

const continuousProgression = new ProgressionContext('Continuous', 'continuous', 'Test', 0, [
    sailorWatchRecord,
    rebootWatchRecord,
    gundamWatchRecord,
    tenchiWatchRecord,
    batmanWatchRecord,
    startrekWatchRecord
]);

describe('GetProgressionContext', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    it('should return a new progression context if one does not exist', () => {
        let progressionContext = proMan.GetProgressionContext('Test', 'test', 'test', StreamType.Cont);

        let expectedProgressionContext = new ProgressionContext('Test', 'test', 'test', StreamType.Cont, []);

        expect(progressionContext).toEqual(expectedProgressionContext);
    });

    it('should return an existing progression context if one exists', () => {
        let mediaProgression = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);

        expect(mediaProgression).toEqual(continuousProgression);
    });
});


describe('GetWatchRecord', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    it('should return a new watch record if one does not exist', () => {
        let watchRecord = proMan.GetWatchRecord(continuousProgression, 'Test');
        let expectedWatchRecord = new WatchRecord('Test', 'test', 0, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
    });

    it('should return an existing watch record if one exists', () => {
        let watchRecord = proMan.GetWatchRecord(continuousProgression, sailor.Title);

        expect(watchRecord).toEqual(sailorWatchRecord);
    });
});

describe('IncrementWatchRecord', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });
    it('should increment the watch record episode by 1', () => {
        proMan.IncrementWatchRecord(continuousProgression.LoadTitle, sailorWatchRecord.LoadTitle, 1);
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);

        expect(watchRecord.Episode).toEqual(1);
    });
});

describe('GetEpisodeNumbers', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    it('should return the first episode for a show that has not been watched before with one episode requested', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, sailor, watchRecord, 1);
        expect(episodes).toEqual([1]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, sailor, watchRecord, 3);

        expect(episodes).toEqual([1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, sailor, watchRecord, 6);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 3)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, sailor, watchRecord, 12);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });

    it('should return one episode for a show that has been watched before with one episode requested', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, reboot.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, reboot, watchRecord, 1);

        expect(episodes).toEqual([2]);
    });

    it('should return the correct number of episodes for a show that has been watched (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, reboot.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, reboot, watchRecord, 2);

        expect(episodes).toEqual([2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, reboot.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, reboot, watchRecord, 12);

        expect(episodes).toEqual([2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, batman.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, batman, watchRecord, 1);

        expect(episodes).toEqual([1]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, batman.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, batman, watchRecord, 3);

        expect(episodes).toEqual([1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 3)', () => {
        let contProg = proMan.GetProgressionContext(continuousProgression.Title, continuousProgression.LoadTitle, continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, batman.Title);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, batman, watchRecord, 12);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });
});

describe('ManageShowProgression', () => {
    const contStreamRequest = new ContStreamRequest('securePassword', continuousProgression.Title, continuousProgression.Environment)

    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([continuousProgression]))
        );
    });

    it('should increment correct watch record episode by the number request (scenario 1)', () => {
        let episodeNumbers = proMan.ManageShowProgression(sailor, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let expectedWatchRecord = new WatchRecord(sailor.Title, sailor.LoadTitle, 1, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1]);
    });

    it('should increment correct watch record episode by the number request (scenario 2)', () => {
        let episodeNumbers = proMan.ManageShowProgression(sailor, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, sailor.Title);
        let expectedWatchRecord = new WatchRecord(sailor.Title, sailor.LoadTitle, 2, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });

    it('should increment correct watch record episode by the number request (scenario 3)', () => {
        let episodeNumbers = proMan.ManageShowProgression(reboot, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, reboot.Title);
        let expectedWatchRecord = new WatchRecord(reboot.Title, reboot.LoadTitle, 2, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([2]);
    });

    it('should increment correct watch record episode by the number request (scenario 4)', () => {
        let episodeNumbers = proMan.ManageShowProgression(reboot, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, reboot.Title);
        let expectedWatchRecord = new WatchRecord(reboot.Title, reboot.LoadTitle, 3, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3]);
    });

    it('should increment correct watch record episode by the number request (scenario 5)', () => {
        let episodeNumbers = proMan.ManageShowProgression(batman, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, batman.Title);
        let expectedWatchRecord = new WatchRecord(batman.Title, batman.LoadTitle, 1, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1]);
    });

    it('should increment correct watch record episode by the number request (scenario 6)', () => {
        let episodeNumbers = proMan.ManageShowProgression(batman, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            continuousProgression.Title,
            continuousProgression.LoadTitle,
            continuousProgression.Environment,
            continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, batman.Title);
        let expectedWatchRecord = new WatchRecord(batman.Title, batman.LoadTitle, 2, 0);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });
});