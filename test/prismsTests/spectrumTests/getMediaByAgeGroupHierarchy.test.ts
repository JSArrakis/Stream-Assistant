import { AgeGroups } from '../../../src/models/const/ageGroups';
import { Eras } from '../../../src/models/const/eras';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { BaseMedia } from '../../../src/models/mediaInterface';
import { SegmentedTags } from '../../../src/models/segmentedTags';
import * as spectrum from '../../../src/prisms/spectrum';
import * as tdCommercials from '../../testData/commercials';

describe('getMediaByAgeGroupHierarchy', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [];
    const segmentedTags: SegmentedTags = {
      EraTags: [],
      GenreTags: [],
      SpecialtyTags: [],
      AgeGroupTags: [],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [],
      SpecialtyTags: ['jurassicpark'],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.jurassicparktoys3,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [],
      SpecialtyTags: ['jurassicpark'],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 60;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.jurassicparktoys3,
      tdCommercials.jurassicpark3toys,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: [],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 120;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.alienstoys1,
      tdCommercials.meninblacktoys97,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.transformers80s1,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.jurassicparktoys2,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 5)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: [],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 500;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.alienstoys1,
      tdCommercials.meninblacktoys97,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.transformers80s1,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.jurassicparktoys2,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.jurassicpark3toys,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: [],
      AgeGroupTags: [AgeGroups.Family],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 500;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.alienstoys1,
      tdCommercials.meninblacktoys97,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.transformers80s1,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.jurassicparktoys2,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.jurassicpark3toys,
      tdCommercials.beetlejuicetrailer1,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 7)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.littleoopsiedaisy,
      tdCommercials.jurassicparktoys1,
      tdCommercials.superduperdoublelooper,
      tdCommercials.transformers80s1,
      tdCommercials.alientrailer1,
      tdCommercials.jurassicparktoys2,
      tdCommercials.meninblacktoys97,
      tdCommercials.jurassicparktoys3,
      tdCommercials.pizzahutxmen,
      tdCommercials.transformersbeastwarstoys,
      tdCommercials.alienstoys1,
      tdCommercials.jurassicpark3toys,
      tdCommercials.halloween711,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: [],
      AgeGroupTags: [AgeGroups.YoungAdult],
      HolidayTags: [],
    };
    const requestedHolidayTags: string[] = [];
    const duration: number = 500;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.alientrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];

    const result: BaseMedia[] = spectrum.getMediaByAgeGroupHierarchy(
      media,
      alreadySelectedMedia,
      segmentedTags,
      requestedHolidayTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
