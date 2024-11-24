import { Commercial } from "../../src/models/commercial";
import { AgeGroups } from "../../src/models/const/ageGroups";
import { MainGenres } from "../../src/models/const/mainGenres";
import { Media } from "../../src/models/media";
import { Mosaic } from "../../src/models/mosaic";
import { Music } from "../../src/models/music";
import { SegmentedTags } from "../../src/models/segmentedTags";
import { Short } from "../../src/models/short";
import * as buffEng from "../../src/services/bufferEngine";
import * as td from "../testData/testData";

describe('selectBufferMediaWithinDuration', () => {
    it('should return the media within the duration (scenario 1)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const media: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );
        const mosaics: Mosaic[] = [];
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const duration: number = 0;
        const alreadyUsedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );

        const expectedSelectedMedia: (Commercial | Short | Music)[] = [];
        const expectedSegmentedSelectedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );
        const expectedRemainingDuration: number = 0;
        const selectedHolidayTags: string[] = [];

        const result = buffEng.selectBufferMediaWithinDuration(
            media,
            mosaics,
            segmentedTags,
            duration,
            alreadyUsedMedia,
            selectedHolidayTags
        );

        expect(result.selectedMedia).toEqual(expectedSelectedMedia);
        expect(result.segmentedSelectedMedia).toEqual(expectedSegmentedSelectedMedia);
        expect(result.remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('should return the media within the duration (scenario 2)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const media: Media = new Media(
            [],
            [],
            td.shorts,
            td.music,
            [],
            [],
            td.commercials,
            td.defaultCommercials,
            [],
        );
        const mosaics: Mosaic[] = td.mosaics;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const duration: number = 358;
        const alreadyUsedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );

        const expectedSelectedMedia: (Commercial | Short | Music)[] = [
            td.default8, td.default8, td.holidayincambodia, td.default6
        ];
        const expectedSegmentedSelectedMedia: Media = new Media(
            [],
            [],
            [],
            [td.holidayincambodia],
            [],
            [],
            [td.default8, td.default8, td.default6],
            [],
            [],
        );
        const expectedRemainingDuration: number = 7;
        const selectedHolidayTags: string[] = [];

        const result = buffEng.selectBufferMediaWithinDuration(
            media,
            mosaics,
            segmentedTags,
            duration,
            alreadyUsedMedia,
            selectedHolidayTags
        );

        expect(result.selectedMedia).toEqual(expectedSelectedMedia);
        expect(result.segmentedSelectedMedia).toEqual(expectedSegmentedSelectedMedia);
        expect(result.remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('should return the media within the duration (scenario 3)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const media: Media = new Media(
            [],
            [],
            td.shorts,
            td.music,
            [],
            [],
            td.commercials,
            td.defaultCommercials,
            [],
        );
        const mosaics: Mosaic[] = td.mosaics;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action, MainGenres.SciFi],
            [],
            [AgeGroups.Kids],
            [],
        );
        const duration: number = 358;
        const alreadyUsedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );

        const expectedSelectedMedia: (Commercial | Short | Music)[] = [
            td.superduperdoublelooper,
            td.pizzahutxmen,
            td.jurassicpark3toys,
            td.starttrektoys,
            td.jurassicparktoys3,
            td.jurassicparktoys2,
            td.wildones,
            td.marvelvsstreetfighter98,
            td.jurassicparktoys1,
            td.alienstoys1,
            td.transformers80s1,
            td.default8,
            td.default8,
        ];
        const expectedSegmentedSelectedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [
                td.superduperdoublelooper,
                td.pizzahutxmen,
                td.jurassicpark3toys,
                td.starttrektoys,
                td.jurassicparktoys3,
                td.jurassicparktoys2,
                td.wildones,
                td.marvelvsstreetfighter98,
                td.jurassicparktoys1,
                td.alienstoys1,
                td.transformers80s1,
                td.default8,
                td.default8,
            ],
            [],
            [],
        );
        const expectedRemainingDuration: number = 3;
        const selectedHolidayTags: string[] = [];

        const result = buffEng.selectBufferMediaWithinDuration(
            media,
            mosaics,
            segmentedTags,
            duration,
            alreadyUsedMedia,
            selectedHolidayTags
        );

        expect(result.selectedMedia).toEqual(expectedSelectedMedia);
        expect(result.segmentedSelectedMedia).toEqual(expectedSegmentedSelectedMedia);
        expect(result.remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('should return the media within the duration (scenario 4)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const media: Media = new Media(
            [],
            [],
            td.shorts,
            td.music,
            [],
            [],
            td.commercials,
            td.defaultCommercials,
            [],
        );
        const mosaics: Mosaic[] = td.mosaics;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action, MainGenres.SciFi],
            [],
            [AgeGroups.Kids],
            [],
        );
        const duration: number = 172;
        const alreadyUsedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );

        const expectedSelectedMedia: (Commercial | Short | Music)[] = [
                td.superduperdoublelooper,
                td.pizzahutxmen,
                td.jurassicpark3toys,
                td.starttrektoys,
                td.jurassicparktoys3,
                td.jurassicparktoys2,
                td.wildones,
                td.marvelvsstreetfighter98,
        ];
        const expectedSegmentedSelectedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [
                td.superduperdoublelooper,
                td.pizzahutxmen,
                td.jurassicpark3toys,
                td.starttrektoys,
                td.jurassicparktoys3,
                td.jurassicparktoys2,
                td.wildones,
                td.marvelvsstreetfighter98,
            ],
            [],
            [],
        );
        const expectedRemainingDuration: number = 7;
        const selectedHolidayTags: string[] = [];

        const result = buffEng.selectBufferMediaWithinDuration(
            media,
            mosaics,
            segmentedTags,
            duration,
            alreadyUsedMedia,
            selectedHolidayTags
        );

        expect(result.selectedMedia).toEqual(expectedSelectedMedia);
        expect(result.segmentedSelectedMedia).toEqual(expectedSegmentedSelectedMedia);
        expect(result.remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
    it('should return the media within the duration (scenario 5)', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const media: Media = new Media(
            [],
            [],
            td.shorts,
            td.music,
            [],
            [],
            td.commercials,
            td.defaultCommercials,
            [],
        );
        const mosaics: Mosaic[] = td.mosaics;
        const segmentedTags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi],
            [],
            [AgeGroups.Kids],
            [],
        );
        const duration: number = 1620;
        const alreadyUsedMedia: Media = new Media(
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        );

        const expectedSelectedMedia: (Commercial | Short | Music)[] = [
            td.superduperdoublelooper,
            td.pizzahutxmen,
            td.jurassicpark3toys,
            td.starttrektoys,
            td.jurassicparktoys3,
            td.thebeautifulpeople,
            td.jurassicparktoys2,
            td.wildones,
            td.marvelvsstreetfighter98,
            td.jurassicparktoys1,
            td.transformers80s1,
            td.transformersbeastwarstoys,
            td.default6,
            td.thedarkplacesoftheearth,
            td.default8,
            td.default8,
            td.endtitles,
            td.default8,
            td.default8,
            td.aceofspades, 
            td.default8,
            td.meninblacktoys97,
            td.default5,

        ];
        const expectedSegmentedSelectedMedia: Media = new Media(
            [],
            [],
            [],
            [
                td.thebeautifulpeople,
                td.thedarkplacesoftheearth,
                td.endtitles,
                td.aceofspades,
            ],
            [],
            [],
            [
                td.superduperdoublelooper,
                td.pizzahutxmen,
                td.jurassicpark3toys,
                td.starttrektoys,
                td.jurassicparktoys3,
                td.jurassicparktoys2,
                td.wildones,
                td.marvelvsstreetfighter98,
                td.jurassicparktoys1,
                td.transformers80s1,
                td.transformersbeastwarstoys,
                td.default6,
                td.default8,
                td.default8,
                td.default8,
                td.default8,
                td.default8,
                td.meninblacktoys97,
                td.default5,
            ],
            [],
            [],
        );
        const expectedRemainingDuration: number = 0;
        const selectedHolidayTags: string[] = [];

        const result = buffEng.selectBufferMediaWithinDuration(
            media,
            mosaics,
            segmentedTags,
            duration,
            alreadyUsedMedia,
            selectedHolidayTags
        );

        expect(result.selectedMedia).toEqual(expectedSelectedMedia);
        expect(result.segmentedSelectedMedia).toEqual(expectedSegmentedSelectedMedia);
        expect(result.remainingDuration).toEqual(expectedRemainingDuration);

        randomSpy.mockRestore();
    });
});