import { MainGenres } from '../../../src/models/const/mainGenres';
import { Mosaic } from '../../../src/models/mosaic';
import { getMosaic } from '../../../src/prisms/mosaic';
import * as tdMosaics from '../../testData/mosaics';

describe('getMosaic', () => {
  it('should return the mosaic with the given key (scenario 1)', () => {
    const genres = [MainGenres.Action];

    const expectedMosiac: Mosaic = tdMosaics.actionMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 2)', () => {
    const genres = [MainGenres.Horror];

    const expectedMosiac: Mosaic = tdMosaics.horrorMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 3)', () => {
    const genres = [MainGenres.SciFi];

    const expectedMosiac: Mosaic = tdMosaics.scifiMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 4)', () => {
    const genres = [MainGenres.Action, MainGenres.Horror];

    const expectedMosiac: Mosaic = tdMosaics.actionHorrorMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 5)', () => {
    const genres = [MainGenres.Action, MainGenres.SciFi];

    const expectedMosiac: Mosaic = tdMosaics.actionSciFiMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 6)', () => {
    const genres = [MainGenres.Horror, MainGenres.SciFi];

    const expectedMosiac: Mosaic = tdMosaics.horrorSciFiMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
  it('should return the mosaic with the given key (scenario 7)', () => {
    const genres = [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi];

    const expectedMosiac: Mosaic = tdMosaics.actionHorrorSciFiMosaic;

    const mosaic = getMosaic(genres, tdMosaics.mosaics);

    expect(mosaic).toEqual(expectedMosiac);
  });
});
