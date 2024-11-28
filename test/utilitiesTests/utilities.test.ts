import * as utils from '../../src/utils/utilities';

describe('createMosaicKey', () => {
  it('should return a string with all genres concatenated (scenario 1)', () => {
    const genres = ['scifi'];
    const key = utils.createMosaicKey(genres);

    expect(key).toBe('scifi');
  });
  it('should return a string with all genres concatenated (scenario 2)', () => {
    const genres = ['scifi', 'action'];
    const key = utils.createMosaicKey(genres);

    expect(key).toBe('action-scifi');
  });
  it('should return a string with all genres concatenated (scenario 3)', () => {
    const genres = ['scifi', 'action', 'horror'];
    const key = utils.createMosaicKey(genres);

    expect(key).toBe('action-horror-scifi');
  });
});
