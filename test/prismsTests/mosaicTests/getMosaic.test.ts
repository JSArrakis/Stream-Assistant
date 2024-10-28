import { MainGenres } from "../../../src/models/const/mainGenres";
import { MusicGenres } from "../../../src/models/const/musicGenres";
import { Mosaic } from "../../../src/models/mosaic";
import { getMosaic } from "../../../src/prisms/mosaic";
import * as td from "../../testData/testData"

describe('getMosaic', () => {
    it('should return the mosaic with the given key (scenario 1)', () => {
        const genres = [MainGenres.Action];

        const expectedMosiac: Mosaic = {
            Key: MainGenres.Action,
            Genres: [MainGenres.Action],
            MusicGenres: [
                MusicGenres.Rock,
                MusicGenres.Metal,
                MusicGenres.Punk,
                MusicGenres.HipHop,
            ],
            MusicSubGenres: [],
        };

        const mosaic = getMosaic(genres, td.mosaics);

        expect(mosaic).toEqual(expectedMosiac);
    });
});