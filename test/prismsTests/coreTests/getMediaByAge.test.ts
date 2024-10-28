import { BaseMedia } from "../../../src/models/mediaInterface";
import { AgeGroups } from "../../../src/models/const/ageGroups";
import * as core from "../../../src/prisms/core";
import * as td from "../../testData/testData";

describe('getMediaByAge', () => {
    it('should return the media that are in the era (scenario 1)', () => {
        const media: BaseMedia[] = [];
        const age: string = AgeGroups.Kids;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = core.getMediaByAge(media, age);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 2)', () => {
        const media: BaseMedia[] = [
            td.halloween711,
            td.alientrailer1,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
            td.ijustshippedmybed,
            td.cornpopsgolf,
            td.blacktronlegomaniac,
            td.starttrektoys,
            td.sharkbitesfruitsnacks,
        ];
        const age: string = AgeGroups.Kids;

        const expectedMedia: BaseMedia[] = [
            td.ocarinaoftimetrailer1,
            td.cornpopsgolf,
            td.blacktronlegomaniac,
            td.starttrektoys,
            td.sharkbitesfruitsnacks,
        ];

        const result: BaseMedia[] = core.getMediaByAge(media, age);

        expect(result).toEqual(expectedMedia);
    });
    it('should return the media that are in the era (scenario 3)', () => {
        const media: BaseMedia[] = [
            td.halloween711,
            td.alientrailer1,
            td.americanwerewolfinlondontrailer1,
            td.beetlejuicetrailer1,
            td.ocarinaoftimetrailer1,
            td.ijustshippedmybed,
            td.cornpopsgolf,
            td.blacktronlegomaniac,
            td.starttrektoys,
            td.sharkbitesfruitsnacks,
        ];
        const age: string = AgeGroups.AllAges;

        const expectedMedia: BaseMedia[] = [
            td.halloween711,
            td.ijustshippedmybed,
        ];

        const result: BaseMedia[] = core.getMediaByAge(media, age);

        expect(result).toEqual(expectedMedia);
    });
});