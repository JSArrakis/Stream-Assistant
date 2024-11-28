import { AgeGroups } from '../../../src/models/const/ageGroups';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { Music } from '../../../src/models/music';
import { getMosaicMedia } from '../../../src/prisms/mosaic';
import * as td from '../../testData/testData';

describe('getMosaicMedia', () => {
  it('should return media matching the genres using mosaics (scenario 1)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = td.nonHolidayMusic;

    const specialtyTags: string[] = [];
    const genreTags = [MainGenres.Action];
    const mosaics = td.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [
      td.sweetchildomine,
      td.hotelcalifornia,
      td.backinblack,
      td.heyjude,
      td.alive,
      td.comeandgetyourlove,
      td.paranoid,
      td.one,
      td.aceofspades,
      td.holydiver,
      td.painkiller,
      td.blitzkriegbop,
      td.anarchyintheuk,
      td.londoncalling,
      td.holidayincambodia,
      td.rapperdelight,
      td.loseyourself,
      td.nystateofmind,
    ];

    const result = getMosaicMedia(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      mosaics,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return media matching the genres using mosaics (scenario 2)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = td.music;

    const specialtyTags: string[] = ['ironman'];
    const genreTags = [MainGenres.Action];
    const mosaics = td.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [td.backinblack];

    const result = getMosaicMedia(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      mosaics,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return media matching the genres using mosaics (scenario 3)', () => {
    const alreadySelectedMedia: Music[] = [td.backinblack];
    const media: Music[] = td.nonHolidayMusic;

    const specialtyTags: string[] = ['ironman'];
    const genreTags = [MainGenres.Action];
    const mosaics = td.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [
      td.sweetchildomine,
      td.hotelcalifornia,
      td.heyjude,
      td.alive,
      td.comeandgetyourlove,
      td.paranoid,
      td.one,
      td.aceofspades,
      td.holydiver,
      td.painkiller,
      td.blitzkriegbop,
      td.anarchyintheuk,
      td.londoncalling,
      td.holidayincambodia,
      td.rapperdelight,
      td.loseyourself,
      td.nystateofmind,
    ];

    const result = getMosaicMedia(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      mosaics,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return media matching the genres using mosaics (scenario 4)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = td.nonHolidayMusic;

    const specialtyTags: string[] = [];
    const genreTags = [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi];
    const mosaics = td.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [
      td.paranoid,
      td.one,
      td.aceofspades,
      td.holydiver,
      td.painkiller,
      td.headlikeahole,
      td.stigmata,
      td.adrugagainstwar,
      td.dragula,
      td.thebeautifulpeople,
      td.thedarkplacesoftheearth,
      td.endtitles,
      td.reflectinginshadows,
      td.hypnagogic,
      td.twoonefourfive,
      td.nightcall,
      td.neotokyo,
      td.daysofthunder,
      td.turbokiller,
      td.technoir,
      td.hajnal,
      td.nostep,
      td.thesoundoftheunderground,
      td.manicpanic,
      td.blackacid,
    ];

    const result = getMosaicMedia(
      alreadySelectedMedia,
      media,
      specialtyTags,
      genreTags,
      mosaics,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
