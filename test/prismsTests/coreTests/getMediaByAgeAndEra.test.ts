import { BaseMedia } from '../../../src/models/mediaInterface';
import { Eras } from '../../../src/models/const/eras';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as td from '../../testData/testData';

describe('getMediaByAgeAndEra', () => {
  it('should return the media that are in the era (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const eras: string[] = [];
    const age: string = AgeGroups.Kids;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByAgeAndEra(media, eras, age);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 2)', () => {
    const media: BaseMedia[] = [
      td.halloween711,
      td.alientrailer1,
      td.americanwerewolfinlondontrailer1,
      td.beetlejuicetrailer1,
      td.ocarinaoftimetrailer1,
      td.ijustshippedmybed,
      td.cornpopsgolf,
      td.blacktronlegomaniac,
      td.starttrektoys,
      td.sharkbitesfruitsnacks,
    ];
    const eras: string[] = [Eras.nnineties];
    const age: string = AgeGroups.Kids;

    const expectedMedia: BaseMedia[] = [
      td.ocarinaoftimetrailer1,
      td.cornpopsgolf,
      td.blacktronlegomaniac,
      td.starttrektoys,
      td.sharkbitesfruitsnacks,
    ];

    const result: BaseMedia[] = core.getMediaByAgeAndEra(media, eras, age);

    expect(result).toEqual(expectedMedia);
  });
});
