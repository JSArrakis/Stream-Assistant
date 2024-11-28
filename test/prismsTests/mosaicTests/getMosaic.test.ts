import { MainGenres } from '../../../src/models/const/mainGenres';
import { Mosaic } from '../../../src/models/mosaic';
import { getMosaic } from '../../../src/prisms/mosaic';
import * as td from '../../testData/testData';

describe('getMosaic', () => {
  it('should return the mosaic with the given key (scenario 1)', () => {
    const genres = [MainGenres.Action];

    const expectedMosiac: Mosaic = td.actionMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 2)', () => {
    const genres = [MainGenres.Horror];

    const expectedMosiac: Mosaic = td.horrorMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 3)', () => {
    const genres = [MainGenres.SciFi];

    const expectedMosiac: Mosaic = td.scifiMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 4)', () => {
    const genres = [MainGenres.Action, MainGenres.Horror];

    const expectedMosiac: Mosaic = td.actionHorrorMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 5)', () => {
    const genres = [MainGenres.Action, MainGenres.SciFi];

    const expectedMosiac: Mosaic = td.actionSciFiMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 6)', () => {
    const genres = [MainGenres.Horror, MainGenres.SciFi];

    const expectedMosiac: Mosaic = td.horrorSciFiMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 7)', () => {
    const genres = [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi];

    const expectedMosiac: Mosaic = td.actionHorrorSciFiMosaic;

    const mosaic = getMosaic(genres, td.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
});
