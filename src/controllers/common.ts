import * as ffmpeg from 'fluent-ffmpeg';
import { body } from 'express-validator';

export async function getMediaDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (!err) {
                const durationInSeconds: number = Math.round(Number(metadata.format.duration)) || 0;
                resolve(durationInSeconds);
            } else {
                reject(err);
            }
        });
    });
}

export function createMediaValidation(media: any): string {
    if (!media.title || typeof media.title !== 'string') {
        return 'Media must have a "title" field that is a string';
    }
    if (!media.path || typeof media.path !== 'string') {
        return 'Media must have a "path" field that is the file path of the target media file a string';
    }
    if (!media.tags || !Array.isArray(media.tags) || media.tags.length < 1 || !media.tags.every((tag: any) => typeof tag === 'string')) {
        return 'Media must have a "tags" field that must provided as a non-empty array of strings for each buffer media';
    }
    return '';
}

export const createBufferValidationRules = [
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

export const bulkCreateBufferValidationRules = [
];

export const updateBufferValidationRules = [
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

export const deleteBufferValidationRules = [
];

export const getBufferValidationRules = [
];