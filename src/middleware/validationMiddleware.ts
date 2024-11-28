import { body } from 'express-validator';

// ===========================================
//             MOVIE VALIDATION
// ===========================================

export const createMovieValidationRules = [
  body('title').isString().notEmpty(),

  body('tags')
    .isArray({ min: 1 })
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),

  body('path').isString().notEmpty(),
];

export const bulkCreateMoviesValidationRules = [];

export const updateMovieValidationRules = [
  body('title').isString().notEmpty(),

  body('tags')
    .isArray({ min: 1 })
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),

  body('path').isString().notEmpty(),
];

export const deleteMovieValidationRules = [];

export const getMovieValidationRules = [];

// ===========================================
//              SHOW VALIDATION
// ===========================================

export const createShowValidationRules = [
  body('title').isString().notEmpty(),

  body('loadTitle').isString(),

  body('imdb').isString(),

  body('tags')
    .isArray()
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),

  // episodes must be an array of Episode objects
  body('episodes')
    .isArray()
    .custom((value: any[]) => {
      for (const item of value) {
        if (typeof item !== 'object') {
          throw new Error('episodes must be an array of Episode objects');
        }
      }
      return true;
    }),

  // Each episode must have the following fields
  body('episodes.*.season').isNumeric().notEmpty(),

  body('episodes.*.episode').isNumeric().notEmpty(),

  body('episodes.*.path').isString().notEmpty(),

  body('episodes.*.title').isString(),

  body('episodes.*.tags')
    .isArray()
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),
];

export const updateShowValidationRules = [
  body('title').isString().notEmpty(),

  body('loadTitle').isString(),

  body('imdb').isString(),
  //body.tags must be an array of strings but can be empty
  body('tags')
    .isArray()
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),

  // episodes must be an array of Episode objects
  body('episodes')
    .isArray()
    .custom((value: any[]) => {
      for (const item of value) {
        if (typeof item !== 'object') {
          throw new Error('episodes must be an array of Episode objects');
        }
      }
      return true;
    }),

  // Each episode must have the following fields
  body('episodes.*.season').isNumeric().notEmpty(),

  body('episodes.*.episode').isNumeric().notEmpty(),

  body('episodes.*.path').isString().notEmpty(),

  body('episodes.*.title').isString(),

  body('episodes.*.tags')
    .isArray()
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),
];

export const deleteShowValidationRules = [];

export const getShowValidationRules = [];

// ===========================================
//          BUFFER MEDIA VALIDATION
// ===========================================

export function createMediaValidation(media: any): string {
  if (!media.title || typeof media.title !== 'string') {
    return 'Media must have a "title" field that is a string';
  }
  if (!media.path || typeof media.path !== 'string') {
    return 'Media must have a "path" field that is the file path of the target media file a string';
  }
  if (
    !media.tags ||
    !Array.isArray(media.tags) ||
    media.tags.length < 1 ||
    !media.tags.every((tag: any) => typeof tag === 'string')
  ) {
    return 'Media must have a "tags" field that must provided as a non-empty array of strings for each buffer media';
  }
  return '';
}

export const createBufferValidationRules = [
  body('title').isString().notEmpty(),
  body('tags')
    .isArray({ min: 1 })
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),
  body('path').isString().notEmpty(),
];

export const bulkCreateBufferValidationRules = [];

export const updateBufferValidationRules = [
  body('title').isString().notEmpty(),
  body('tags')
    .isArray({ min: 1 })
    .custom((value: string[]) => {
      for (const item of value) {
        if (typeof item !== 'string') {
          throw new Error('tags must be an array of strings');
        }
      }
      return true;
    }),
  body('path').isString().notEmpty(),
];

export const deleteBufferValidationRules = [];

export const getBufferValidationRules = [];
