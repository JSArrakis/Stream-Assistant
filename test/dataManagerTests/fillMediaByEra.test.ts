import { BaseMedia } from "../../src/models/mediaInterface";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

describe('fillMediaByEra', () => {
    it('should return the media that have the tags (scenario 1)', () => {
        const eraMedia: BaseMedia[] = [];
        const nonEraMedia: BaseMedia[] = [];
        const duration: number = 0;

        const expectedMedia: BaseMedia[] = [];

        const result: BaseMedia[] = dataMan.fillMediaByEra(eraMedia, nonEraMedia, duration);

        expect(result).toEqual(expectedMedia);
    });
});