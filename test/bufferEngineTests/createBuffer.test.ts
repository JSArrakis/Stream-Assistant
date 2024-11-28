import { Commercial } from '../../src/models/commercial';
import { Media } from '../../src/models/media';
import { Mosaic } from '../../src/models/mosaic';
import { Music } from '../../src/models/music';
import { Promo } from '../../src/models/promo';
import { Short } from '../../src/models/short';
import { IStreamRequest } from '../../src/models/streamRequest';
import { createBuffer } from '../../src/services/bufferEngine';

describe('createBuffer', () => {
  it('should return the correct buffer for selected tags (Smoke Test)', () => {
    const duration: number = 0;
    const args: IStreamRequest = {
      Title: '',
      Env: '',
      Movies: [],
      Tags: [],
      MultiTags: [],
      Collections: [],
      StartTime: 0,
      Password: '',
    };
    const media: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };
    const mosaics: Mosaic[] = [];
    const halfATags: string[] = [];
    const halfBTags: string[] = [];
    const prevBuff: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };
    const holidays: string[] = [];

    const expectedBuffer: (Promo | Music | Short | Commercial)[] = [];
    const expectedRemainingDuration: number = 0;
    const expectedNewPrevBuff: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };

    const result = createBuffer(
      duration,
      args,
      media,
      mosaics,
      halfATags,
      halfBTags,
      prevBuff,
      holidays,
    );

    expect(result.buffer).toEqual(expectedBuffer);
    expect(result.remainingDuration).toEqual(expectedRemainingDuration);
    expect(result.newPrevBuffer).toEqual(expectedNewPrevBuff);
  });
  it('should return the correct buffer for selected tags (Smoke Test)', () => {
    const duration: number = 0;
    const args: IStreamRequest = {
      Title: '',
      Env: '',
      Movies: [],
      Tags: [],
      MultiTags: [],
      Collections: [],
      StartTime: 0,
      Password: '',
    };
    const media: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };
    const mosaics: Mosaic[] = [];
    const halfATags: string[] = [];
    const halfBTags: string[] = [];
    const prevBuff: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };
    const holidays: string[] = [];

    const expectedBuffer: (Promo | Music | Short | Commercial)[] = [];
    const expectedRemainingDuration: number = 0;
    const expectedNewPrevBuff: Media = {
      Shows: [],
      Movies: [],
      Shorts: [],
      Music: [],
      Promos: [],
      DefaultPromos: [],
      Commercials: [],
      DefaultCommercials: [],
      Collections: [],
    };

    const result = createBuffer(
      duration,
      args,
      media,
      mosaics,
      halfATags,
      halfBTags,
      prevBuff,
      holidays,
    );

    expect(result.buffer).toEqual(expectedBuffer);
    expect(result.remainingDuration).toEqual(expectedRemainingDuration);
    expect(result.newPrevBuffer).toEqual(expectedNewPrevBuff);
  });
});
