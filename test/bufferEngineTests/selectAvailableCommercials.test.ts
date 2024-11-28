import { Commercial } from '../../src/models/commercial';
import * as buffEng from '../../src/services/bufferEngine';
import * as td from '../testData/testData';

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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 30;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
      td.transformers80s1,
      td.alientrailer1,
      td.pizzahutxmen,
      td.alienstoys1,
      td.jurassicpark3toys,
      td.halloween711,
      td.americanwerewolfinlondontrailer1,
      td.beetlejuicetrailer1,
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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 30;
    const blockDuration: number = 12;

    const expectedCommercials: Commercial[] = [
      td.transformers80s1,
      td.alientrailer1,
      td.pizzahutxmen,
      td.alienstoys1,
      td.jurassicpark3toys,
      td.halloween711,
      td.americanwerewolfinlondontrailer1,
      td.beetlejuicetrailer1,
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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [
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
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.transformers80s1,
      td.alientrailer1,
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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [
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
    const duration: number = 120;
    const blockDuration: number = 30;

    const expectedCommercials: Commercial[] = [td.default9];

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
    const defaultCommercials: Commercial[] = td.defaultCommercials;
    const selectedCommercials: Commercial[] = [];
    const duration: number = 62;
    const blockDuration: number = 120;

    const expectedCommercials: Commercial[] = [td.ocarinaoftimetrailer1];

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
