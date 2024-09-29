import { BaseMedia } from "../../src/models/mediaInterface";
import { Eras } from "../../src/models/const/eras";
import { MainGenres } from "../../src/models/const/mainGenres";
import { AgeGroups } from "../../src/models/const/ageGroups";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

describe('getOutOfEraMedia', () => {
    it('should return the media that are out of the era (scenario 1)', () => {
        const media: BaseMedia[] = [];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        const tags: string[] = [
            "jurrasicpark",
        ];

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.getOutOfEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 2)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const eraTags: string[] = [
            Eras.neighties
        ];
        const tags: string[] = [
            "marvel",
        ];

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.getOutOfEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 3)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        const tags: string[] = [
            "marvel",
        ];

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.getOutOfEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 6)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const eraTags: string[] = [
            Eras.neighties
        ];
        const tags: string[] = [
            MainGenres.SciFi,
            AgeGroups.Kids
        ];

        const expectedMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        const result: BaseMedia[] = dataMan.getOutOfEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
});