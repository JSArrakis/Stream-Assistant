import { Commercial } from "../../src/models/commercial";
import * as buffEng from "../../src/services/bufferEngine";
import * as td from "../testData/testData";

describe('selectCommercials', () => {
    it('select commericals until duration or block duration is filled (scenario 1)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.92);
        const commercials: Commercial[] = [];
        const defaultCommercials: Commercial[] = [];
        const usedCommercials: Commercial[] = [];
        const duration: number = 0;

        const expectedCommercials: Commercial[] = [];
        const expectedRemainingDuration: number = 0;

        const [result, remainingDuration] = buffEng.selectCommercials(
            commercials,
            defaultCommercials,
            usedCommercials,
            duration,
        )

        expect(result).toEqual(expectedCommercials);
        expect(remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('select commericals until duration or block duration is filled (scenario 2)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.92);
        const commercials: Commercial[] = [
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ];
        const defaultCommercials: Commercial[] = [
            td.default1,
            td.default2,
            td.default3,
            td.default4,
            td.default5,
            td.default6,
            td.default7,
            td.default8,
            td.default9,
        ];
        const usedCommercials: Commercial[] = [];
        const duration: number = 0;

        const expectedCommercials: Commercial[] = [];
        const expectedRemainingDuration: number = 0;

        const [result, remainingDuration] = buffEng.selectCommercials(
            commercials,
            defaultCommercials,
            usedCommercials,
            duration,
        )

        expect(result).toEqual(expectedCommercials);
        expect(remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('select commericals until duration or block duration is filled (scenario 3)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.62);
        const commercials: Commercial[] = [
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ];
        const defaultCommercials: Commercial[] = [
            td.default1,
            td.default2,
            td.default3,
            td.default4,
            td.default5,
            td.default6,
            td.default7,
            td.default8,
            td.default9,
        ];
        const usedCommercials: Commercial[] = [

        ];
        const duration: number = 500;

        const expectedCommercials: Commercial[] = [
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
        ];
        const expectedRemainingDuration: number = 380;

        const [result, remainingDuration] = buffEng.selectCommercials(
            commercials,
            defaultCommercials,
            usedCommercials,
            duration,
        )

        expect(result).toEqual(expectedCommercials);
        expect(remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('select commericals until duration or block duration is filled (scenario 3)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.62);
        const commercials: Commercial[] = [
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ];
        const defaultCommercials: Commercial[] = [
            td.default1,
            td.default2,
            td.default3,
            td.default4,
            td.default5,
            td.default6,
            td.default7,
            td.default8,
            td.default9,
        ];
        const usedCommercials: Commercial[] = [

        ];
        const duration: number = 30;

        const expectedCommercials: Commercial[] = [
            td.jurassicpark3toys,
        ];
        const expectedRemainingDuration: number = 0;

        const [result, remainingDuration] = buffEng.selectCommercials(
            commercials,
            defaultCommercials,
            usedCommercials,
            duration,
        )

        expect(result).toEqual(expectedCommercials);
        expect(remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('select commericals until duration or block duration is filled (scenario 3)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.62);
        const commercials: Commercial[] = [
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ];
        const defaultCommercials: Commercial[] = [
            td.default1,
            td.default2,
            td.default3,
            td.default4,
            td.default5,
            td.default6,
            td.default7,
            td.default8,
            td.default9,
        ];
        const usedCommercials: Commercial[] = [

        ];
        const duration: number = 62;

        const expectedCommercials: Commercial[] = [
            td.ocarinaoftimetrailer1,
        ];
        const expectedRemainingDuration: number = 0;

        const [result, remainingDuration] = buffEng.selectCommercials(
            commercials,
            defaultCommercials,
            usedCommercials,
            duration,
        )

        expect(result).toEqual(expectedCommercials);
        expect(remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
});