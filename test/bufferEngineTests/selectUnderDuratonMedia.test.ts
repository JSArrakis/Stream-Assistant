import { BaseMedia } from '../../src/models/mediaInterface';
import * as buffEng from '../../src/services/bufferEngine';
import * as tdCommercials from '../testData/commercials';

describe('selectUnderDuratonMedia', () => {
  it('get all media that is equal to or under duration (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const selectedMedia: BaseMedia[] = [];
    const duration: number = 0;
    const blockDuration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all media that is equal to or under duration (scenario 2)', () => {
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
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedMedia: BaseMedia[] = [
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

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all media that is equal to or under duration (scenario 3)', () => {
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
    const blockDuration: number = 120;

    const expectedMedia: BaseMedia[] = [
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
    ];

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all media that is equal to or under duration (scenario 4)', () => {
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
    const blockDuration: number = 20;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.transformersbeastwarstoys,
    ];

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all media that is equal to or under duration (scenario 5)', () => {
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
    const duration: number = 10;
    const blockDuration: number = 20;

    const expectedMedia: BaseMedia[] = [tdCommercials.jurassicparktoys1];

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('get all media that is equal to or under duration (scenario 6)', () => {
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
    const duration: number = 10;
    const blockDuration: number = 5;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = buffEng.selectUnderDuratonMedia(
      media,
      selectedMedia,
      duration,
      blockDuration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
