// src/validators/streamValidator.ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const streamAllowedFields = ['env', 'movies', 'tagsOR', 'endTime', 'startTime', 'password'];
const loadMediaAllowedFields = ['password', 'media'];

export const streamStartValidationRules = [
    // Ensure only allowed fields are present
    (req: Request, res: Response, next: Function) => {
        const requestBody: Record<string, any> = req.body;

        const extraFields = Object.keys(requestBody).filter((field) => !streamAllowedFields.includes(field));
        if (extraFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
        }
        next();
    },

    // Validate the 'env' field
    body('env')
        .optional()
        .custom((value: string) => {
            if (value !== 'Default' && value !== 'FC') {
                throw new Error("Env must be values 'Default' or 'FC'");
            }
            return true;
        }),

    // Validate the 'movies' field
    body('movies')
        .optional()
        .isArray()
        .custom((value: string[]) => {
            for (const item of value) {
                if (typeof item !== 'string') {
                    throw new Error('movies must be an array of strings');
                }
                if (item.includes('::')) {
                    const [firstPart, secondPart] = item.split('::');
                    // Check the first part for only letters and numbers
                    if (!/^[a-zA-Z0-9]+$/.test(firstPart)) {
                        throw new Error('The first part of movies must contain only letters and numbers');
                    }

                    // Check the second part for ISO 8601 date format with 30-minute increments
                    const isoDateRegex = /^(\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):(?:00|30))$/;
                    if (!isoDateRegex.test(secondPart)) {
                        throw new Error('The second part of movies must be in the format YYYY-MM-DDTHH:MM with 30-minute increments in 24-hour time');
                    }
                } else {
                    // If no "::" found, check for only letters and numbers
                    if (!/^[a-zA-Z0-9]+$/.test(item)) {
                        throw new Error('movies must be in the format "string" or "string::ISO8601 date" with allowed characters');
                    }
                }
            }
            return true;
        }),

    // Validate the 'tagsOR' field
    body('tagsOR')
        .optional()
        .isArray()
        .withMessage('tagsOR must be an array')
        .custom((value: string[]) => {
            // Check if all elements in the array are strings
            for (const item of value) {
                if (typeof item !== 'string') {
                    throw new Error('tagsOR must be an array of strings');
                }
            }
            return true;
        }),

    // Validate the 'endTime' field
    body('endTime')
        .optional()
        .custom((value: string) => {
            // Use a regular expression to match the desired format (YYYY-MM-DDTHH:MM)
            const regex = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):(?:00|30)$/


            if (!regex.test(value)) {
                throw new Error('endTime must be in the format YYYY-MM-DDTHH:MM in 24-hour time and a multiple of 30 minutes');
            }

            return true;
        }),

    // Validate the 'startTime' field
    body('startTime')
        .optional()
        .custom((value: string) => {
            // Use a regular expression to match the desired format (YYYY-MM-DDTHH:MM)
            const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

            if (!regex.test(value)) {
                throw new Error('startTime must be in the format YYYY-MM-DDTHH:MM');
            }

            return true;
        }),

    // Validate the 'password' field
    body('password')
        .isString()
];

export const loadMediaValidationRules = [
    // Ensure only allowed fields are present
    (req: Request, res: Response, next: Function) => {
        const requestBody: Record<string, any> = req.body;

        const extraFields = Object.keys(requestBody).filter((field) => !loadMediaAllowedFields.includes(field));
        if (extraFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
        }
        next();
    },

    // Validate the 'media' field
    body('media')
        .isArray()
        .custom((value: string[]) => {
            for (const item of value) {
                if (typeof item !== 'string') {
                    throw new Error('media must be an array of strings');
                }
            }
            return true;
        }),

    // Validate the 'password' field
    body('password')
        .isString()
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    // Run validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
