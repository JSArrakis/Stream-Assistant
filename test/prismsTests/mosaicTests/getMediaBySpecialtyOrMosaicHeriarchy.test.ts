import { AgeGroups } from "../../../src/models/const/ageGroups";
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
});