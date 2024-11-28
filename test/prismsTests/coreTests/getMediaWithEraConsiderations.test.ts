import { Eras } from '../../../src/models/const/eras';
import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

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
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [];
    const eraTags: string[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
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
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
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
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
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
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
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
    const alreadySelectedMedia: BaseMedia[] = [tdCommercials.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
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
    const alreadySelectedMedia: BaseMedia[] = [tdCommercials.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 61;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
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
    const alreadySelectedMedia: BaseMedia[] = [tdCommercials.beetlejuicetrailer1];
    const allTagMediaInEra: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const allTagMediaOutOfEra: BaseMedia[] = [
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const eraTags: string[] = [Eras.neighties];
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [tdCommercials.americanwerewolfinlondontrailer1];

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
