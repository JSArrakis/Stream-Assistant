import { AgeGroups } from "../../src/models/const/ageGroups";
import { Eras } from "../../src/models/const/eras";
import { MainGenres } from "../../src/models/const/mainGenres";
import { BaseMedia } from "../../src/models/mediaInterface";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

describe('getContextMedia', () => {
    it('should return the media that have the tags (scenario 1)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 2)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 3)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 4)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 6)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
            td.transformers80s1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [
            td.transformers80s1,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 7)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
            td.transformers80s1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 60;

        const expectedMedia: BaseMedia[] = [
            td.transformers80s1,
            td.meninblacktoys97,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 8)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
            td.transformers80s1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Mature;
        const duration: number = 60;

        const expectedMedia: BaseMedia[] = [
            td.americanwerewolfinlondontrailer1,
            td.alientrailer1,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 9)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
            td.transformers80s1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Mature;
        const duration: number = 120;

        const expectedMedia: BaseMedia[] = [
            td.americanwerewolfinlondontrailer1,
            td.alientrailer1,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 10)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.americanwerewolfinlondontrailer1,
            td.meninblacktoys97,
            td.alientrailer1,
            td.transformers80s1,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
        ];
        const eraTags: string[] = [
            Eras.neighties,
        ];
        const age: string = AgeGroups.Mature;
        const duration: number = 60;

        const expectedMedia: BaseMedia[] = [
            td.alientrailer1,
        ];

        const result: BaseMedia[] =
            dataMan.getContextMedia(
                alreadySelectedMedia,
                media,
                tags,
                eraTags,
                age,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
});