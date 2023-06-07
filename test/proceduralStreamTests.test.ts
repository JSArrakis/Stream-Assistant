import { expect } from 'chai';
import { MediaType } from "../models/enum/mediaTypes";
import { Config } from "../models/config";
import { Media } from "../models/media";
import { Movie } from "../models/movie";
import { SelectedMedia } from "../models/selectedMedia";
import * as streamConstructor from "../src/streamConstructor";
import * as proceduralEngine from "../src/proceduralEngine";
import { Collection, CollectionShow } from '../models/collection';
import { Bumper } from '../models/bumper';
import { Show, Episode } from '../models/show';
import { MediaProgression, ShowProgression } from '../models/mediaProgression';
import * as utilities from '../src/utilities'
import { deepCopy } from '../src/utilities';
import { StagedMedia } from '../models/stagedMedia';
import * as moment from 'moment';

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
    new Bumper(1, "", []),
    new Bumper(1, "", []),
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

describe('getFirstProceduralDuration function', () => {
    it('should calculate the correct number from first media of scheduled media if present', () => {
        let stagedMedia: StagedMedia = new StagedMedia(
            [
                new SelectedMedia(
                    testMovie1,
                    MediaType.Movie,
                    1685052000,
                    7200,
                    ["tag1", "tag2", "tag3"]
                ),
                new SelectedMedia(
                    testMovie3,
                    MediaType.Movie,
                    1685059200,
                    7200,
                    ["tag2", "tag3"]
                ),
                new SelectedMedia(
                    collection1,
                    MediaType.Collection,
                    1685066400,
                    7200,
                    ["tag4"]
                ),
                new SelectedMedia(
                    testMovie2,
                    MediaType.Movie,
                    1685073600,
                    7200,
                    ["tag1", "tag2"]
                )
            ],
            [],
            1685080800)

        let result = streamConstructor.getFirstProceduralDuration(1685047620, stagedMedia);

        expect(result).to.equal(4380);
    });

    it('should calculate the correct number from set end time if no scheduled media present', () => {
        let stagedMedia: StagedMedia = new StagedMedia(
            [],
            [],
            1685080800)

        let result = streamConstructor.getFirstProceduralDuration(1685047620, stagedMedia);

        expect(result).to.equal(33180);
    });
});

describe('setProceduralBlockDurations function', () => {
    it('should calculate the correct durations based on interval (30 minute interval)', () => {
        let interval = 1800;
        let firstProceduralDuration = 33180;

        let { preMediaDuration, initialProceduralBlockDuration } = streamConstructor.setProceduralBlockDurations(interval, firstProceduralDuration);

        expect(preMediaDuration).to.equal(780);
        expect(initialProceduralBlockDuration).to.equal(32400);
    });
});

describe('getProceduralBlock function', () => {
    let config: Config = new Config();
    let media: Media = new Media([], [], [], [], [], [], []);
    let options = {}
    let stagedMedia: StagedMedia = new StagedMedia([], [], 0);
    let prevMovies: Movie[];
    let progression: MediaProgression[] = [];
    let duration: number = 0;
    let lastTimePoint: number = 0;
    it('should populate something', () => {

        let result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);

        expect(result).to.equal(32400);
    });
});

describe('getStagedStream function', () => {
    let media = new Media([], [], [], [], [], [], []);
    it('should throw an error if start time appears after any scheduled media', () => {
        let stagedMedia: StagedMedia = new StagedMedia(
            [
                new SelectedMedia(
                    testMovie1,
                    MediaType.Movie,
                    1685052000,
                    7200,
                    ["tag1", "tag2", "tag3"]
                ),
                new SelectedMedia(
                    testMovie3,
                    MediaType.Movie,
                    1685059200,
                    7200,
                    ["tag2", "tag3"]
                ),
                new SelectedMedia(
                    collection1,
                    MediaType.Collection,
                    1685066400,
                    7200,
                    ["tag4"]
                ),
                new SelectedMedia(
                    testMovie2,
                    MediaType.Movie,
                    1685073600,
                    7200,
                    ["tag1", "tag2"]
                )
            ],
            [],
            1685080800)

        expect(() => streamConstructor.getStagedStream(1685052001, new Config(), {}, stagedMedia, media, [])).to.throw("Time of first movie, collection, or selected end time needs to be in the future.");
    });
});