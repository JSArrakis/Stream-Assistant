import { AgeGroups } from '../../../src/models/const/ageGroups';
import { Eras } from '../../../src/models/const/eras';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { BaseMedia } from '../../../src/models/mediaInterface';
import { SegmentedTags } from '../../../src/models/segmentedTags';
import * as spectrum from '../../../src/prisms/spectrum';
import * as td from '../../testData/testData';

describe('getMediaByTagHeriarchy', () => {
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
    const age: string = AgeGroups.Kids;
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = spectrum.getMediaByTagHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      td.littleoopsiedaisy,
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.transformers80s1,
      td.alientrailer1,
      td.jurassicparktoys2,
      td.meninblacktoys97,
      td.jurassicparktoys3,
      td.pizzahutxmen,
      td.transformersbeastwarstoys,
      td.alienstoys1,
      td.jurassicpark3toys,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [],
      SpecialtyTags: ['jurassicpark'],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const age: string = AgeGroups.Kids;
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [
      td.jurassicparktoys1,
      td.jurassicparktoys2,
      td.jurassicparktoys3,
    ];

    const result: BaseMedia[] = spectrum.getMediaByTagHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      td.littleoopsiedaisy,
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.transformers80s1,
      td.alientrailer1,
      td.jurassicparktoys2,
      td.meninblacktoys97,
      td.jurassicparktoys3,
      td.pizzahutxmen,
      td.transformersbeastwarstoys,
      td.alienstoys1,
      td.jurassicpark3toys,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: [],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const age: string = AgeGroups.Kids;
    const duration: number = 500;

    const expectedMedia: BaseMedia[] = [
      td.alienstoys1,
      td.meninblacktoys97,
      td.transformersbeastwarstoys,
      td.transformers80s1,
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.jurassicparktoys2,
      td.jurassicparktoys3,
      td.pizzahutxmen,
      td.jurassicpark3toys,
    ];

    const result: BaseMedia[] = spectrum.getMediaByTagHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      td.littleoopsiedaisy,
      td.jurassicparktoys1,
      td.superduperdoublelooper,
      td.transformers80s1,
      td.alientrailer1,
      td.jurassicparktoys2,
      td.meninblacktoys97,
      td.jurassicparktoys3,
      td.pizzahutxmen,
      td.transformersbeastwarstoys,
      td.alienstoys1,
      td.jurassicpark3toys,
    ];
    const segmentedTags: SegmentedTags = {
      EraTags: [Eras.nnineties],
      GenreTags: [MainGenres.Action, MainGenres.SciFi, MainGenres.Horror],
      SpecialtyTags: ['jurassicpark', 'transformers'],
      AgeGroupTags: [AgeGroups.Kids],
      HolidayTags: [],
    };
    const age: string = AgeGroups.Kids;
    const duration: number = 70;

    const expectedMedia: BaseMedia[] = [
      td.jurassicparktoys1,
      td.jurassicparktoys2,
      td.jurassicparktoys3,
      td.jurassicpark3toys,
      td.transformersbeastwarstoys,
      td.transformers80s1,
    ];

    const result: BaseMedia[] = spectrum.getMediaByTagHeriarchy(
      alreadySelectedMedia,
      age,
      media,
      segmentedTags,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
