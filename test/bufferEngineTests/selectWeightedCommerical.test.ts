import { Commercial } from '../../src/models/commercial';
import * as buffEng from '../../src/services/bufferEngine';
import * as tdCommercials from '../testData/commercials';

describe('selectWeightedCommerical', () => {
  it('get commercial from first 10 or less (scenario 1)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const commercials: Commercial[] = [tdCommercials.jurassicparktoys1];

    const expectedCommercial: Commercial = tdCommercials.jurassicparktoys1;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 2)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    const commercials: Commercial[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];

    const expectedCommercial: Commercial = tdCommercials.alienstoys1;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 3)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.72);
    const commercials: Commercial[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];

    const expectedCommercial: Commercial = tdCommercials.pizzahutxmen;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
  it('get commercial from first 10 or less (scenario 4)', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.92);
    const commercials: Commercial[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
    ];

    const expectedCommercial: Commercial = tdCommercials.pizzahutxmen;

    const result: Commercial = buffEng.selectWeightedMedia(
      commercials,
    ) as Commercial;

    expect(result).toEqual(expectedCommercial);

    randomSpy.mockRestore();
  });
});
