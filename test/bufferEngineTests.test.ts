import { expect } from 'chai';
import * as bufferEng from '../src/bufferEngine';
import { TranslatedTags } from '../src/bufferEngine';
import { TranslationTag } from '../models/translationTag';
import { Media } from '../models/media';
import { Short } from '../models/short';
import { Music } from '../models/music';
import { Commercial } from '../models/commercial';
import { Promo } from '../models/promo';

const translationTags = [
    new TranslationTag('Tag1', ['TranslatedTag1', 'TranslatedTag2']),
    new TranslationTag('Tag2', ['TranslatedTag3']),
    // Add more translationTags as needed for specific test cases
];

let translatedTags = new TranslatedTags(
    ['80s', '90s'],
    ['Tag4', 'Tag5', 'Tag6'],
    ['TranslatedTag1', 'TranslatedTag2', 'TranslatedTag3']);

let short1 = new Short('short1.mp4', 120, 'TypeA', ['Tag1']);
let short2 = new Short('short2.mp4', 90, 'TypeB', ['Tag1', 'Tag3']);
let short3 = new Short('short3.mp4', 180, 'TypeA', ['Tag1', 'Tag2', 'Tag3', 'Tag4']);
let short4 = new Short('short4.mp4', 160, 'TypeA', ['Tag2', 'Tag3', 'Tag4']);
let specificShortList: Short[] = [short1, short2, short3, short4];

let shortList: Short[] = generateShortList(
    ['Tag5', 'Tag6', 'Tag7'],
    13
);


let music1 = new Music('music1.mp4', 120, 'TypeA', ['Tag1']);
let music2 = new Music('music2.mp4', 90, 'TypeB', ['Tag1', 'Tag3']);
let music3 = new Music('music3.mp4', 180, 'TypeA', ['Tag1', 'Tag2', 'Tag3', 'Tag4']);
let music4 = new Music('music4.mp4', 160, 'TypeA', ['Tag2', 'Tag3', 'Tag4']);


let specificMusicList: Music[] = [music1, music2, music3, music4];

let musicList: Music[] = generateMusicList(
    ['Tag5', 'Tag6', 'Tag7'],
    34
);

let commercial1 = new Commercial('commercial1.mp4', 120, 'TypeA', ['Tag1']);
let commercial2 = new Commercial('commercial2.mp4', 90, 'TypeB', ['Tag1', 'Tag3']);
let commercial3 = new Commercial('commercial3.mp4', 180, 'TypeA', ['Tag1', 'Tag2', 'Tag3', 'Tag4']);
let commercial4 = new Commercial('commercial4.mp4', 160, 'TypeA', ['Tag2', 'Tag3', 'Tag4']);
let commercial5 = new Commercial('commercial5.mp4', 110, 'TypeA', ['TagZ']);
let specificCommercialList: Commercial[] = [commercial1, commercial2, commercial3, commercial4, commercial5];

let commercialList: Commercial[] = generateCommercialList(
    ['Tag5', 'Tag6', 'Tag7'],
    [
        [10, 1], [14, 2], [15, 10], [26, 1],
        [27, 1], [29, 17], [30, 118], [31, 8],
        [32, 6], [33, 4], [34, 3], [35, 1],
        [37, 1], [38, 1], [39, 1], [40, 1],
        [41, 1], [42, 1], [45, 2], [60, 4],
        [62, 1], [69, 1]
    ]
);



const specificMediaData: Media = new Media(
    [/* Show data */],
    [/* Movie data */],
    [
        ...specificShortList
    ],
    [
        ...specificMusicList
    ],
    [/* Promo data */],
    [
        ...specificCommercialList

    ],
    [/* Collection data */]
);


const mediaData: Media = new Media(
    [/* Show data */],
    [/* Movie data */],
    [
        ...shortList
    ],
    [
        ...musicList
    ],
    [/* Promo data */],
    [
        ...commercialList

    ],
    [/* Collection data */]
);

describe('tagTranslator function', () => {
    it('should translate and categorize tags correctly', () => {

        let tags = ['Tag1', 'Tag2', 'Tag3', '80s', '90s'];

        let translatedTags = bufferEng.tagTranslator(tags, translationTags);

        expect(translatedTags).to.be.an.instanceOf(TranslatedTags);
        expect(translatedTags.EraTags).to.deep.equal(['80s', '90s']);
        expect(translatedTags.MainTags).to.deep.equal(['Tag1', 'Tag2', 'Tag3']);
        expect(translatedTags.SecondaryTags).to.deep.equal(['TranslatedTag1', 'TranslatedTag2', 'TranslatedTag3']);
    });

    it('should handle empty tags array correctly', () => {

        const tags = [];

        const translatedTags = bufferEng.tagTranslator(tags, translationTags);

        expect(translatedTags).to.be.an.instanceOf(TranslatedTags);
        expect(translatedTags.EraTags).to.be.empty;
        expect(translatedTags.MainTags).to.be.empty;
        expect(translatedTags.SecondaryTags).to.be.empty;
    });

});


describe('getTagShorts function', () => {

    it('should return shorts with matching tags and duration', () => {

        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Short[] = bufferEng.getTagShorts(duration, specificMediaData, tags, prevBuff);
        let shorts = [short1, short2]

        expect(result).to.be.an('array').with.lengthOf(2);
        expect(result).to.deep.equal(shorts);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return shorts with matching tags and duration', () => {

        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [short2], [], [], [], []);

        const result: Short[] = bufferEng.getTagShorts(duration, specificMediaData, tags, prevBuff);
        let shorts = [short1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(shorts);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching shorts are found', () => {
        // Test case inputs
        const duration = 120;
        const tags = ['TagE', 'TagF']; // Tags not present in the sample data
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Short[] = bufferEng.getTagShorts(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching shorts exceed the duration', () => {

        const duration = 120;
        const tags = ['Tag4'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Short[] = bufferEng.getTagShorts(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('getTagMusic function', () => {

    it('should return music with matching tags and duration', () => {

        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Music[] = bufferEng.getTagMusic(duration, specificMediaData, tags, prevBuff);
        let music = [music1, music2]

        expect(result).to.be.an('array').with.lengthOf(2);
        expect(result).to.deep.equal(music);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });


    it('should return music with matching tags and duration', () => {

        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [music2], [], [], []);

        const result: Music[] = bufferEng.getTagMusic(duration, specificMediaData, tags, prevBuff);
        let music = [music1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(music);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching music is found', () => {
        const duration = 120;
        const tags = ['TagE', 'TagF']; // Tags not present in the sample data
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Music[] = bufferEng.getTagMusic(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching music exceed the duration', () => {
        const duration = 120;
        const tags = ['Tag4'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Music[] = bufferEng.getTagMusic(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('getTagCommercials function', () => {

    it('should return commercials with matching tags and duration', () => {

        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Commercial[] = bufferEng.getTagCommercials(duration, specificMediaData, tags, prevBuff);
        let commericials = [commercial1, commercial2]

        expect(result).to.be.an('array').with.lengthOf(2);
        expect(result).to.deep.equal(commericials);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return commercials with matching tags and duration', () => {
        const duration = 150;
        const tags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [commercial2], []);

        const result: Commercial[] = bufferEng.getTagCommercials(duration, specificMediaData, tags, prevBuff);
        let commericials = [commercial1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(commericials);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching commercials are found', () => {

        const duration = 120;
        const tags = ['TagE', 'TagF'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Commercial[] = bufferEng.getTagCommercials(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching commercials exceed the duration', () => {

        const duration = 120;
        const tags = ['Tag4'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Commercial[] = bufferEng.getTagCommercials(duration, specificMediaData, tags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('getBufferMusic function', () => {

    it('should return music with matching tags and duration', () => {
        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Music[] = bufferEng.getBufferMusic(duration, specificMediaData, translatedTags, prevBuff);
        let music = [music1, music2]

        expect(result).to.be.an('array').with.lengthOf(2);
        expect(result).to.deep.equal(music);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });


    it('should return music with matching tags and duration', () => {

        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [music2], [], [], []);

        const result: Music[] = bufferEng.getBufferMusic(duration, specificMediaData, translatedTags, prevBuff);
        let music = [music1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(music);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching music is found', () => {
        const duration = 120;
        translatedTags.MainTags = ['TagE', 'TagF'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Music[] = bufferEng.getBufferMusic(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching music exceed the duration', () => {
        const duration = 120;
        translatedTags.MainTags = ['Tag4'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Music[] = bufferEng.getBufferMusic(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('getBufferShorts function', () => {

    it('should return shorts with matching tags and duration', () => {
        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Short[] = bufferEng.getBufferShorts(duration, specificMediaData, translatedTags, prevBuff);
        let shorts = [short1, short2]

        expect(result).to.be.an('array').with.lengthOf(2);
        expect(result).to.deep.equal(shorts);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });


    it('should return shorts with matching tags and duration', () => {

        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        const prevBuff = new Media([], [], [short2], [], [], [], []);

        const result: Short[] = bufferEng.getBufferShorts(duration, specificMediaData, translatedTags, prevBuff);
        let shorts = [short1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(shorts);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching shorts are found', () => {
        const duration = 120;
        translatedTags.MainTags = ['TagE', 'TagF'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Short[] = bufferEng.getBufferShorts(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching music exceed the duration', () => {
        const duration = 120;
        translatedTags.MainTags = ['Tag4'];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Short[] = bufferEng.getBufferShorts(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('getBufferCommercials function', () => {

    it('should return commercials with matching tags and duration', () => {
        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        translatedTags.SecondaryTags = ['TagZ']

        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Commercial[] = bufferEng.getBufferCommercials(duration, specificMediaData, translatedTags, prevBuff);
        let commercials = [commercial1, commercial2, commercial5]

        expect(result).to.be.an('array').with.lengthOf(3);
        expect(result).to.deep.equal(commercials);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });


    it('should return commercials with matching tags and duration', () => {

        const duration = 150;
        translatedTags.MainTags = ['Tag1', 'Tag3'];
        translatedTags.SecondaryTags = ['TagZ']
        const prevBuff = new Media([], [], [], [], [], [commercial2, commercial5], []);

        const result: Commercial[] = bufferEng.getBufferCommercials(duration, specificMediaData, translatedTags, prevBuff);
        let commercials = [commercial1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(commercials);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when no matching commercials are found', () => {
        const duration = 120;
        translatedTags.MainTags = ['TagE', 'TagF'];
        translatedTags.SecondaryTags = [];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Commercial[] = bufferEng.getBufferCommercials(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching music exceed the duration', () => {
        const duration = 120;
        translatedTags.MainTags = ['Tag4'];
        translatedTags.SecondaryTags = [];
        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Commercial[] = bufferEng.getBufferCommercials(duration, specificMediaData, translatedTags, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('hasCommercialsUnderDuration function', () => {

    it('should return true when commercials are under the given duration and not already selected', () => {
        const duration = 150;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasCommercialsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.true;
    });

    it('should return false when all commercials under the given duration are already selected', () => {
        const duration = 60;

        const selectedMedia = new Media([], [], [], [], [], [...commercialList], []);

        const result: boolean = bufferEng.hasCommercialsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });


    it('should return false when there are no commercials under the given duration', () => {
        const duration = 9;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasCommercialsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });

});

describe('hasShortsUnderDuration function', () => {

    it('should return true when shorts are under the given duration and not already selected', () => {
        const duration = 901;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasShortsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.true;
    });

    it('should return false when all shorts under the given duration are already selected', () => {
        const duration = 901;

        const selectedMedia = new Media([], [], [...shortList], [], [], [], []);

        const result: boolean = bufferEng.hasShortsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });


    it('should return false when there are no shorts under the given duration', () => {
        const duration = 79;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasShortsUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });

});

describe('hasMusicUnderDuration function', () => {

    it('should return true when music is under the given duration and not already selected', () => {
        const duration = 361;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasMusicUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.true;
    });

    it('should return false when all music under the given duration are already selected', () => {
        const duration = 361;

        const selectedMedia = new Media([], [], [], [...musicList], [], [], []);

        const result: boolean = bufferEng.hasMusicUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });


    it('should return false when there is no music under the given duration', () => {
        const duration = 104;
        const selectedMedia = new Media([], [], [], [], [], [], []);

        const result: boolean = bufferEng.hasMusicUnderDuration(duration, mediaData, selectedMedia);

        expect(result).to.be.false;
    });

});

describe('getCommercials function', () => {

    it('should return not previously selected commercials with less than or equal duration', () => {
        const duration = 150;

        const prevBuff = new Media([], [], [], [], [], [], []);


        const result: Commercial[] = bufferEng.getCommercials(duration, specificMediaData, prevBuff);
        let commercials = [commercial1, commercial2, commercial5]

        expect(result).to.be.an('array').with.lengthOf(3);
        expect(result).to.deep.equal(commercials);
        for (const commercial of result) {
            expect(commercial.Duration).to.be.lessThanOrEqual(duration);
        }

    });


    it('should return not previously selected commercials with less than or equal duration', () => {

        const duration = 150;
        const prevBuff = new Media([], [], [], [], [], [commercial2, commercial5], []);

        const result: Commercial[] = bufferEng.getCommercials(duration, specificMediaData, prevBuff);
        let commercials = [commercial1]

        expect(result).to.be.an('array').with.lengthOf(1);
        expect(result).to.deep.equal(commercials);
        for (const short of result) {
            expect(short.Duration).to.be.lessThanOrEqual(duration);
        }

    });

    it('should return an empty array when all commercials have already been selected', () => {
        const duration = 120;
        const prevBuff = new Media([], [], [], [], [], [...specificMediaData.Commercials], []);

        const result: Commercial[] = bufferEng.getCommercials(duration, specificMediaData, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an empty array when all matching music exceed the duration', () => {
        const duration = 20;

        const prevBuff = new Media([], [], [], [], [], [], []);

        const result: Commercial[] = bufferEng.getCommercials(duration, specificMediaData, prevBuff);

        expect(result).to.be.an('array').that.is.empty;
    });
});

describe('selectCommercial function', () => {
    it('should return a single commercial within duration', () => {
        let duration = 120;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let taggedMedia = new Media([], [], [], [], [], generateCommercialList(
            ['Test'],
            [
                [30, 118]
            ]
        ), []);

        let result: [Commercial, number] = bufferEng.selectCommercial(duration, taggedMedia, mediaData, prevBuff);
        expect(result[1]).to.be.lessThanOrEqual(30);

    });

    it('should return a full duration commercial if available', () => {
        let duration = 45;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [/* Promo data */],
            [
                new Commercial('commercial6.mp4', 45, 'TypeA', ['TagZ']),
                new Commercial('commercial7.mp4', 30, 'TypeA', ['TagZ']),
                ...specificCommercialList
            ],
            [/* Collection data */]
        );

        let result: [Commercial, number] = bufferEng.selectCommercial(duration, tempMedia, mediaData, prevBuff);
        expect(result[1]).to.equal(45);
    });

    it('should return a untagged commercial when no tagged commercial is available', () => {
        let duration = 120;
        let tempCommercialList: Commercial[] = [
            new Commercial('commercial6.mp4', 45, 'TypeA', ['TagZ']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['TagZ']),
            ...specificCommercialList
        ]
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 118],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let tempSpecificMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [/* Promo data */],
            [
                ...tempCommercialList
            ],
            [/* Collection data */]
        );

        let result: [Commercial, number] = bufferEng.selectCommercial(duration, tempSpecificMedia, tempMedia, tempSpecificMedia);

        expect(result[0].Tags).to.deep.equal(['Test']);
        expect(result[1]).to.equal(30);

    });

    it('should return a full duration untagged commercial when no tagged commercial is available', () => {
        let duration = 45;
        let tempCommercialList: Commercial[] = [
            new Commercial('commercial6.mp4', 45, 'TypeA', ['TagZ']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['TagZ']),
            ...specificCommercialList
        ]
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 118],
                        [45, 1],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let tempSpecificMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [/* Promo data */],
            [
                ...tempCommercialList
            ],
            [/* Collection data */]
        );

        let result: [Commercial, number] = bufferEng.selectCommercial(duration, tempSpecificMedia, tempMedia, tempSpecificMedia);

        expect(result[0].Tags).to.deep.equal(['Test']);
        expect(result[1]).to.equal(45);

    });
});

describe('selectMusicOrShort function', () => {
    it('should return a single commercial within duration', () => {
        let duration = 901;

        let prevBuff = new Media([], [], [], [], [], [], []);

        let result: [(Music | Short), number] = bufferEng.selectMusicOrShort(duration, mediaData, prevBuff);
        expect(result[1]).to.be.lessThanOrEqual(901);
    });
});

describe('selectBuffer function', () => {
    it('should return the standard buffer', () => {
        let duration = 240;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 20],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        expect(result[0]).to.be.an('array').with.lengthOf(5);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');
        expect(result[1]).to.equal(0);
    });

    it('should return the standard buffer with previous selected commercials ', () => {
        let duration = 240;
        let prevCommercials: Commercial[] = [
            new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
        ]

        let prevBufferShorts: Short[] = [
            new Short('short1.mp4', 120, 'Short', ['Test']),
            new Short('short2.mp4', 120, 'Short', ['Test']),
        ]

        let prevBufferCommercials: Commercial[] = [
            new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial5.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial6.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial8.mp4', 30, 'TypeA', ['Test']),
        ];

        let commercialSelection: Commercial[] = [
            new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial5.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial6.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial8.mp4', 30, 'TypeA', ['Test']),
        ]

        let prevBuff = new Media(
            [],
            [],
            [
                new Short('short1.mp4', 120, 'Short', ['Test'])
            ],
            [],
            [],
            [
                new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
            ],
            []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [
                new Short('short1.mp4', 120, 'Short', ['Test']),
                new Short('short2.mp4', 120, 'Short', ['Test']),
            ],
            [],
            [/* Promo data */],
            [
                new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial5.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial6.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial7.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial8.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial9.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial10.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial11.mp4', 30, 'TypeA', ['Test']),
                new Commercial('commercial12.mp4', 30, 'TypeA', ['Test']),
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];
        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        if (result[0].length != 5) {
            console.log("blah")
        }
        const usedPrevBufferComm = prevCommercials.some((itemB: Commercial) => {
            // Use the appropriate criteria to check for a match in List A.
            // For example, if the 'Path' property is unique to Commercial objects:
            return result[0].some((itemA) => {
                if (itemA instanceof Commercial) {
                    return itemA.Path === itemB.Path;
                }
                return false;
            });
        });

        if (usedPrevBufferComm === true) {
            console.log("blah")
        }

        expect(result[0]).to.be.an('array').with.lengthOf(5);
        expect(usedPrevBufferComm).to.be.false;
        expect(result[0][4]).to.deep.equal(new Short('short2.mp4', 120, 'Short', ['Test']));
        expect(result[1]).to.equal(0);
    });

    it('should return the only commercials when no shorts or music available', () => {
        let duration = 240;

        let commercialSelection: Commercial[] = [
            new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial5.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial6.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial8.mp4', 30, 'TypeA', ['Test']),
        ]

        let prevBuff = new Media(
            [],
            [],
            [
            ],
            [],
            [],
            [
            ],
            []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [

            ],
            [],
            [/* Promo data */],
            commercialSelection,
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        expect(result[0]).to.be.an('array').with.lengthOf(8);
        expect(result[0][0]).to.be.instanceOf(Commercial);
        expect(result[0][1]).to.be.instanceOf(Commercial);
        expect(result[0][2]).to.be.instanceOf(Commercial);
        expect(result[0][3]).to.be.instanceOf(Commercial);
        expect(result[0][4]).to.be.instanceOf(Commercial);
        expect(result[0][5]).to.be.instanceOf(Commercial);
        expect(result[0][6]).to.be.instanceOf(Commercial);
        expect(result[0][7]).to.be.instanceOf(Commercial);
        expect(result[1]).to.equal(0);
    });

    it('should return the only commercials when shorts or music are over duration', () => {
        let duration = 240;

        let commercialSelection: Commercial[] = [
            new Commercial('commercial1.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial2.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial3.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial4.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial5.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial6.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial7.mp4', 30, 'TypeA', ['Test']),
            new Commercial('commercial8.mp4', 30, 'TypeA', ['Test']),
        ]

        let prevBuff = new Media(
            [],
            [],
            [
            ],
            [],
            [],
            [
            ],
            []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [
                new Short('short1.mp4', 121, 'Short', ['Test']),
            ],
            [
                new Music('music1.mp4', 121, 'Music', ['Test']),
            ],
            [/* Promo data */],
            commercialSelection,
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        expect(result[0]).to.be.an('array').with.lengthOf(8);
        expect(result[0][0]).to.be.instanceOf(Commercial);
        expect(result[0][1]).to.be.instanceOf(Commercial);
        expect(result[0][2]).to.be.instanceOf(Commercial);
        expect(result[0][3]).to.be.instanceOf(Commercial);
        expect(result[0][4]).to.be.instanceOf(Commercial);
        expect(result[0][5]).to.be.instanceOf(Commercial);
        expect(result[0][6]).to.be.instanceOf(Commercial);
        expect(result[0][7]).to.be.instanceOf(Commercial);
        expect(result[1]).to.equal(0);
    });

    it('should fill gaps with untagged commercials', () => {
        let duration = 240;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 2],
                    ]
                ),
                ...generateCommercialList(
                    ['Test2'],
                    [
                        [30, 15],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        let tempUntaggedCommercials = result[0].filter((item: Commercial) => {
            return item.Tags.some((tag: string) => {
                return tag === 'Test2';
            });
        });

        expect(result[0]).to.be.an('array').with.lengthOf(5);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');
        expect(result[1]).to.equal(0);
        expect(tempUntaggedCommercials.length).to.equal(2);
    });

    it('should return the buffer with a remainder', () => {
        let duration = 240;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [29, 20],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        expect(result[0]).to.be.an('array').with.lengthOf(5);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');
        expect(result[1]).to.equal(4);
    });

    it('should return a long standard buffer', () => {
        let duration = 480;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 20],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        expect(result[0]).to.be.an('array').with.lengthOf(10);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');

        expect(result[0][5]).to.be.an.instanceof(Commercial)
        expect(result[0][6]).to.be.an.instanceof(Commercial)
        expect(result[0][7]).to.be.an.instanceof(Commercial)
        expect(result[0][8]).to.be.an.instanceof(Commercial)
        expect(result[0][9]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');
        expect(result[1]).to.equal(0);
        expect(result[0][4]).to.not.equal(result[0][9]);
    });

    it('should fill gaps with untagged commercials with remainder', () => {
        let duration = 240;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 2],
                    ]
                ),
                ...generateCommercialList(
                    ['Test2'],
                    [
                        [29, 15],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        let tempUntaggedCommercials = result[0].filter((item: Commercial) => {
            return item.Tags.some((tag: string) => {
                return tag === 'Test2';
            });
        });

        expect(result[0]).to.be.an('array').with.lengthOf(5);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.satisfy((value: any) => {
            return value instanceof Music || value instanceof Short;
        }, 'Expected result to be an instance of Music or Short');
        expect(result[1]).to.equal(2);
        expect(tempUntaggedCommercials.length).to.equal(2);
    });

    it('should fill gaps with untagged commercials with remainder', () => {
        let duration = 240;

        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [new Short('short1.mp4', 120, 'Short', ['Test2']),
            ],
            [new Music('music1.mp4', 120, 'Music', ['Test2'])],
            [/* Promo data */],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 2],
                    ]
                ),
                ...generateCommercialList(
                    ['Test2'],
                    [
                        [29, 15],
                    ]
                )
            ],
            [/* Collection data */]
        );


        translatedTags.MainTags = ['Test'];
        translatedTags.SecondaryTags = [];

        let result: [(Commercial | Music | Short)[], number] = bufferEng.selectBuffer(duration, tempMedia, translatedTags, prevBuff);

        let tempUntaggedCommercials = result[0].filter((item: Commercial) => {
            return item.Tags.some((tag: string) => {
                return tag === 'Test2';
            });
        });

        expect(result[0]).to.be.an('array').with.lengthOf(8);
        expect(result[0][0]).to.be.an.instanceof(Commercial)
        expect(result[0][1]).to.be.an.instanceof(Commercial)
        expect(result[0][2]).to.be.an.instanceof(Commercial)
        expect(result[0][3]).to.be.an.instanceof(Commercial)
        expect(result[0][4]).to.be.an.instanceof(Commercial)
        expect(result[0][5]).to.be.an.instanceof(Commercial)
        expect(result[0][6]).to.be.an.instanceof(Commercial)
        expect(result[0][7]).to.be.an.instanceof(Commercial)
        expect(result[1]).to.equal(6);
        expect(tempUntaggedCommercials.length).to.equal(6);
    });
});

describe('createBuffer function', () => {
    it('basic buffer block', () => {
        // Buffer A / Promo / Buffer B
        let duration = 255;
        let options = {
            env: "test",
        }

        let precTags = ['Test'];
        let subTags = ['Test'];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 118],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 6 || result[0].length === 9;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 6) {
            correctPromoPlacement = result[0][1] instanceof Promo || result[0][4] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][4] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;
        expect(result[1]).to.equal(0);
    });

    it('basic buffer block with remainder', () => {
        // Buffer A / Promo / Buffer B
        let duration = 255;
        let options = {
            env: "test",
        }

        let precTags = ['Test'];
        let subTags = ['Test'];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(

                    ['Test'],
                    [
                        [29, 118],
                        [120, 1]
                    ])
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 6 || result[0].length === 9;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 6) {
            correctPromoPlacement = result[0][1] instanceof Promo || result[0][4] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][4] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;
        let correctRemainder = result[1] === 4 || result[1] === 8;
        expect(correctRemainder).to.be.true;
    });

    it('stream start', () => {
        // Buffer A / Promo
        let duration = 255;
        let options = {
            env: "test",
        }

        let precTags = [];
        let subTags = ['Test'];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 118],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 6 || result[0].length === 9;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 6) {
            correctPromoPlacement = result[0][5] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][8] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;
        expect(result[1]).to.equal(0);
    });

    it('stream start with remainder', () => {
        // Buffer A / Promo / Buffer B
        let duration = 255;
        let options = {
            env: "test",
        }

        let precTags = [];
        let subTags = ['Test'];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(

                    ['Test'],
                    [
                        [29, 118],
                        [120, 1]
                    ])
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 6 || result[0].length === 9;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 6) {
            correctPromoPlacement = result[0][5] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][8] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;

        let correctRemainder = result[1] === 4 || result[1] === 8;
        expect(correctRemainder).to.be.true;
    });

    it('stream end', () => {
        // Promo / Buffer A / Promo
        let duration = 270;
        let options = {
            env: "test",
        }

        let precTags = ['Test'];
        let subTags = [];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [30, 118],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 7 || result[0].length === 10;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 7) {
            correctPromoPlacement = result[0][0] instanceof Promo && result[0][6] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][0] instanceof Promo && result[0][9] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;
        expect(result[1]).to.equal(0);
    });

    it('stream end with remainder', () => {
        // Promo / Buffer A / Promo
        let duration = 270;
        let options = {
            env: "test",
        }

        let precTags = ['Test'];
        let subTags = [];
        let prevBuff = new Media([], [], [], [], [], [], []);
        let tempMedia: Media = new Media(
            [/* Show data */],
            [/* Movie data */],
            [/* Short data */],
            [/* Music data */],
            [new Promo(15, 'promo1.mp4', ["test"])],
            [
                ...generateCommercialList(
                    ['Test'],
                    [
                        [29, 118],
                        [120, 1]
                    ]
                )
            ],
            [/* Collection data */]
        );

        let result: [(Commercial | Music | Short | Promo)[], number] = bufferEng
            .createBuffer(duration, options, tempMedia, precTags, subTags, translationTags, prevBuff);

        let correctLength = result[0].length === 7 || result[0].length === 10;
        expect(correctLength).to.be.true;

        let correctPromoPlacement: boolean = false;
        if (result[0].length === 7) {
            correctPromoPlacement = result[0][0] instanceof Promo && result[0][6] instanceof Promo;
        } else {
            correctPromoPlacement = result[0][0] instanceof Promo && result[0][9] instanceof Promo;
        }
        expect(correctPromoPlacement).to.be.true;

        let correctRemainder = result[1] === 4 || result[1] === 8;
        expect(correctRemainder).to.be.true;
    });
});

function getRandomTags(tagList: string[]): string[] {
    const selectedTags: string[] = [];
    const numberOfTags = Math.floor(Math.random() * tagList.length) + 1; // Select random number of tags (at least 1)

    // Create a copy of the tagList
    const copyTagList = [...tagList];

    for (let i = 0; i < numberOfTags; i++) {
        const randomIndex = Math.floor(Math.random() * copyTagList.length);
        const randomTag = copyTagList[randomIndex];
        selectedTags.push(randomTag);

        // Remove the selected tag from the copyTagList to ensure it is not selected again
        copyTagList.splice(randomIndex, 1);
    }

    return selectedTags;
}

function generateCommercialList(tagList: string[], durationsWithCount: [number, number][]): Commercial[] {

    let commercials: Commercial[] = [];
    let pathCounter = 1;

    for (let [duration, count] of durationsWithCount) {
        for (let i = 0; i < count; i++) {
            let path = `commercial_${pathCounter}.mp4`;
            pathCounter++;

            let selectedTags = getRandomTags(tagList)
            commercials.push(new Commercial(path, duration, 'Commercial', selectedTags));
        }
    }

    return commercials;
}

function generateMusicList(tagList: string[], count: number): Music[] {

    let music: Music[] = [];
    let pathCounter = 1;

    for (let i = 0; i < count; i++) {
        let path = `music_${pathCounter}.mp4`;
        pathCounter++;

        let selectedTags = getRandomTags(tagList)
        music.push(new Music(path, Math.floor(Math.random() * (360 - 105 + 1)) + 105, 'Music', selectedTags));
    }

    return music;
}

function generateShortList(tagList: string[], count: number): Short[] {

    let music: Short[] = [];
    let pathCounter = 1;

    for (let i = 0; i < count; i++) {
        let path = `music_${pathCounter}.mp4`;
        pathCounter++;

        let selectedTags = getRandomTags(tagList)
        music.push(new Short(path, Math.floor(Math.random() * (900 - 80 + 1)) + 80, 'Short', selectedTags));
    }

    return music;
}