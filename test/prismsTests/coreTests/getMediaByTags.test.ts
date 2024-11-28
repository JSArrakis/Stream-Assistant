import { BaseMedia } from '../../../src/models/mediaInterface';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('getMediaByTags', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const tags: string[] = ['jurrasicpark'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const tags: string[] = ['marvel'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [tdCommercials.jurassicparktoys1];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const media: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [tdCommercials.jurassicparktoys1];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 5)', () => {
    const media: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];
    const tags: string[] = [MainGenres.Action];

    const expectedMedia: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
    ];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const media: BaseMedia[] = [tdCommercials.beetlejuicetrailer1, tdCommercials.alientrailer1];
    const tags: string[] = [MainGenres.Horror];

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.alientrailer1,
    ];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 7)', () => {
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.alientrailer1,
      tdCommercials.meninblacktoys97,
    ];
    const tags: string[] = [MainGenres.SciFi, AgeGroups.Kids];

    const expectedMedia: BaseMedia[] = [tdCommercials.meninblacktoys97];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
});
