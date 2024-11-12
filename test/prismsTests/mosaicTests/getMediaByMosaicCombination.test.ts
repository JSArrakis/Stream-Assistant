import { Music } from "../../../src/models/music";
import * as td from "../../testData/testData"
import { BaseMedia } from "../../../src/models/mediaInterface";
import { getMediaByMosaicCombination } from "../../../src/prisms/mosaic";
import { AgeGroups } from "../../../src/models/const/ageGroups";

describe('getMediaByMosaicCombination', () => {
    it('should return the media with the given tags (scenario 1)', () => {
        const alreadySelectedMedia: Music[] = [];
        const media: Music[] = td.music;
        const specialtyTags: string[] = [];
        const genreTags: string[] = [];
        const eraTags: string[] = [];
        const age = AgeGroups.AllAges;
        const duration = 600;

        const expectedMedia: BaseMedia[] = [];

        const result = getMediaByMosaicCombination(alreadySelectedMedia, media, specialtyTags, genreTags, eraTags, td.mosaics, age, duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media with the given tags (scenario 2)', () => {
        const alreadySelectedMedia: Music[] = [];
        const media: Music[] = td.music;
        const specialtyTags: string[] = ["christmas"];
        const genreTags: string[] = [];
        const eraTags: string[] = [];
        const age = AgeGroups.AllAges;
        const duration = 600;

        const expectedMedia: BaseMedia[] = [];

        const result = getMediaByMosaicCombination(alreadySelectedMedia, media, specialtyTags, genreTags, eraTags, td.mosaics, age, duration);

        expect(result).toEqual(expectedMedia);
    });
});