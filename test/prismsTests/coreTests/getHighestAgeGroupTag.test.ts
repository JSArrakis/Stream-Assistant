import { AgeGroups } from '../../../src/models/const/ageGroups';
import * as core from '../../../src/prisms/core';

describe('getHighestAgeGroupTag', () => {
  it('should return the highest age group from tags (scenario 1)', () => {
    const tags: string[] = [];
    const expectedTag: string = AgeGroups.Kids;

    const result: string = core.getHighestAgeGroupTag(tags);

    expect(result).toEqual(expectedTag);
  });
  it('should return the highest age group from tags (scenario 2)', () => {
    const tags: string[] = ['kids'];
    const expectedTag: string = AgeGroups.Kids;

    const result: string = core.getHighestAgeGroupTag(tags);

    expect(result).toEqual(expectedTag);
  });
  it('should return the highest age group from tags (scenario 3)', () => {
    const tags: string[] = ['kids', 'mature'];
    const expectedTag: string = AgeGroups.Mature;

    const result: string = core.getHighestAgeGroupTag(tags);

    expect(result).toEqual(expectedTag);
  });
  it('should return the highest age group from tags (scenario 4)', () => {
    const tags: string[] = ['kids', 'mature', 'youngadult'];
    const expectedTag: string = AgeGroups.Mature;

    const result: string = core.getHighestAgeGroupTag(tags);

    expect(result).toEqual(expectedTag);
  });
});
