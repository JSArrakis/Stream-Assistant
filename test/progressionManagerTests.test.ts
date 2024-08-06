import { StreamType } from '../src/models/enum/streamTypes';
import { ProgressionContext, WatchRecord } from '../src/models/progressionContext';
import * as proMan from '../src/services/progressionManager';
import { ContStreamRequest } from '../src/models/streamRequest';
import * as td from './data/testData';

describe('GetProgressionContext', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    it('should return a new progression context if one does not exist', () => {
        let progressionContext = proMan.GetProgressionContext('Test', 'test', 'test', StreamType.Cont);

        let expectedProgressionContext = new ProgressionContext('Test', 'test', 'test', StreamType.Cont, []);

        expect(progressionContext).toEqual(expectedProgressionContext);
    });

    it('should return an existing progression context if one exists', () => {
        let mediaProgression = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);

        expect(mediaProgression).toEqual(td.continuousProgression);
    });
});

describe('GetEpisodeDurLimit', () => {
    it('should return 0 if the episode is not found', () => {
        let durationLimit = proMan.GetEpisodeDurLimit(td.sailor, 6);

        expect(durationLimit).toEqual(0);
    });

    it('should return the correct duration limit for the episode requested (scenario 1)', () => {
        let durationLimit = proMan.GetEpisodeDurLimit(td.sailor, 1);

        expect(durationLimit).toEqual(1800);
    });

    it('should return the correct duration limit for the episode requested (scenario 2)', () => {
        let durationLimit = proMan.GetEpisodeDurLimit(td.sailor, 3);

        expect(durationLimit).toEqual(1800);
    });

    it('should return the correct duration limit for the episode requested (scenario 2)', () => {
        let durationLimit = proMan.GetEpisodeDurLimit(td.startrek, 1);

        expect(durationLimit).toEqual(7200);
    });
});

describe('GetShowListWatchRecords', () => {
    const args = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment);

    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    it('should return a list of watch records for the show list (scenario 1)', () => {
        let watchRecords = proMan.GetShowListWatchRecords(args, [td.sailor, td.reboot, td.gundam, td.tenchi, td.batman, td.startrek], StreamType.Cont);

        expect(watchRecords).toEqual([td.sailorWatchRecord, td.rebootWatchRecord, td.gundamWatchRecord, td.tenchiWatchRecord, td.batmanWatchRecord, td.startrekWatchRecord]);
    });

    it('should return a list of watch records for the show list (scenario 2)', () => {
        let watchRecords = proMan.GetShowListWatchRecords(args, [td.startrek, td.sailor], StreamType.Cont);

        expect(watchRecords).toEqual([td.startrekWatchRecord, td.sailorWatchRecord]);
    });

    it('should return a list of watch records for the show list (scenario 3)', () => {
        const dragonballzWatchRecord = new WatchRecord('Dragon Ball Z', 'dragonballz', 0, 0, 1800);
        let watchRecords = proMan.GetShowListWatchRecords(args, [td.dragonballz, td.gundam], StreamType.Cont);

        expect(watchRecords).toEqual([dragonballzWatchRecord, td.gundamWatchRecord]);
    });
});

describe('GetWatchRecord', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    it('should return a new watch record if one does not exist', () => {
        let watchRecord = proMan.GetWatchRecord(td.continuousProgression, td.dragonballz);
        let expectedWatchRecord = new WatchRecord(td.dragonballz.Title, td.dragonballz.LoadTitle, 0, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
    });

    it('should return an existing watch record if one exists', () => {
        let watchRecord = proMan.GetWatchRecord(td.continuousProgression, td.sailor);

        expect(watchRecord).toEqual(td.sailorWatchRecord);
    });
});

describe('IncrementWatchRecord', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });
    it('should increment the watch record episode by 1', () => {
        proMan.IncrementWatchRecord(td.continuousProgression.LoadTitle, td.sailorWatchRecord.LoadTitle, 1, td.sailor);
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);

        expect(watchRecord.Episode).toEqual(1);
    });
});

describe('GetEpisodeNumbers', () => {
    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    it('should return the first episode for a show that has not been watched before with one episode requested', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.sailor, watchRecord, 1);
        expect(episodes).toEqual([1]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.sailor, watchRecord, 3);

        expect(episodes).toEqual([1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.sailor, watchRecord, 6);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1]);
    });

    it('should return the correct number of episodes for a show that has not been watched (scenario 3)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.sailor, watchRecord, 12);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });

    it('should return one episode for a show that has been watched before with one episode requested', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.reboot);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.reboot, watchRecord, 1);

        expect(episodes).toEqual([2]);
    });

    it('should return the correct number of episodes for a show that has been watched (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.reboot);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.reboot, watchRecord, 2);

        expect(episodes).toEqual([2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.reboot);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.reboot, watchRecord, 12);

        expect(episodes).toEqual([2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 1)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.batman);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.batman, watchRecord, 1);

        expect(episodes).toEqual([1]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 2)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.batman);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.batman, watchRecord, 3);

        expect(episodes).toEqual([1, 2, 3]);
    });

    it('should return the correct number of episodes for a show that has been watched completely (scenario 3)', () => {
        let contProg = proMan.GetProgressionContext(td.continuousProgression.Title, td.continuousProgression.LoadTitle, td.continuousProgression.Environment, StreamType.Cont);
        let watchRecord = proMan.GetWatchRecord(contProg, td.batman);
        let episodes = proMan.GetEpisodeNumbers(contProg.LoadTitle, td.batman, watchRecord, 12);

        expect(episodes).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });
});

describe('ManageShowProgression', () => {
    const contStreamRequest = new ContStreamRequest('securePassword', td.continuousProgression.Title, td.continuousProgression.Environment)

    beforeEach(() => {
        proMan.SetLocalProgressionContextList(
            JSON.parse(JSON.stringify([td.continuousProgression]))
        );
    });

    it('should increment correct watch record episode by the number request (scenario 1)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.sailor, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let expectedWatchRecord = new WatchRecord(td.sailor.Title, td.sailor.LoadTitle, 1, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1]);
    });

    it('should increment correct watch record episode by the number request (scenario 2)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.sailor, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.sailor);
        let expectedWatchRecord = new WatchRecord(td.sailor.Title, td.sailor.LoadTitle, 2, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });

    it('should increment correct watch record episode by the number request (scenario 3)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.reboot, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.reboot);
        let expectedWatchRecord = new WatchRecord(td.reboot.Title, td.reboot.LoadTitle, 2, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([2]);
    });

    it('should increment correct watch record episode by the number request (scenario 4)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.reboot, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.reboot);
        let expectedWatchRecord = new WatchRecord(td.reboot.Title, td.reboot.LoadTitle, 3, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3]);
    });

    it('should increment correct watch record episode by the number request (scenario 5)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.batman, 1, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.batman);
        let expectedWatchRecord = new WatchRecord(td.batman.Title, td.batman.LoadTitle, 1, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1]);
    });

    it('should increment correct watch record episode by the number request (scenario 6)', () => {
        let episodeNumbers = proMan.ManageShowProgression(td.batman, 12, contStreamRequest, StreamType.Cont);
        let contProg = proMan.GetProgressionContext(
            td.continuousProgression.Title,
            td.continuousProgression.LoadTitle,
            td.continuousProgression.Environment,
            td.continuousProgression.Type
        );
        let watchRecord = proMan.GetWatchRecord(contProg, td.batman);
        let expectedWatchRecord = new WatchRecord(td.batman.Title, td.batman.LoadTitle, 2, 0, 1800);

        expect(watchRecord).toEqual(expectedWatchRecord);
        expect(episodeNumbers).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]);
    });
});