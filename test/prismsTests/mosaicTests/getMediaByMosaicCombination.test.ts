import { Music } from '../../../src/models/music';
import { BaseMedia } from '../../../src/models/mediaInterface';
import { getMediaByMosaicCombination } from '../../../src/prisms/mosaic';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as tdMusic from '../../testData/music';
import * as tdMosaics from '../../testData/mosaics';

describe('getMediaByMosaicCombination', () => {
  it('should return the media with the given tags (scenario 1)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = tdMusic.music;
    const specialtyTags: string[] = [];
    const genreTags: string[] = [];
    const eraTags: string[] = [];
    const age = AgeGroups.AllAges;
    const duration = 600;

    const expectedMedia: BaseMedia[] = [];

    const result = getMediaByMosaicCombination(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      eraTags,
      tdMosaics.mosaics,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media with the given tags (scenario 2)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = tdMusic.music;
    const specialtyTags: string[] = ['christmas'];
    const genreTags: string[] = [];
    const eraTags: string[] = [];
    const age = AgeGroups.AllAges;
    const duration = 600;

    const expectedMedia: BaseMedia[] = [];

    const result = getMediaByMosaicCombination(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      eraTags,
      tdMosaics.mosaics,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
