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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [],
            SpecialtyTags: [
                "jurassicpark",
            ],
            AgeGroupTags: [
                AgeGroups.Kids,
            ],
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [],
            SpecialtyTags: [
                "jurassicpark",
            ],
            AgeGroupTags: [
                AgeGroups.Kids,
            ],
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
    it('should return the media that have the tags (scenario 4)', () => {
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [],
            SpecialtyTags: [
                "jurassicpark",
            ],
            AgeGroupTags: [
                AgeGroups.Kids,
            ],
            HolidayTags: [],
        };
        const duration: number = 60;

        const expectedMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.jurassicparktoys2,
            td.jurassicparktoys3,
            td.jurassicpark3toys,
        ];            

        const result: BaseMedia[] =
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );
        
        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [
                MainGenres.Action,
                MainGenres.SciFi,
                MainGenres.Horror,
            ],
            SpecialtyTags: [],
            AgeGroupTags: [
                AgeGroups.Kids,
            ],
            HolidayTags: [],
        };
        const duration: number = 120;

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
        ];

        const result: BaseMedia[] =
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [
                MainGenres.Action,
                MainGenres.SciFi,
                MainGenres.Horror,
            ],
            SpecialtyTags: [],
            AgeGroupTags: [
                AgeGroups.Kids,
            ],
            HolidayTags: [],
        };
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
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [
                MainGenres.Action,
                MainGenres.SciFi,
                MainGenres.Horror,
            ],
            SpecialtyTags: [],
            AgeGroupTags: [
                AgeGroups.Family,
            ],
            HolidayTags: [],
        };
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
            td.beetlejuicetrailer1,
        ];

        const result: BaseMedia[] =
            dataMan.getMediaByAgeGroupHierarchy(
                media,
                alreadySelectedMedia,
                segmentedTags,
                duration
            );

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
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
            td.halloween711,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
        ]
        const segmentedTags: SegmentedTags = {
            EraTags: [
                Eras.nnineties,
            ],
            GenreTags: [
                MainGenres.Action,
                MainGenres.SciFi,
                MainGenres.Horror,
            ],
            SpecialtyTags: [],
            AgeGroupTags: [
                AgeGroups.YoungAdult,
            ],
            HolidayTags: [],
        };
        const duration: number = 500;

        const expectedMedia: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.americanwerewolfinlondontrailer1,
        ];

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