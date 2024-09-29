import { BaseMedia } from "../../src/models/mediaInterface";
import { Eras } from "../../src/models/const/eras";
import { MainGenres } from "../../src/models/const/mainGenres";
import { AgeGroups } from "../../src/models/const/ageGroups";
import * as dataMan from "../../src/services/dataManager";
import * as td from "../testData/testData";

describe('getAllTagMedia', () => {
    it('should return the media that have the tags (scenario 1)', () => {
        const media: BaseMedia[] = [];
        const tags: string[] = [
            "jurrasicpark",
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [];
        const expecteOutOfEraMedia: BaseMedia[] = [];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 2)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const tags: string[] = [
            "marvel",
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [];
        const expecteOutOfEraMedia: BaseMedia[] = [];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 3)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const tags: string[] = [
            "jurassicpark",
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const expecteOutOfEraMedia: BaseMedia[] = [];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 4)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];
        const tags: string[] = [
            "jurassicpark",
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.jurassicparktoys1,
        ];
        const expecteOutOfEraMedia: BaseMedia[] = [];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 5)', () => {
        const media: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];
        const tags: string[] = [
            MainGenres.Action,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.jurassicparktoys1,
            td.marvelvsstreetfighter98,
        ];
        const expecteOutOfEraMedia: BaseMedia[] = [];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 6)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1
        ];
        const tags: string[] = [
            MainGenres.Horror,
        ];
        const eraTags: string[] = [
            Eras.neighties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.beetlejuicetrailer1,
        ];
        const expecteOutOfEraMedia: BaseMedia[] = [
            td.alientrailer1
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 7)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1
        ];
        const tags: string[] = [
            MainGenres.Horror,
        ];
        const eraTags: string[] = [
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
        ];
        const expecteOutOfEraMedia: BaseMedia[] = [
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 8)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
            AgeGroups.Kids
        ];
        const eraTags: string[] = [
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 9)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
        ];
        const eraTags: string[] = [
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.alientrailer1,
            td.meninblacktoys97,
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 10)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
            AgeGroups.Kids
        ];
        const eraTags: string[] = [
            Eras.neighties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 11)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.meninblacktoys97,
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
            td.alientrailer1,
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 12)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
            MainGenres.Horror,
        ];
        const eraTags: string[] = [
            Eras.nnineties
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
            td.alientrailer1,
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
    it('should return the media that have the tags (scenario 13)', () => {
        const media: BaseMedia[] = [
            td.beetlejuicetrailer1,
            td.alientrailer1,
            td.meninblacktoys97,
        ];
        const tags: string[] = [
            MainGenres.SciFi,
        ];
        const eraTags: string[] = [
        ];
        let allTagMediaInEra: BaseMedia[] = []
        let allTagMediaOutOfEra: BaseMedia[] = []

        const expecteInEraMedia: BaseMedia[] = [
            td.alientrailer1,
            td.meninblacktoys97,
        ];

        const expecteOutOfEraMedia: BaseMedia[] = [
        ];

        ({ allTagMediaInEra, allTagMediaOutOfEra } = dataMan.getAllTagMedia(media, eraTags, tags));

        expect(allTagMediaInEra).toEqual(expecteInEraMedia);
        expect(allTagMediaOutOfEra).toEqual(expecteOutOfEraMedia);
    });
});