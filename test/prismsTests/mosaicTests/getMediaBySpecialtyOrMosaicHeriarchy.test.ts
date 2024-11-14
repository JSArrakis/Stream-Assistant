import { AgeGroups } from "../../../src/models/const/ageGroups";
import { MainGenres } from "../../../src/models/const/mainGenres";
import { BaseMedia } from "../../../src/models/mediaInterface";
import { Music } from "../../../src/models/music";
import { SegmentedTags } from "../../../src/models/segmentedTags";
import { getMediaBySpecialtyOrMosaicHeriarchy } from "../../../src/prisms/mosaic";
import * as td from "../../testData/testData"

describe('getMediaBySpecialtyOrMosaicHeriarchy', () => {
    it('should return the media with the given tags (scenario 1)', () => {
        const alreadySelectedMedia: Music[] = [];
        const age = AgeGroups.AllAges;
        const media: Music[] = td.music;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const duration = 600;

        const expectedMedia: BaseMedia[] = [];

        const result = getMediaBySpecialtyOrMosaicHeriarchy(alreadySelectedMedia, age, media, segmentedTags, mosaics, duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media with the given tags (scenario 2)', () => {
        const alreadySelectedMedia: Music[] = [];
        const age = AgeGroups.AllAges;
        const media: Music[] = td.nonHolidayMusic;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action],
            ["marvel"],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const duration = 500;

        const expectedMedia: BaseMedia[] = [
            td.backinblack,
            td.comeandgetyourlove,
        ];

        const result = getMediaBySpecialtyOrMosaicHeriarchy(alreadySelectedMedia, age, media, segmentedTags, mosaics, duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media with the given tags (scenario 3)', () => {
        const alreadySelectedMedia: Music[] = [];
        const age = AgeGroups.AllAges;
        const media: Music[] = td.nonHolidayMusic;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action],
            ["marvel"],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const duration = 600;

        const expectedMedia: BaseMedia[] = [
            td.backinblack,
            td.comeandgetyourlove,
            td.ohhchild,
        ];

        const result = getMediaBySpecialtyOrMosaicHeriarchy(alreadySelectedMedia, age, media, segmentedTags, mosaics, duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media with the given tags (scenario 4)', () => {
        const alreadySelectedMedia: Music[] = [];
        const age = AgeGroups.AllAges;
        const media: Music[] = td.nonHolidayMusic;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action],
            ["ironman", "marvel"],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const duration = 200;

        const expectedMedia: BaseMedia[] = [
            td.backinblack,
        ];

        const result = getMediaBySpecialtyOrMosaicHeriarchy(alreadySelectedMedia, age, media, segmentedTags, mosaics, duration);

        expect(result).toEqual(expectedMedia);
    });
});