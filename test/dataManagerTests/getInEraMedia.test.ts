import { BaseMedia } from "../../src/models/mediaInterface";
import { Eras } from "../../src/models/const/eras";
import { MainGenres } from "../../src/models/const/mainGenres";
import { AgeGroups } from "../../src/models/const/ageGroups";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

describe('getInEraMedia', () => {
    it('should return the media that are in the era (scenario 1)', () => {
        const media: BaseMedia[] = [];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        const tags: string[] = [
            "jurrasicpark",
        ];

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 2)', () => {
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

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

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
            "jurassicpark",
        ];

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
        ];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 4)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        const tags: string[] = [
            "jurassicpark",
        ];

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
        ];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 5)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        const tags: string[] = [
            MainGenres.Action,
        ];

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 5)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1
        ];
        const eraTags: string[] = [
            Eras.neighties
        ];
        const tags: string[] = [
            MainGenres.Horror,
        ];

        const expectedMedia: BaseMedia[] = [
            td.beetlejuicetrailer1,
        ];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

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

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.getInEraMedia(media, eraTags, tags);

        expect(result).toEqual(expectedMedia);
    });
});