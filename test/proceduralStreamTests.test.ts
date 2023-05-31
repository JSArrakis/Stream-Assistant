import { expect } from 'chai';
import { MediaType } from "../models/enum/mediaTypes";
import { Media } from "../models/media";
import { Movie } from "../models/movie";
import { SelectedMedia } from "../models/selectedMedia";
import * as streamConstructor from "../src/streamConstructor";
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
    it('should calculate the correct number from first media of staged media if present', () => {
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

        expect(result).to.deep.equal(4380);
    });
});