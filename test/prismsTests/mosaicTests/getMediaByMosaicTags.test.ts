import { AgeGroups } from '../../../src/models/const/ageGroups';
import { Holidays } from '../../../src/models/const/holidays';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { Music } from '../../../src/models/music';
import { SegmentedTags } from '../../../src/models/segmentedTags';
import { getMediaByMosaicTags } from '../../../src/prisms/mosaic';
import * as tdMusic from '../../testData/music';
import * as tdMosaics from '../../testData/mosaics';

describe('getMediaByMosaicTags', () => {
  it('should return the matching media with the given tags (scenario 1)', () => {
    const media: Music[] = [];
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [];
    const duration: number = 600;

    const expectedMedia: Music[] = [];

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the matching media with the given tags (scenario 2)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [Holidays.Christmas];
    const duration: number = 600;

    const expectedMedia: Music[] = [
      tdMusic.hereitschristmastime,
      tdMusic.allIwantforchristmasisyou,
      tdMusic.kidnapthesandyclaws,
    ];

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the matching media with the given tags (scenario 3)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags([], [], [], [], []);
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [];
    const duration: number = 600;

    const expectedMedia: Music[] = tdMusic.nonHolidayMusic;

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the matching media with the given tags (scenario 4)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags(
      [],
      [MainGenres.Horror],
      [],
      [],
      [],
    );
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [Holidays.Christmas];
    const duration: number = 200;

    const expectedMedia: Music[] = [tdMusic.kidnapthesandyclaws];

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the matching media with the given tags (scenario 5)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags([], [], ['marvel'], [], []);
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [];
    const duration: number = 600;

    const expectedMedia: Music[] = [
      tdMusic.backinblack,
      tdMusic.comeandgetyourlove,
      tdMusic.ohhchild,
    ];

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the matching media with the given tags (scenario 6)', () => {
    const media: Music[] = tdMusic.music;
    const alreadySelectedMedia: Music[] = [];
    const tags: SegmentedTags = new SegmentedTags(
      [],
      [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi],
      [],
      [],
      [],
    );
    const mosaics = tdMosaics.mosaics;
    const requestedHolidayTags: string[] = [];
    const duration: number = 600;

    const expectedMedia: Music[] = [
      tdMusic.paranoid,
      tdMusic.one,
      tdMusic.aceofspades,
      tdMusic.holydiver,
      tdMusic.painkiller,
      tdMusic.headlikeahole,
      tdMusic.stigmata,
      tdMusic.adrugagainstwar,
      tdMusic.dragula,
      tdMusic.thebeautifulpeople,
      tdMusic.thedarkplacesoftheearth,
      tdMusic.endtitles,
      tdMusic.reflectinginshadows,
      tdMusic.hypnagogic,
      tdMusic.twoonefourfive,
      tdMusic.nightcall,
      tdMusic.neotokyo,
      tdMusic.daysofthunder,
      tdMusic.turbokiller,
      tdMusic.technoir,
      tdMusic.hajnal,
      tdMusic.nostep,
      tdMusic.thesoundoftheunderground,
      tdMusic.manicpanic,
      tdMusic.blackacid,
    ];

    const result = getMediaByMosaicTags(
      media,
      alreadySelectedMedia,
      tags,
      mosaics,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
