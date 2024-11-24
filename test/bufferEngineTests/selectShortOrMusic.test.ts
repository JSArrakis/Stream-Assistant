import { Music } from "../../src/models/music";
import { Short } from "../../src/models/short";
import * as buffEng from "../../src/services/bufferEngine";
import * as td from "../testData/testData";

describe('selectShortOrMusic', () => {
    it('get short from first 10 or less (scenario 1)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const shorts: Short[] = [];
        const music: Music[] = [];
        const duration: number = 0;
        const usedShorts: Short[] = [];
        const usedMusic: Music[] = [];

        const expectedShort = null;

        const result = buffEng.selectShortOrMusic(shorts, music, duration, usedShorts, usedMusic) as Short | null;

        expect(result).toEqual(expectedShort);

        randomSpy.mockRestore();
    });
    it('get short from first 10 or less (scenario 2)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const shorts: Short[] = td.shorts;
        const music: Music[] = td.music;
        const duration: number = 0;
        const usedShorts: Short[] = [];
        const usedMusic: Music[] = [];

        const expectedShort = null;

        const result = buffEng.selectShortOrMusic(shorts, music, duration, usedShorts, usedMusic) as Short | null;

        expect(result).toEqual(expectedShort);

        randomSpy.mockRestore();
    });
    it('get short from first 10 or less (scenario 3)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const shorts: Short[] = td.shorts;
        const music: Music[] = td.music;
        const duration: number = 600;
        const usedShorts: Short[] = [];
        const usedMusic: Music[] = [];

        const expectedShort = td.painkiller;

        const result = buffEng.selectShortOrMusic(shorts, music, duration, usedShorts, usedMusic) as Short | Music | null;

        expect(result).toEqual(expectedShort);

        randomSpy.mockRestore();
    });
    it('get short from first 10 or less (scenario 4)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.4);
        const shorts: Short[] = td.shorts;
        const music: Music[] = td.music;
        const duration: number = 600;
        const usedShorts: Short[] = [];
        const usedMusic: Music[] = [];

        const expectedShort = td.cargo;

        const result = buffEng.selectShortOrMusic(shorts, music, duration, usedShorts, usedMusic) as Short | Music | null;

        expect(result).toEqual(expectedShort);

        randomSpy.mockRestore();
    });
});