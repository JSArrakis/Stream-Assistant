import { AgeGroups } from '../../../src/models/const/ageGroups';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { BaseMedia } from '../../../src/models/mediaInterface';
import { Music } from '../../../src/models/music';
import { SegmentedTags } from '../../../src/models/segmentedTags';
import { getMediaBySpecialtyOrMosaicHeriarchy } from '../../../src/prisms/mosaic';
import * as tdMusic from '../../testData/music';
import * as tdMosaics from '../../testData/mosaics';

describe('getMediaBySpecialtyOrMosaicHeriarchy', () => {
  it('should return the media with the given tags (scenario 1)', () => {
    const alreadySelectedMedia: Music[] = [];
    const age = AgeGroups.AllAges;
    const media: Music[] = tdMusic.music;
    const segmentedTags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const mosaics = tdMosaics.mosaics;
    const duration = 600;

    const expectedMedia: BaseMedia[] = [];

    const result = getMediaBySpecialtyOrMosaicHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media with the given tags (scenario 2)', () => {
    const alreadySelectedMedia: Music[] = [];
    const age = AgeGroups.AllAges;
    const media: Music[] = tdMusic.nonHolidayMusic;
    const segmentedTags: SegmentedTags = new SegmentedTags(
      [],
      [MainGenres.Action],
      ['marvel'],
      [],
      [],
    );
    const mosaics = tdMosaics.mosaics;
    const duration = 500;

    const expectedMedia: BaseMedia[] = [tdMusic.backinblack, tdMusic.comeandgetyourlove];

    const result = getMediaBySpecialtyOrMosaicHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media with the given tags (scenario 3)', () => {
    const alreadySelectedMedia: Music[] = [];
    const age = AgeGroups.AllAges;
    const media: Music[] = tdMusic.nonHolidayMusic;
    const segmentedTags: SegmentedTags = new SegmentedTags(
      [],
      [MainGenres.Action],
      ['marvel'],
      [],
      [],
    );
    const mosaics = tdMosaics.mosaics;
    const duration = 600;

    const expectedMedia: BaseMedia[] = [
      tdMusic.backinblack,
      tdMusic.comeandgetyourlove,
      tdMusic.ohhchild,
    ];

    const result = getMediaBySpecialtyOrMosaicHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media with the given tags (scenario 4)', () => {
    const alreadySelectedMedia: Music[] = [];
    const age = AgeGroups.AllAges;
    const media: Music[] = tdMusic.nonHolidayMusic;
    const segmentedTags: SegmentedTags = new SegmentedTags(
      [],
      [MainGenres.Action],
      ['ironman', 'marvel'],
      [],
      [],
    );
    const mosaics = tdMosaics.mosaics;
    const duration = 200;

    const expectedMedia: BaseMedia[] = [tdMusic.backinblack];

    const result = getMediaBySpecialtyOrMosaicHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      mosaics,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
