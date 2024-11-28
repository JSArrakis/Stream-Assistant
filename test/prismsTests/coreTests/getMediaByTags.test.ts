import { BaseMedia } from '../../../src/models/mediaInterface';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as td from '../../testData/testData';

describe('getMediaByTags', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const tags: string[] = ['jurrasicpark'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const media: BaseMedia[] = [td.jurassicparktoys1];
    const tags: string[] = ['marvel'];

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const media: BaseMedia[] = [td.jurassicparktoys1];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [td.jurassicparktoys1];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const media: BaseMedia[] = [
      td.jurassicparktoys1,
      td.marvelvsstreetfighter98,
    ];
    const tags: string[] = ['jurassicpark'];

    const expectedMedia: BaseMedia[] = [td.jurassicparktoys1];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 5)', () => {
    const media: BaseMedia[] = [
      td.jurassicparktoys1,
      td.marvelvsstreetfighter98,
    ];
    const tags: string[] = [MainGenres.Action];

    const expectedMedia: BaseMedia[] = [
      td.jurassicparktoys1,
      td.marvelvsstreetfighter98,
    ];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const media: BaseMedia[] = [td.beetlejuicetrailer1, td.alientrailer1];
    const tags: string[] = [MainGenres.Horror];

    const expectedMedia: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.alientrailer1,
    ];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 7)', () => {
    const media: BaseMedia[] = [
      td.beetlejuicetrailer1,
      td.alientrailer1,
      td.meninblacktoys97,
    ];
    const tags: string[] = [MainGenres.SciFi, AgeGroups.Kids];

    const expectedMedia: BaseMedia[] = [td.meninblacktoys97];

    const result: BaseMedia[] = core.getMediaByTags(media, tags);

    expect(result).toEqual(expectedMedia);
  });
});
