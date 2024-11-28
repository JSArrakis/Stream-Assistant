import { Commercial } from '../../src/models/commercial';
import * as buffEng from '../../src/services/bufferEngine';
import * as td from '../testData/testData';

describe('selectWeightedCommerical', () => {
  it('get commercial from first 10 or less (scenario 1)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const commercials: Commercial[] = [td.jurassicparktoys1];

    const expectedCommercial: Commercial = td.jurassicparktoys1;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 2)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
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

    const expectedCommercial: Commercial = td.alienstoys1;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 3)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.72);
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

    const expectedCommercial: Commercial = td.pizzahutxmen;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 4)', () => {
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
    ];

    const expectedCommercial: Commercial = td.pizzahutxmen;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
});
