import { AgeGroups } from "../../../src/models/const/ageGroups";
import { Holidays } from "../../../src/models/const/holidays";
import { MainGenres } from "../../../src/models/const/mainGenres";
import { Music } from "../../../src/models/music";
import { SegmentedTags } from "../../../src/models/segmentedTags";
import { getMediaByMosaicTags } from "../../../src/prisms/mosaic";
import * as td from "../../testData/testData"

describe('getMediaByMosaicTags', () => {
    it('should return the matching media with the given tags (scenario 1)', () => {
        const media: Music[] = [];
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [];
        const duration: number = 600;

        const expectedMedia: Music[] = [];

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the matching media with the given tags (scenario 2)', () => {
        const media: Music[] = td.music;
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [
            Holidays.Christmas
        ];
        const duration: number = 600;

        const expectedMedia: Music[] = [
            td.hereitschristmastime,
            td.allIwantforchristmasisyou,
            td.kidnapthesandyclaws,
        ];

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the matching media with the given tags (scenario 3)', () => {
        const media: Music[] = td.music;
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [];
        const duration: number = 600;

        const expectedMedia: Music[] = td.nonHolidayMusic;

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the matching media with the given tags (scenario 4)', () => {
        const media: Music[] = td.music;
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [MainGenres.Horror],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [
            Holidays.Christmas
        ];
        const duration: number = 200;

        const expectedMedia: Music[] = [
            td.kidnapthesandyclaws,
        ]

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the matching media with the given tags (scenario 5)', () => {
        const media: Music[] = td.music;
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [],
            ["marvel"],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [];
        const duration: number = 600;

        const expectedMedia: Music[] = [
            td.backinblack,
            td.comeandgetyourlove,
            td.ohhchild,
        ];

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the matching media with the given tags (scenario 6)', () => {
        const media: Music[] = td.music;
        const alreadySelectedMedia: Music[] = [];
        const tags: SegmentedTags = new SegmentedTags(
            [],
            [
                MainGenres.Action,
                MainGenres.Horror,
                MainGenres.SciFi
            ],
            [],
            [],
            [],
        );
        const mosaics = td.mosaics;
        const requestedHolidayTags: string[] = [];
        const duration: number = 600;

        const expectedMedia: Music[] = [
            td.paranoid,
            td.one,
            td.aceofspades,
            td.holydiver,
            td.painkiller,
            td.headlikeahole,
            td.stigmata,
            td.adrugagainstwar,
            td.dragula,
            td.thebeautifulpeople,
            td.thedarkplacesoftheearth,
            td.endtitles,
            td.reflectinginshadows,
            td.hypnagogic,
            td.twoonefourfive,
            td.nightcall,
            td.neotokyo,
            td.daysofthunder,
            td.turbokiller,
            td.technoir,
            td.hajnal,
            td.nostep,
            td.thesoundoftheunderground,
            td.manicpanic,
            td.blackacid,
        ];

        const result = getMediaByMosaicTags(
            media,
            alreadySelectedMedia,
            tags,
            mosaics,
            requestedHolidayTags,
            duration);

        expect(result).toEqual(expectedMedia);
    });
});