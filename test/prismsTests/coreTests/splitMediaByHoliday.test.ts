import { Holidays } from '../../../src/models/const/holidays';
import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as tdMusic from '../../testData/music';

describe('splitMediaByHoliday', () => {
  it('should return the media split by holidays (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const holidays: string[] = [];

    const expectedHolidayMedia: BaseMedia[] = [];
    const expectedNonHolidayMedia: BaseMedia[] = [];

    let holidayMedia: BaseMedia[] = [];
    let nonHolidayMedia: BaseMedia[] = [];
    ({ holidayMedia, nonHolidayMedia } = core.splitMediaByHoliday(
      media,
      holidays,
      Object.values(Holidays),
    ));

    expect(holidayMedia).toEqual(expectedHolidayMedia);
    expect(nonHolidayMedia).toEqual(expectedNonHolidayMedia);
  });
  it('should return the media split by holidays (scenario 2)', () => {
    const media: BaseMedia[] = tdMusic.music;
    const holidays: string[] = [];

    const expectedHolidayMedia: BaseMedia[] = [];
    const expectedNonHolidayMedia: BaseMedia[] = tdMusic.nonHolidayMusic;

    let holidayMedia: BaseMedia[] = [];
    let nonHolidayMedia: BaseMedia[] = [];
    ({ holidayMedia, nonHolidayMedia } = core.splitMediaByHoliday(
      media,
      holidays,
      Object.values(Holidays),
    ));

    expect(holidayMedia).toEqual(expectedHolidayMedia);
    expect(nonHolidayMedia).toEqual(expectedNonHolidayMedia);
  });
  it('should return the media split by holidays (scenario 3)', () => {
    const media: BaseMedia[] = tdMusic.music;
    const holidays: string[] = ['christmas'];

    const expectedHolidayMedia: BaseMedia[] = [
      tdMusic.hereitschristmastime,
      tdMusic.allIwantforchristmasisyou,
      tdMusic.kidnapthesandyclaws,
    ];
    const expectedNonHolidayMedia: BaseMedia[] = tdMusic.nonHolidayMusic;

    let holidayMedia: BaseMedia[] = [];
    let nonHolidayMedia: BaseMedia[] = [];
    ({ holidayMedia, nonHolidayMedia } = core.splitMediaByHoliday(
      media,
      holidays,
      Object.values(Holidays),
    ));

    expect(holidayMedia).toEqual(expectedHolidayMedia);
    expect(nonHolidayMedia).toEqual(expectedNonHolidayMedia);
  });
  it('should return the media split by holidays (scenario 4)', () => {
    const media: BaseMedia[] = tdMusic.music;
    const holidays: string[] = ['halloween'];

    const expectedHolidayMedia: BaseMedia[] = [
      tdMusic.kidnapthesandyclaws,
      tdMusic.monstermash,
    ];
    const expectedNonHolidayMedia: BaseMedia[] = tdMusic.nonHolidayMusic;

    let holidayMedia: BaseMedia[] = [];
    let nonHolidayMedia: BaseMedia[] = [];
    ({ holidayMedia, nonHolidayMedia } = core.splitMediaByHoliday(
      media,
      holidays,
      Object.values(Holidays),
    ));

    expect(holidayMedia).toEqual(expectedHolidayMedia);
    expect(nonHolidayMedia).toEqual(expectedNonHolidayMedia);
  });
  it('should return the media split by holidays (scenario 5)', () => {
    const media: BaseMedia[] = tdMusic.music;
    const holidays: string[] = ['easter'];

    const expectedHolidayMedia: BaseMedia[] = [];
    const expectedNonHolidayMedia: BaseMedia[] = tdMusic.nonHolidayMusic;

    let holidayMedia: BaseMedia[] = [];
    let nonHolidayMedia: BaseMedia[] = [];
    ({ holidayMedia, nonHolidayMedia } = core.splitMediaByHoliday(
      media,
      holidays,
      Object.values(Holidays),
    ));

    expect(holidayMedia).toEqual(expectedHolidayMedia);
    expect(nonHolidayMedia).toEqual(expectedNonHolidayMedia);
  });
});
