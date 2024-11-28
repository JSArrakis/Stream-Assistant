import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('sumMediaDuration', () => {
  it('should return the sum of all media durations (scenario 1)', () => {
    const media: BaseMedia[] = [];
    const expectedDuration: number = 0;

    const result: number = core.sumMediaDuration(media);

    expect(result).toEqual(expectedDuration);
  });
  it('should return the sum of all media durations (scenario 2)', () => {
    const media: BaseMedia[] = [
      tdCommercials.jurassicparktoys1,
      tdCommercials.marvelvsstreetfighter98,
      tdCommercials.wildones,
    ];
    const expectedDuration: number = 40;

    const result: number = core.sumMediaDuration(media);

    expect(result).toEqual(expectedDuration);
  });
  it('should return the sum of all media durations (scenario 3)', () => {
    const media: BaseMedia[] = [tdCommercials.jurassicparktoys1];
    const expectedDuration: number = 10;

    const result: number = core.sumMediaDuration(media);

    expect(result).toEqual(expectedDuration);
  });
});
