export class TranslationTag {
    Tag: string;
    Translation: string[];

    constructor(tag: string, translation: string[]) {
        this.Tag = tag;
        this.Translation = translation;
    }
}