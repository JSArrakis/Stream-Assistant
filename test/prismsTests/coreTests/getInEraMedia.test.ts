import { BaseMedia } from '../../../src/models/mediaInterface';
import { Eras } from '../../../src/models/const/eras';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('getInEraMedia', () => {
  it('should return the media that are in the era (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['jurrasicpark'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 2)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['marvel'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 3)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [tdCommercials.jurassicparktoys1];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 4)', () => {
    const media: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [tdCommercials.jurassicparktoys1];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 5)', () => {
    const media: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];
    const eraTags: string[] = [Eras.nnineties];
    const tags: string[] = [MainGenres.Action];

    const expectedMedia: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 5)', () => {
    const media: BaseMedia[] = [tdCommercials.beetlejuicetrailer1, tdCommercials.alientrailer1];
    const eraTags: string[] = [Eras.neighties];
    const tags: string[] = [MainGenres.Horror];

    const expectedMedia: BaseMedia[] = [tdCommercials.beetlejuicetrailer1];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

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

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getInEraMedia(media, eraTags, tags);

    expect(result).toEqual(expectedMedia);
  });
});
