import { AgeGroups } from "../../src/models/const/ageGroups";
import { Holidays } from "../../src/models/const/holidays";
import { MainGenres } from "../../src/models/const/mainGenres";
import { getHolidayTags } from "../../src/services/bufferEngine";

describe('getHolidayTags', () => {
    it('should return the correct tags for selected holiday (Smoke Test)', () => {
        const tags: string[] = [];
        const holidays: string[] = [];
        const expected: string[] = [];

        const result = getHolidayTags(tags, holidays);

        expect(result).toEqual(expected);
    });
    it('should return the correct tags for selected holiday (Scenario 1)', () => {
        const tags: string[] = [MainGenres.SciFi, AgeGroups.Family, 'tag1', 'tag2', Holidays.Christmas];
        const holidays: string[] = [];
        const expected: string[] = [];

        const result = getHolidayTags(tags, holidays);

        expect(result).toEqual(expected);
    });
    it('should return the correct tags for selected holiday (Scenario 1)', () => {
        const tags: string[] = [MainGenres.SciFi, AgeGroups.Family, 'tag1', 'tag2', Holidays.Christmas];
        const holidays: string[] = [Holidays.Halloween];
        const expected: string[] = [];

        const result = getHolidayTags(tags, holidays);

        expect(result).toEqual(expected);
    });
    it('should return the correct tags for selected holiday (Scenario 1)', () => {
        const tags: string[] = [MainGenres.SciFi, AgeGroups.Family, 'tag1', 'tag2', Holidays.Christmas];
        const holidays: string[] = [Holidays.Christmas];
        const expected: string[] = [Holidays.Christmas];

        const result = getHolidayTags(tags, holidays);

        expect(result).toEqual(expected);
    });
});