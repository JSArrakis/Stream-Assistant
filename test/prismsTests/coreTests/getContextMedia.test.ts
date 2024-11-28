import { AgeGroups } from '../../../src/models/const/ageGroups';
import { Eras } from '../../../src/models/const/eras';
import { MainGenres } from '../../../src/models/const/mainGenres';
import { BaseMedia } from '../../../src/models/mediaInterface';
import * as core from '../../../src/prisms/core';
import * as tdCommercials from '../../testData/commercials';

describe('getContextMedia', () => {
  it('should return the media that have the tags (scenario 1)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [];
    const tags: string[] = [];
    const eraTags: string[] = [];
    const age: string = AgeGroups.Kids;
    const duration: number = 0;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 2)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [];
    const tags: string[] = [];
    const eraTags: string[] = [];
    const age: string = AgeGroups.Kids;
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 3)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [];
    const age: string = AgeGroups.Kids;
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 4)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [];
    const age: string = AgeGroups.Kids;
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [tdCommercials.meninblacktoys97];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 5)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Kids;
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [tdCommercials.meninblacktoys97];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 6)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
      tdCommercials.transformers80s1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Kids;
    const duration: number = 30;

    const expectedMedia: BaseMedia[] = [tdCommercials.transformers80s1];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 7)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
      tdCommercials.transformers80s1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Kids;
    const duration: number = 60;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.transformers80s1,
      tdCommercials.meninblacktoys97,
    ];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 8)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
      tdCommercials.transformers80s1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Mature;
    const duration: number = 60;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.alientrailer1,
    ];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 9)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
      tdCommercials.transformers80s1,
    ];
    const tags: string[] = [];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Mature;
    const duration: number = 120;

    const expectedMedia: BaseMedia[] = [
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.alientrailer1,
    ];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
  it('should return the media that have the tags (scenario 10)', () => {
    const alreadySelectedMedia: BaseMedia[] = [];
    const media: BaseMedia[] = [
      tdCommercials.beetlejuicetrailer1,
      tdCommercials.americanwerewolfinlondontrailer1,
      tdCommercials.meninblacktoys97,
      tdCommercials.alientrailer1,
      tdCommercials.transformers80s1,
    ];
    const tags: string[] = [MainGenres.SciFi];
    const eraTags: string[] = [Eras.neighties];
    const age: string = AgeGroups.Mature;
    const duration: number = 60;

    const expectedMedia: BaseMedia[] = [tdCommercials.alientrailer1];

    const result: BaseMedia[] = core.getContextMedia(
      alreadySelectedMedia,
      media,
      tags,
      eraTags,
      age,
      duration,
    );

    expect(result).toEqual(expectedMedia);
  });
});
