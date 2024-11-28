import { BaseMedia } from '../../src/models/mediaInterface';
import * as buffEng from '../../src/services/bufferEngine';
import * as td from '../testData/testData';

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
    const duration: number = 500;
    const blockDuration: number = 120;

    const expectedMedia: BaseMedia[] = [
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
    const blockDuration: number = 120;

    const expectedMedia: BaseMedia[] = [
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
    const blockDuration: number = 20;

    const expectedMedia: BaseMedia[] = [
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.jurassicparktoys2,
      td.meninblacktoys97,
      td.jurassicparktoys3,
      td.transformersbeastwarstoys,
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
    const duration: number = 10;
    const blockDuration: number = 20;

    const expectedMedia: BaseMedia[] = [td.jurassicparktoys1];

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
