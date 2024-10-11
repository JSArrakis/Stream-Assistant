import { AgeGroups } from "../../src/models/const/ageGroups";
import { Eras } from "../../src/models/const/eras";
import { MainGenres } from "../../src/models/const/mainGenres";
import { BaseMedia } from "../../src/models/mediaInterface";
import { SegmentedTags } from "../../src/models/segmentedTags";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

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
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );
        
        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 2)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [];
        const segmentedTags: SegmentedTags = {
            EraTags: [],
            GenreTags: [],
            SpecialtyTags: [],
            AgeGroupTags: [],
            HolidayTags: [],
        };
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );
        
        expect(result).toEqual(expectedMedia);
    });
});