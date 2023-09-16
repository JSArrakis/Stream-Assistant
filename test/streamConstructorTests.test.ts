import { expect } from 'chai';
import { Media } from '../models/media';
import * as streamConstructor from "../src/streamConstructor";
import { Config } from '../models/config';
import { StagedMedia } from '../models/stagedMedia';
import { MediaType } from '../models/enum/mediaTypes';
import { SelectedMedia } from '../models/selectedMedia';
import { Bumper } from '../models/bumper';
import { CollectionShow, Collection } from '../models/collection';
import { Movie } from '../models/movie';
import { Episode, Show } from '../models/show';
import { TranslationTag } from '../models/translationTag';
import { Commercial } from '../models/commercial';

let episode1 = new Episode(1, 1, 1, "", "episode1", "episode1", 1648, 1800, [])
let episode2 = new Episode(1, 2, 2, "", "episode2", "episode2", 1709, 1800, [])
let episode3 = new Episode(1, 3, 3, "", "episode3", "episode3", 1603, 1800, [])
let episode4 = new Episode(1, 4, 4, "", "episode4", "episode4", 1600, 1800, [])
let episode5a = new Episode(1, 5, 5, "", "episode5", "episode5", 1699, 1800, [])
let episode5b = new Episode(1, 5, 5, "", "episode5", "episode5", 2703, 3600, [])

let show1 = new Show("Show1", "show1", "alias", "imdb", 1800, false, ["tag1", "tag5", "tag4"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show2 = new Show("Show2", "show2", "alias", "imdb", 1800, false, ["tag2", "tag5"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show3 = new Show("Show3", "show3", "alias", "imdb", 1800, false, ["tag5"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show4 = new Show("Show4", "show4", "alias", "imdb", 1800, false, ["tag4", "tag6"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show5 = new Show("Show5", "show5", "alias", "imdb", 1800, true, ["tag6", "tag7"], [], 5, [episode1, episode2, episode3, episode4, episode5b])
let showList = [show1, show2, show3, show4, show5]

let collShow1 = new CollectionShow(
    "show1", 1, 1, 1800, undefined, undefined, undefined
)
let collShow2 = new CollectionShow(
    "show2", 2, 1, 1800, undefined, undefined, undefined
)
let collShow3 = new CollectionShow(
    "show3", 3, 1, 1800, undefined, undefined, undefined
)
let collShow4 = new CollectionShow(
    "show4", 4, 1, 1800, undefined, undefined, undefined
)

let collection1 = new Collection(
    "collection1",
    "collection1",
    "",
    7200,
    7200,
    ["tag4"],
    new Bumper("", 1, "", "b", []),
    new Bumper("", 1, "", "b", []),
    [],
    [collShow1, collShow2, collShow3, collShow4],
    ""
)

let testMovie1 = new Movie(
    "Test1",
    "test1",
    "test1",
    "",
    ["tag1", "tag2", "tag3"],
    "pathToTest1",
    6451,
    7200,
    "",
    0
);

let testMovie2 = new Movie(
    "Test2",
    "test2",
    "test2",
    "",
    ["tag1", "tag2"],
    "pathToTest2",
    6351,
    7200,
    "",
    0
);

let testMovie3 = new Movie(
    "Test3",
    "test3",
    "test3",
    "",
    ["tag2", "tag3"],
    "pathToTest3",
    7000,
    7200,
    "",
    0
);

let testMovie4 = new Movie(
    "Test4",
    "test4",
    "test4",
    "",
    ["tag5"],
    "pathToTest4",
    7000,
    7200,
    "",
    0
);

let testMovie5 = new Movie(
    "Test5",
    "test5",
    "test5",
    "",
    ["tag3"],
    "pathToTest5",
    7000,
    7200,
    "",
    0
);

let testMovie6 = new Movie(
    "Test6",
    "test6",
    "test6",
    "",
    ["tag4"],
    "pathToTest6",
    7000,
    7200,
    "",
    0
);

let testMovie7 = new Movie(
    "Test7",
    "test7",
    "test7",
    "",
    ["tag4"],
    "pathToTest7",
    7000,
    7200,
    "",
    0
);

let testMovie8 = new Movie(
    "Test8",
    "test8",
    "test8",
    "",
    ["tag3"],
    "pathToTest8",
    7000,
    7200,
    "",
    0
);

let testMovie9 = new Movie(
    "Test9",
    "test9",
    "test9",
    "",
    ["tag3"],
    "pathToTest9",
    7000,
    7200,
    "",
    0
);

let testMovie10 = new Movie(
    "Test10",
    "test10",
    "test10",
    "",
    ["tag3"],
    "pathToTest10",
    7000,
    7200,
    "",
    0
);

let injectedMedia1 = new SelectedMedia(
    testMovie6,
    "",
    MediaType.Movie,
    0,
    7200,
    ["tag4", "injected"]
);

let injectedMedia2 = new SelectedMedia(
    testMovie7,
    "",
    MediaType.Movie,
    0,
    7200,
    ["tag4", "injected"]
);

let injectedMedia3 = new SelectedMedia(
    testMovie10,
    "",
    MediaType.Movie,
    0,
    7200,
    ["tag4", "injected"]
);

let scheduledMedia1 = new SelectedMedia(
    testMovie1,
    "",
    MediaType.Movie,
    100000,
    7200,
    ["tag1", "tag2", "tag3"]
);
let scheduledMedia2 = new SelectedMedia(
    testMovie3,
    "",
    MediaType.Movie,
    107200,
    7200,
    ["tag2", "tag3"]
);
let scheduledMedia3 = new SelectedMedia(
    testMovie5,
    "",
    MediaType.Movie,
    114400,
    7200,
    ["tag4"]
);
let scheduledMedia4 = new SelectedMedia(
    testMovie2,
    "",
    MediaType.Movie,
    121600,
    7200,
    ["tag1", "tag2"]
);

let scheduledMedia5 = new SelectedMedia(
    testMovie6,
    "",
    MediaType.Movie,
    128800,
    7200,
    ["tag1", "tag2"]
);

let stagedMediaNoProc: StagedMedia = new StagedMedia(
    [
        new SelectedMedia(
            testMovie1,
            "",
            MediaType.Movie,
            100000,
            7200,
            ["tag1", "tag2", "tag3"]
        ),
        new SelectedMedia(
            testMovie3,
            "",
            MediaType.Movie,
            107200,
            7200,
            ["tag2", "tag3"]
        ),
        new SelectedMedia(
            collection1,
            "",
            MediaType.Collection,
            114400,
            7200,
            ["tag4"]
        ),
        new SelectedMedia(
            testMovie2,
            "",
            MediaType.Movie,
            121600,
            7200,
            ["tag1", "tag2"]
        )
    ],
    [],
    128800)

describe('getFirstProceduralDuration function', () => {
    it('should have no initial procedural block duration if start time matches first scheduled media', () => {
        let result = streamConstructor.getFirstProceduralDuration(100000, stagedMediaNoProc)
        expect(result).to.equal(0);
    });

    it('should return a duration based on the gap between "now" and the first scheduled media', () => {
        let result = streamConstructor.getFirstProceduralDuration(0, stagedMediaNoProc)
        expect(result).to.equal(100000);
    });

    it('should make a procedural duration based on the end time if there is no scheduled media', () => {
        let result = streamConstructor.getFirstProceduralDuration(0, new StagedMedia([], [], 100000))
        expect(result).to.equal(100000);
    });
});

describe('setProceduralBlockDurations function', () => {
    it('should return proper initial procedural durations (no pre-buffer)', () => {
        let result = streamConstructor.setProceduralBlockDurations(1800, 7200);
        expect(result.preMediaDuration).to.eq(0);
        expect(result.initialProceduralBlockDuration).to.eq(7200);
    });

    it('should return proper initial procedural durations (pre-buffer)', () => {
        let result = streamConstructor.setProceduralBlockDurations(1800, 8000);
        expect(result.preMediaDuration).to.eq(800);
        expect(result.initialProceduralBlockDuration).to.eq(7200);
    });

    it('should return proper initial procedural durations (only pre-buffer)', () => {
        let result = streamConstructor.setProceduralBlockDurations(1800, 800);
        expect(result.preMediaDuration).to.eq(800);
        expect(result.initialProceduralBlockDuration).to.eq(0);
    });
});

describe('getStagedStream function', () => {
    let media = new Media([show2], [testMovie8, testMovie9, testMovie10], [], [], [], [], []);
    const config: Config = new Config("", "", "", "", "", 0, 1800);
    const options: any = { tagsOR: ["tag1", "tag2", "tag3"] };

    it('should throw an error if start time appears after any scheduled media', () => {
        expect(() => streamConstructor.getStagedStream(100001, config, options, stagedMediaNoProc, media, [])).to.throw("Time of first movie, collection, or selected end time needs to be in the future.");
    });

    it('should not fill procedural media if there are no gaps', () => {
        let result = streamConstructor.getStagedStream(100000, config, options, stagedMediaNoProc, media, []);
        expect(result[0].Time).to.equal(100000);
        expect(result.length).to.equal(4);
    });

    it('should fill the first procedural media block starting at the first procedural time point', () => {
        let tempStagedMedia = new StagedMedia([scheduledMedia1, scheduledMedia2, scheduledMedia3, scheduledMedia4], [], 128800);
        let result = streamConstructor.getStagedStream(98000, config, options, tempStagedMedia, media, []);
        expect(result[0].Time).to.equal(98200);
        expect(result.length).to.equal(5);
        expect(result[0].Type).to.equal(MediaType.Episode);
        expect(result[1].Type).to.equal(MediaType.Movie);
        expect(result[2].Type).to.equal(MediaType.Movie);
        expect(result[3].Type).to.equal(MediaType.Movie);
        expect(result[4].Type).to.equal(MediaType.Movie);
    });

    it('should fill procedural media after last scheduled media', () => {
        let tempStagedMedia = new StagedMedia([scheduledMedia1, scheduledMedia2, scheduledMedia3, scheduledMedia4], [], 130600);
        let result = streamConstructor.getStagedStream(100000, config, options, tempStagedMedia, media, []);
        expect(result[0].Time).to.equal(100000);
        expect(result.length).to.equal(5);
        expect(result[0].Type).to.equal(MediaType.Movie);
        expect(result[1].Type).to.equal(MediaType.Movie);
        expect(result[2].Type).to.equal(MediaType.Movie);
        expect(result[3].Type).to.equal(MediaType.Movie);
        expect(result[4].Type).to.equal(MediaType.Episode);
    });

    it('should fill procedural media in between scheduled media', () => {
        for (let i = 0; i < 20; i++) {
            let tempStagedMedia = new StagedMedia([scheduledMedia1, scheduledMedia3], [], 121600);
            let result = streamConstructor.getStagedStream(100000, config, options, tempStagedMedia, media, []);
            expect(result[0].Time).to.equal(100000);
            let correctResultLength = result.length === 3 || result.length === 6;
            expect(correctResultLength).to.be.true;
            if (result.length === 3) {
                expect(result[0].Type).to.equal(MediaType.Movie);
                expect(result[1].Type).to.equal(MediaType.Movie);
                expect(result[2].Type).to.equal(MediaType.Movie);
            } else {
                expect(result[0].Type).to.equal(MediaType.Movie);
                expect(result[1].Type).to.equal(MediaType.Episode);
                expect(result[2].Type).to.equal(MediaType.Episode);
                expect(result[3].Type).to.equal(MediaType.Episode);
                expect(result[4].Type).to.equal(MediaType.Episode);
                expect(result[5].Type).to.equal(MediaType.Movie);
            }
        }
    });

    it('should fill procedural media until end time if no scheduled media', () => {
        for (let i = 0; i < 100; i++) {
            let tempStagedMedia = new StagedMedia([], [], 114400);
            let result = streamConstructor.getStagedStream(100000, config, options, tempStagedMedia, media, []);
            expect(result[0].Time).to.equal(100000);
            let correctResultLength = result.length === 2 || result.length === 5 || result.length === 8;
            if (result.length === 2) {
                expect(result[0].Type).to.equal(MediaType.Movie);
                expect(result[1].Type).to.equal(MediaType.Movie);
            } else if (result.length === 5) {
                if (result[0].Type === MediaType.Movie) {
                    expect(result[0].Type).to.equal(MediaType.Movie);
                    expect(result[1].Type).to.equal(MediaType.Episode);
                    expect(result[2].Type).to.equal(MediaType.Episode);
                    expect(result[3].Type).to.equal(MediaType.Episode);
                    expect(result[4].Type).to.equal(MediaType.Episode);
                } else if (result[2].Type === MediaType.Episode) {
                    expect(result[0].Type).to.equal(MediaType.Episode);
                    expect(result[1].Type).to.equal(MediaType.Episode);
                    expect(result[2].Type).to.equal(MediaType.Episode);
                    expect(result[3].Type).to.equal(MediaType.Episode);
                    expect(result[4].Type).to.equal(MediaType.Movie);
                } else {
                    expect(result[0].Type).to.equal(MediaType.Episode);
                    expect(result[1].Type).to.equal(MediaType.Episode);
                    expect(result[2].Type).to.equal(MediaType.Movie);
                    expect(result[3].Type).to.equal(MediaType.Episode);
                    expect(result[4].Type).to.equal(MediaType.Episode);
                }
            } else {
                expect(result[0].Type).to.equal(MediaType.Episode);
                expect(result[1].Type).to.equal(MediaType.Episode);
                expect(result[2].Type).to.equal(MediaType.Episode);
                expect(result[3].Type).to.equal(MediaType.Episode);
                expect(result[4].Type).to.equal(MediaType.Episode);
                expect(result[5].Type).to.equal(MediaType.Episode);
                expect(result[6].Type).to.equal(MediaType.Episode);
                expect(result[7].Type).to.equal(MediaType.Episode);
            }
        }
    });

    it('should select injected movies before other movies', () => {
        for (let i = 0; i < 20; i++) {
            let tempStagedMedia = new StagedMedia([scheduledMedia1, scheduledMedia4], [injectedMedia1, injectedMedia2], 128800);
            let result = streamConstructor.getStagedStream(100000, config, options, tempStagedMedia, media, []);
            expect(result[0].Time).to.equal(100000);
            expect(result.length).to.equal(4);
            expect(result[0].Type).to.equal(MediaType.Movie);
            expect(result[1].Type).to.equal(MediaType.Movie);
            expect(result[2].Type).to.equal(MediaType.Movie);
            expect(result[3].Type).to.equal(MediaType.Movie);
            expect(result[1].Tags).to.include("injected");
            expect(result[2].Tags).to.include("injected");
        }
    });

    it('should fill procedural media in gaps of stream duration without selecting previously used movies', () => {
        let tempMedia = new Media([show2], [testMovie10], [], [], [], [], []);
        for (let i = 0; i < 20; i++) {
            let tempStagedMedia = new StagedMedia([scheduledMedia1, scheduledMedia5], [injectedMedia3], 136300);
            let result = streamConstructor.getStagedStream(100000, config, options, tempStagedMedia, media, []);
            expect(result[0].Time).to.equal(100000);
            expect(result.length).to.equal(11);
            expect(result[0].Type).to.equal(MediaType.Movie);
            expect(result[1].Type).to.equal(MediaType.Movie);
            expect(result[2].Type).to.equal(MediaType.Episode);
            expect(result[3].Type).to.equal(MediaType.Episode);
            expect(result[4].Type).to.equal(MediaType.Episode);
            expect(result[5].Type).to.equal(MediaType.Episode);
            expect(result[6].Type).to.equal(MediaType.Episode);
            expect(result[7].Type).to.equal(MediaType.Episode);
            expect(result[8].Tags).to.equal(MediaType.Episode);
            expect(result[9].Tags).to.equal(MediaType.Episode);
            expect(result[10].Type).to.equal(MediaType.Movie);
            expect(result[1].Tags).to.include("injected");
        }
    });

});

// describe('constructStream function', () => {
//     let config = new Config("", "", "", "", "", 0, 1800);
//     const options: any = { tagsOR: ["tag1", "tag2", "tag3"] };
//     let media = new Media([show2], [testMovie10], [], [], [], [...generateCommercialList(
//         ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6'],
//         [
//             [10, 1], [14, 2], [15, 10], [26, 1],
//             [27, 1], [29, 17], [30, 118], [31, 8],
//             [32, 6], [33, 4], [34, 3], [35, 1],
//             [37, 1], [38, 1], [39, 1], [40, 1],
//             [41, 1], [42, 1], [45, 2], [60, 4],
//             [62, 1], [69, 1]
//         ]
//     )], []);
//     const translationTags = [
//         new TranslationTag('Tag1', ['TranslatedTag1', 'TranslatedTag2']),
//         new TranslationTag('Tag2', ['TranslatedTag3']),
//         // Add more translationTags as needed for specific test cases
//     ];

//     it('should return the selected stream with proper buffer content', () => {
//         let result = streamConstructor.constructStream(config, options, media, translationTags, progression, rightNow);
//     });
// });

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
            commercials.push(new Commercial('', duration, path, 'Commercial', selectedTags));
        }
    }

    return commercials;
}