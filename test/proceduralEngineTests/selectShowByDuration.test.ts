import * as proEng from '../../src/services/proceduralEngine';
import * as proMan from '../../src/services/progressionManager';
import { ContStreamRequest } from '../../src/models/streamRequest';
import { Show } from '../../src/models/show';
import { StreamType } from '../../src/models/enum/streamTypes';
import * as td from '../testData/testData';

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