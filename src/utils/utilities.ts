import { SelectedMedia } from "../models/selectedMedia";

export function getRandomMedia(objects: SelectedMedia[]): SelectedMedia {
    const randomIndex = Math.floor(Math.random() * objects.length);
    return objects[randomIndex];
}

export function keyNormalizer(key: string): string {
    return key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

export function deepCopy<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) {
        return obj; // primitive value or null
    }

    if (Array.isArray(obj)) {
        return obj.map(deepCopy) as T; // array
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = deepCopy(value); // object
    }

    return result as T;
}

