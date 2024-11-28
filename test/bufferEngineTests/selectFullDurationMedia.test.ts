import { BaseMedia } from '../../src/models/mediaInterface';
import * as buffEng from '../../src/services/bufferEngine';
import * as tdCommercials from '../testData/commercials';

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
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.pizzahutxmen,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
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
    const selectedMedia: BaseMedia[] = [
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
    ];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.pizzahutxmen,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
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
    const selectedMedia: BaseMedia[] = [tdCommercials.ocarinaoftimetrailer1];
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
