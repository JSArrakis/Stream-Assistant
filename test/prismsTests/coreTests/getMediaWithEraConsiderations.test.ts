import { Eras } from '../../../src/models/const/eras';
import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as td from '../../testData/testData';

describe('getMediaWithEraConsiderations', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [];
    const allTagMediaOutOfEra: BaseMedia[] = [];
    const eraTags: string[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [];
    const allTagMediaOutOfEra: BaseMedia[] = [];
    const eraTags: string[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [];
    const eraTags: string[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 5)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 7)', () => {
    const alreadySelectedMedia: BaseMedia[] = [td.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      td.americanwerewolfinlondontrailer1,
      td.meninblacktoys97,
      td.alientrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 8)', () => {
    const alreadySelectedMedia: BaseMedia[] = [td.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 61;

    const expectedMedia: BaseMedia[] = [
      td.americanwerewolfinlondontrailer1,
      td.meninblacktoys97,
      td.alientrailer1,
    ];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 9)', () => {
    const alreadySelectedMedia: BaseMedia[] = [td.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      td.meninblacktoys97,
      td.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [td.americanwerewolfinlondontrailer1];

    const result: BaseMedia[] = core.getMediaWithEraConsiderations(
      alreadySelectedMedia,
      allTagMediaInEra,
      allTagMediaOutOfEra,
      eraTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
