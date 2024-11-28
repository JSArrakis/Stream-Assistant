import { Commercial } from '../../src/models/commercial';
import * as buffEng from '../../src/services/bufferEngine';
import * as tdCommercials from '../testData/commercials';

describe('selectAvailableCommercials', () => {
  it('get enough commericials to fit duration if possible (scenario 1)', () => {
    const commercials: Commercial[] = [];
    const defaultCommercials: Commercial[] = [];
    const selectedCommercials: Commercial[] = [];
    const duration: number = 0;
    const blockDuration: number = 0;

    const expectedCommercials: Commercial[] = [];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 2)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 0;
    const blockDuration: number = 0;

    const expectedCommercials: Commercial[] = [];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 3)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 30;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.pizzahutxmen,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
    ];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 4)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 30;
    const blockDuration: number = 12;

    const expectedCommercials: Commercial[] = [
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.pizzahutxmen,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
    ];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 5)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
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

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 6)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [
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
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.default1,
      tdCommercials.default2,
      tdCommercials.default3,
      tdCommercials.default4,
      tdCommercials.default5,
      tdCommercials.default6,
      tdCommercials.default7,
      tdCommercials.default8,
      tdCommercials.default9,
    ];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 6)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [
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
    const duration: number = 120;
    const blockDuration: number = 30;

    const expectedCommercials: Commercial[] = [tdCommercials.default9];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
  it('get enough commericials to fit duration if possible (scenario 6)', () => {
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
    const defaultCommercials: Commercial[] = tdCommercials.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 62;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [tdCommercials.ocarinaoftimetrailer1];

    const result: Commercial[] = buffEng.selectAvailableCommercials(
      commercials,
      defaultCommercials,
      selectedCommercials,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedCommercials);
  });
});
