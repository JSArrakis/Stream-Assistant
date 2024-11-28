import { AgeGroups } from '../../../src/models/const/ageGroups';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { Music } from '../../../src/models/music';
import { getMosaicMedia } from '../../../src/prisms/mosaic';
import * as tdMusic from '../../testData/music';
import * as tdMosaics from '../../testData/mosaics';

describe('getMosaicMedia', () => {
  it('should return media matching the genres using mosaics (scenario 1)', () => {
    const alreadySelectedMedia: Music[] = [];
    const media: Music[] = tdMusic.nonHolidayMusic;

    const specialtyTags: string[] = [];
    const genreTags = [MainGenres.Action];
    const mosaics = tdMosaics.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [
      tdMusic.sweetchildomine,
      tdMusic.hotelcalifornia,
      tdMusic.backinblack,
      tdMusic.heyjude,
      tdMusic.alive,
      tdMusic.comeandgetyourlove,
      tdMusic.paranoid,
      tdMusic.one,
      tdMusic.aceofspades,
      tdMusic.holydiver,
      tdMusic.painkiller,
      tdMusic.blitzkriegbop,
      tdMusic.anarchyintheuk,
      tdMusic.londoncalling,
      tdMusic.holidayincambodia,
      tdMusic.rapperdelight,
      tdMusic.loseyourself,
      tdMusic.nystateofmind,
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
    const media: Music[] = tdMusic.music;

    const specialtyTags: string[] = ['ironman'];
    const genreTags = [MainGenres.Action];
    const mosaics = tdMosaics.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [tdMusic.backinblack];

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
    const alreadySelectedMedia: Music[] = [tdMusic.backinblack];
    const media: Music[] = tdMusic.nonHolidayMusic;

    const specialtyTags: string[] = ['ironman'];
    const genreTags = [MainGenres.Action];
    const mosaics = tdMosaics.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
    const duration: number = 600;

    const expectedMedia: Music[] = [
      tdMusic.sweetchildomine,
      tdMusic.hotelcalifornia,
      tdMusic.heyjude,
      tdMusic.alive,
      tdMusic.comeandgetyourlove,
      tdMusic.paranoid,
      tdMusic.one,
      tdMusic.aceofspades,
      tdMusic.holydiver,
      tdMusic.painkiller,
      tdMusic.blitzkriegbop,
      tdMusic.anarchyintheuk,
      tdMusic.londoncalling,
      tdMusic.holidayincambodia,
      tdMusic.rapperdelight,
      tdMusic.loseyourself,
      tdMusic.nystateofmind,
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
    const media: Music[] = tdMusic.nonHolidayMusic;

    const specialtyTags: string[] = [];
    const genreTags = [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi];
    const mosaics = tdMosaics.mosaics;
    const eraTags: string[] = [];
    const age: string = AgeGroups.AllAges;
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
