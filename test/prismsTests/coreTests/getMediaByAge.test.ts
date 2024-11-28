import { BaseMedia } from '../../../src/models/mediaInterface';
import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('getMediaByAge', () => {
  it('should return the media that are in the era (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const age: string = AgeGroups.Kids;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getMediaByAge(media, age);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 2)', () => {
    const media: BaseMedia[] = [
      tdCommercials.halloween711,
      tdCommercials.alientrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
      tdCommercials.ijustshippedmybed,
      tdCommercials.cornpopsgolf,
      tdCommercials.blacktronlegomaniac,
      tdCommercials.starttrektoys,
      tdCommercials.sharkbitesfruitsnacks,
    ];
    const age: string = AgeGroups.Kids;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.ocarinaoftimetrailer1,
      tdCommercials.cornpopsgolf,
      tdCommercials.blacktronlegomaniac,
      tdCommercials.starttrektoys,
      tdCommercials.sharkbitesfruitsnacks,
    ];

    const result: BaseMedia[] = core.getMediaByAge(media, age);

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that are in the era (scenario 3)', () => {
    const media: BaseMedia[] = [
      tdCommercials.halloween711,
      tdCommercials.alientrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.ocarinaoftimetrailer1,
      tdCommercials.ijustshippedmybed,
      tdCommercials.cornpopsgolf,
      tdCommercials.blacktronlegomaniac,
      tdCommercials.starttrektoys,
      tdCommercials.sharkbitesfruitsnacks,
    ];
    const age: string = AgeGroups.AllAges;

    const expectedMedia: BaseMedia[] = [tdCommercials.halloween711, tdCommercials.ijustshippedmybed];

    const result: BaseMedia[] = core.getMediaByAge(media, age);

    expect(result).toEqual(expectedMedia);
  });
});
