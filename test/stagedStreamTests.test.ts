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

let media = new Media(
    [], //show
    [], //movie
    [], //short
    [], //music
    [], //promo
    [], //commercial
    [] //collection
);

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

let episode1 = new Episode(1, 1, 1, "", "episode1", "episode1", 1648, 1800, [])
let episode2 = new Episode(1, 2, 2, "", "episode2", "episode2", 1709, 1800, [])
let episode3 = new Episode(1, 3, 3, "", "episode3", "episode3", 1603, 1800, [])
let episode4 = new Episode(1, 4, 4, "", "episode4", "episode4", 1600, 1800, [])
let episode5a = new Episode(1, 5, 5, "", "episode5", "episode5", 1699, 1800, [])
let episode5b = new Episode(1, 5, 5, "", "episode5", "episode5", 2703, 1800, [])

let show1 = new Show("Show1", "show1", "alias", "imdb", 1800, false, ["tags"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show2 = new Show("Show2", "show2", "alias", "imdb", 1800, false, ["tags"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show3 = new Show("Show3", "show3", "alias", "imdb", 1800, false, ["tags"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show4 = new Show("Show4", "show4", "alias", "imdb", 1800, false, ["tags"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show5 = new Show("Show5", "show5", "alias", "imdb", 1800, true, ["tags"], 5, [episode1, episode2, episode3, episode4, episode5b])
let shows = [show1, show2, show3, show4, show5]

let collShow1 = new CollectionShow(
    "show1", 1, 1, 1800, undefined, undefined, undefined
)
let collShow2 = new CollectionShow(
    "show2", 1, 1, 1800, undefined, undefined, undefined
)
let collShow3 = new CollectionShow(
    "show3", 1, 1, 1800, undefined, undefined, undefined
)
let collShow4 = new CollectionShow(
    "show4", 1, 1, 1800, undefined, undefined, undefined
)
let collShow5 = new CollectionShow(
    "show5", 1, 1, 1800, undefined, undefined, undefined
)

let collection1 = new Collection(
    "collection1",
    "collection1",
    "",
    7200,
    7200,
    [],
    new Bumper(1, "", []),
    new Bumper(1, "", []),
    [],
    [collShow1, collShow2, collShow3, collShow4],
    ""
)

let collection2 = new Collection(
    "Collection1",
    "collection1",
    "",
    7200,
    7200,
    [],
    new Bumper(1, "", []),
    new Bumper(1, "", []),
    [],
    [collShow1, collShow2, collShow5, collShow4],
    ""
)


describe('getMovie function', () => {
    media = new Media([], [], [], [], [], [], []);
    media.Movies = [testMovie1, testMovie2, testMovie3];

    it('should populate selected movie into selected Media object', () => {


        let loadTitle: string = "test1";
        let time: number = 0;
        let match: SelectedMedia = new SelectedMedia(
            testMovie1,
            MediaType.Movie,
            0,
            7200,
            ["tag1", "tag2", "tag3"]
        );

        let result = streamConstructor.getMovie(loadTitle, media.Movies, time);

        expect(result).to.deep.equal(match);
    });

    it('should throw an error when an incorrect movie name is requested', () => {

        let loadTitle: string = "test4";
        let time: number = 0;

        expect(() => streamConstructor.getMovie(loadTitle, media.Movies, time)).to.throw("test4 is not a valid load title for a movie, re-check your spelling or make sure the title youre attempting to load exists.");
    });

    it('should throw an error when a blank name is requested', () => {

        let loadTitle: string = "";
        let time: number = 0;

        expect(() => streamConstructor.getMovie(loadTitle, media.Movies, time)).to.throw("Empty movie titles are not a valid input");
    });
});

describe('assignCollepisodes function', () => {
    it('should aggregate one episode per show based on collection progression and assign them to the collection', () => {
        let progression = new MediaProgression("title", "type", [
            new ShowProgression("show1", 1),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1)
        ])

        let collectionShow1 = collShow1;
        collectionShow1.Episode = episode1;

        let collectionShow2 = collShow2;
        collectionShow2.Episode = episode2;

        let collectionShow3 = collShow3;
        collectionShow3.Episode = episode3;

        let collectionShow4 = collShow4;
        collectionShow4.Episode = episode4;

        let match = collection1;
        match.Shows = [collectionShow1, collectionShow2, collectionShow3, collectionShow4]

        let result = streamConstructor.assignCollEpisodes(collection1, shows, [progression]);

        expect(result).to.deep.equal(match);
    });
});

// describe('getCollection function', () => {
//     it('should populate selected collection into selected Media object', () => {

//         media.Collections.push(collection1)

//         const loadTitle: string = "collection1";
//         const time: number = 0;
//         const match: SelectedMedia = new SelectedMedia(
//             collection1,
//             MediaType.Collection,
//             0,
//             1800,
//             []
//         );

//         const result = streamConstructor.getCollection(loadTitle, media.Movies, time);

//         expect(result).to.deep.equal(match);
//     });
// });
