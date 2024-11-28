import { BaseMedia } from '../../src/models/mediaInterface';
import * as buffEng from '../../src/services/bufferEngine';
import * as td from '../testData/testData';

describe('selectFullDurationMedia', () => {
  it('get all full duration media (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all full duration media (scenario 2)', () => {
    const media: BaseMedia[] = [
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
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all full duration media (scenario 3)', () => {
    const media: BaseMedia[] = [
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
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all full duration media (scenario 4)', () => {
    const media: BaseMedia[] = [
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
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      td.transformers80s1,
      td.alientrailer1,
      td.pizzahutxmen,
      td.alienstoys1,
      td.jurassicpark3toys,
      td.halloween711,
      td.americanwerewolfinlondontrailer1,
      td.beetlejuicetrailer1,
    ];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all full duration media (scenario 5)', () => {
    const media: BaseMedia[] = [
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
    const selectedMedia: BaseMedia[] = [
      td.alienstoys1,
      td.jurassicpark3toys,
      td.halloween711,
    ];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      td.transformers80s1,
      td.alientrailer1,
      td.pizzahutxmen,
      td.americanwerewolfinlondontrailer1,
      td.beetlejuicetrailer1,
    ];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all full duration media (scenario 6)', () => {
    const media: BaseMedia[] = [
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
    const selectedMedia: BaseMedia[] = [td.ocarinaoftimetrailer1];
    const duration: number = 62;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectFullDurationMedia(
      media,
      selectedMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
