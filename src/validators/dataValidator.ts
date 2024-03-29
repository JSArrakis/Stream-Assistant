// src/validators/streamValidator.ts
import { Request, Response, NextFunction, query } from 'express';
import { body, param, validationResult } from 'express-validator';

export const createShowValidationRules = [
    body('title')
        .isString()
        .notEmpty(),

    body('loadTitle')
        .isString(),

    body('imdb')
        .isString(),

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
    body('episodes.*.season')
        .isNumeric()
        .notEmpty(),

    body('episodes.*.episode')
        .isNumeric()
        .notEmpty(),

    body('episodes.*.path')
        .isString()
        .notEmpty(),

    body('episodes.*.title')
        .isString(),

    body('episodes.*.tags')
        .isArray()
        .custom((value: string[]) => {
            for (const item of value) {
                if (typeof item !== 'string') {
                    throw new Error('tags must be an array of strings');
                }
            }
            return true;
        })
];

export const updateShowValidationRules = [
    body('title')
        .isString()
        .notEmpty(),

    body('loadTitle')
        .isString(),

    body('imdb')
        .isString(),
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
    body('episodes.*.season')
        .isNumeric()
        .notEmpty(),

    body('episodes.*.episode')
        .isNumeric()
        .notEmpty(),

    body('episodes.*.path')
        .isString()
        .notEmpty(),

    body('episodes.*.title')
        .isString(),

    body('episodes.*.tags')
        .isArray()
        .custom((value: string[]) => {
            for (const item of value) {
                if (typeof item !== 'string') {
                    throw new Error('tags must be an array of strings');
                }
            }
            return true;
        })
];

export const deleteShowValidationRules = [
];

export const getShowValidationRules = [
];

export const createMovieValidationRules = [
    body('title')
        .isString()
        .notEmpty(),

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

    body('path')
        .isString()
        .notEmpty()

];

export const bulkCreateMoviesValidationRules = [
];

export const updateMovieValidationRules = [
    body('title')
        .isString()
        .notEmpty(),

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

    body('path')
        .isString()
        .notEmpty()
];

export const deleteMovieValidationRules = [
];

export const getMovieValidationRules = [
];

export const createBufferValidationRules = [
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
    body('path')
        .isString()
        .notEmpty()
];

export const updateBufferValidationRules = [
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
    body('path')
        .isString()
        .notEmpty()
];

export const deleteBufferValidationRules = [
];

export const getBufferValidationRules = [
];