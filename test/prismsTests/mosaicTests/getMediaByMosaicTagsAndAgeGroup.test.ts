import { AgeGroups } from '../../../src/models/const/ageGroups';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { BaseMedia } from '../../../src/models/mediaInterface';
import { Music } from '../../../src/models/music';
import { SegmentedTags } from '../../../src/models/segmentedTags';
import { getMediaByMosaicTagsAndAgeGroup } from '../../../src/prisms/mosaic';
import * as tdMusic from '../../testData/music';
import * as tdMosaics from '../../testData/mosaics';

describe('getMediaByMosaicTagsAndAgeGroup', () => {
  it('should return the media with the given tags (scenario 1)', () => {
    const media: Music[] = [];
    const alreadySelectedMedia: Music[] = [];
    const hasSpecialtyTags: boolean = false;
    const hasGenreTags: boolean = false;
    const hasEraTags: boolean = false;
    const tags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const age = AgeGroups.AllAges;
    const mosaics = tdMosaics.mosaics;
    const duration = 600;

    const expectedMedia: BaseMedia[] = [];

    const result = getMediaByMosaicTagsAndAgeGroup(
      media,
      alreadySelectedMedia,
      hasSpecialtyTags,
      hasGenreTags,
      hasEraTags,
      tags,
      age,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media with the given tags (scenario 2)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const hasSpecialtyTags: boolean = false;
    const hasGenreTags: boolean = false;
    const hasEraTags: boolean = false;
    const tags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const age = AgeGroups.AllAges;
    const mosaics = tdMosaics.mosaics;
    const duration = 600;

    const expectedMedia: BaseMedia[] = tdMusic.music;

    const result = getMediaByMosaicTagsAndAgeGroup(
      media,
      alreadySelectedMedia,
      hasSpecialtyTags,
      hasGenreTags,
      hasEraTags,
      tags,
      age,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
