import { BaseMedia } from '../../../src/models/mediaInterface';
import { Eras } from '../../../src/models/const/eras';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('getOutOfEraMedia', () => {
  it('should return the media that are out of the era (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['jurrasicpark'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getOutOfEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 2)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const eraTags: string[] = [Eras.neighties];
    const tags: string[] = ['marvel'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getOutOfEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 3)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['marvel'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getOutOfEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 6)', () => {
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.alientrailer1,
      tdCommercials.meninblacktoys97,
    ];
    const eraTags: string[] = [Eras.neighties];
    const tags: string[] = [MainGenres.SciFi, AgeGroups.Kids];

    const expectedMedia: BaseMedia[] = [tdCommercials.meninblacktoys97];

    const result: BaseMedia[] = core.getOutOfEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
});
