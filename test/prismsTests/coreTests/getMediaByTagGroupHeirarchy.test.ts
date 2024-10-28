import { AgeGroups } from "../../../src/models/const/ageGroups";
import { Eras } from "../../../src/models/const/eras";
import { MainGenres } from "../../../src/models/const/mainGenres";
import { BaseMedia } from "../../../src/models/mediaInterface";
import * as core from "../../../src/prisms/core";
import * as td from "../../testData/testData";

describe('getMediaByTagGroupHeirarchy', () => {
    it('should return the media that have the tags (scenario 1)', () => {
        const alreadySelectedMedia: BaseMedia[] = [];
        const media: BaseMedia[] = [];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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
        const media: BaseMedia[] = [
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [];
        const age: string = AgeGroups.Kids;
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];

        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];
        const tags: string[] = [];
        const eraTags: string[] = [
            Eras.nnineties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];

        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];
        const tags: string[] = [
            "jurassicpark",
        ];
        const eraTags: string[] = [
            Eras.nnineties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.jurassicparktoys2,
            td.jurassicparktoys3,
        ];

        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
        ];
        const tags: string[] = [
            "jurassicpark",
            "transformers",
        ];
        const eraTags: string[] = [
            Eras.nnineties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 30;

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.jurassicparktoys2,
            td.jurassicparktoys3,
            td.transformersbeastwarstoys,
            td.transformers80s1,
        ];

        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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
            td.littleoopsiedaisy,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.transformers80s1,
            td.alientrailer1,
            td.jurassicparktoys2,
            td.meninblacktoys97,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.transformersbeastwarstoys,
            td.alienstoys1,
            td.jurassicpark3toys,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
            MainGenres.Action,
            MainGenres.Horror,
        ];
        const eraTags: string[] = [
            Eras.nnineties,
        ];
        const age: string = AgeGroups.Kids;
        const duration: number = 500;

        const expectedMedia: BaseMedia[] = [
            td.alienstoys1,
            td.meninblacktoys97,
            td.transformersbeastwarstoys,
            td.transformers80s1,
            td.jurassicparktoys1,
            td.superduperdoublelooper,
            td.jurassicparktoys2,
            td.jurassicparktoys3,
            td.pizzahutxmen,
            td.jurassicpark3toys,
        ];
        const result: BaseMedia[] =
            core.getMediaByTagGroupHeirarchy(
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