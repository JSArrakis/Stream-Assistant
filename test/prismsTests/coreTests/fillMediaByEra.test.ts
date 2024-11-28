import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('fillMediaByEra', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const eraMedia: BaseMedia[] = [];
    const nonEraMedia: BaseMedia[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const eraMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const nonEraMedia: BaseMedia[] = [tdCommercials.meninblacktoys97, tdCommercials.alientrailer1];

    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const alreadySelectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const eraMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const nonEraMedia: BaseMedia[] = [tdCommercials.meninblacktoys97, tdCommercials.alientrailer1];

    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [tdCommercials.beetlejuicetrailer1];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const eraMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const nonEraMedia: BaseMedia[] = [tdCommercials.meninblacktoys97, tdCommercials.alientrailer1];

    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const eraMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const nonEraMedia: BaseMedia[] = [tdCommercials.meninblacktoys97, tdCommercials.alientrailer1];

    const duration: number = 59;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const alreadySelectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const eraMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const nonEraMedia: BaseMedia[] = [tdCommercials.meninblacktoys97, tdCommercials.alientrailer1];

    const duration: number = 61;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];

    const result: BaseMedia[] = core.fillMediaByEra(
      alreadySelectedMedia,
      eraMedia,
      nonEraMedia,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
