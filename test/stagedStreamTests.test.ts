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
import moment from 'moment';
import { CommandLineArgs } from '../models/commandLineArgs';

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

let testMovie4 = new Movie(
    "Test4",
    "test4",
    "test4",
    "",
    ["tag2", "tag4"],
    "pathToTest4",
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

let show1 = new Show("Show1", "show1", "alias", "imdb", 1800, false, ["tags"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show2 = new Show("Show2", "show2", "alias", "imdb", 1800, false, ["tags"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show3 = new Show("Show3", "show3", "alias", "imdb", 1800, false, ["tags"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show4 = new Show("Show4", "show4", "alias", "imdb", 1800, false, ["tags"], [], 5, [episode1, episode2, episode3, episode4, episode5a])
let show5 = new Show("Show5", "show5", "alias", "imdb", 1800, true, ["tags"], [], 5, [episode1, episode2, episode3, episode4, episode5b])
let shows = [show1, show2, show3, show4, show5]

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
let collShow5 = new CollectionShow(
    "show5", 3, 1, 1800, undefined, undefined, undefined
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

let collection2 = new Collection(
    "Collection1",
    "collection1",
    "",
    7200,
    7200,
    [],
    new Bumper("", 1, "", "b", []),
    new Bumper("", 1, "", "b", []),
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
            "",
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

describe('manageProgression function', () => {
    it('should increment the correct show', () => {
        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1),
        ])

        let progressionTarget = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 2),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1),
        ])

        utilities.ManageProgression("collection1", "Collection", [progression], show1, 1)

        expect(progression).to.deep.equal(progressionTarget);
    });

    it('should increment the show by specified number', () => {
        let num = 2
        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1)
        ])

        let progressionTarget = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 3)
        ])

        utilities.ManageProgression("collection1", "Collection", [progression], show1, num)

        expect(progression).to.deep.equal(progressionTarget);
    });

    it('should restart show at end', () => {
        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 5)
        ])

        let progressionTarget = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1)
        ])

        utilities.ManageProgression("collection1", "Collection", [progression], show1, 1)

        expect(progression).to.deep.equal(progressionTarget);
    });

    it('should restart show if multi-increment exceeds end of show', () => {
        let num = 3
        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 4)
        ])

        let progressionTarget = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 2)
        ])

        utilities.ManageProgression("collection1", "Collection", [progression], show1, num)

        expect(progression).to.deep.equal(progressionTarget);
    });
});

describe('assignCollepisodes function', () => {
    it('should select one episode per show based on collection progression', () => {
        let testCollection = deepCopy(collection1);

        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1),
        ])

        let collectionShow1 = collShow1;
        collectionShow1.Episode = episode1;

        let collectionShow2 = collShow2;
        collectionShow2.Episode = episode1;

        let collectionShow3 = collShow3;
        collectionShow3.Episode = episode1;

        let collectionShow4 = collShow4;
        collectionShow4.Episode = episode1;

        let match = deepCopy(collection1);
        match.Shows = [collectionShow1, collectionShow2, collectionShow3, collectionShow4];

        streamConstructor.assignCollEpisodes(testCollection, shows, [progression]);

        expect(testCollection).to.deep.equal(match);
    });
});

describe('getCollection function', () => {
    it('should populate selected collection with correct episodes into selected Media object', () => {

        media = new Media([], [], [], [], [], [], []);
        let collection = deepCopy(collection1);
        media.Collections.push(collection);
        media.Shows = [show1, show2, show3, show4, show5]

        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1),
        ])

        let collectionShow1 = collShow1;
        collectionShow1.Episode = episode1;

        let collectionShow2 = collShow2;
        collectionShow2.Episode = episode1;

        let collectionShow3 = collShow3;
        collectionShow3.Episode = episode1;

        let collectionShow4 = collShow4;
        collectionShow4.Episode = episode1;

        let targetCollection = deepCopy(collection1);
        targetCollection.Shows = [collectionShow1, collectionShow2, collectionShow3, collectionShow4];
        let targetitem = new SelectedMedia(targetCollection, "", MediaType.Collection, 1, 7200, ['tag4'])

        let item = streamConstructor.getCollection("collection1", media, 1, [progression])

        expect(item).to.deep.equal(targetitem);
    });

    // it('should throw an error when a blank name is requested', () => {
    //     let progression = new MediaProgression("", "", [])
    //     let loadTitle: string = "";
    //     let time: number = 0;

    //     expect(() => streamConstructor.getMovie(loadTitle, media.Movies, time)).to.throw("Empty movie titles are not a valid input");
    // });
});

describe('getScheduledMedia function', () => {
    let testmedia = new Media([], [], [], [], [], [], []);
    testmedia.Movies = [testMovie1, testMovie2, testMovie3];

    it('should not populate scheduled media if none present', () => {
        let match: SelectedMedia[] = [];

        var options = {
            movies: ["test1", "test2"]
        }

        let result = streamConstructor.getScheduledMedia(options, media, []);

        expect(result).to.deep.equal(match);
    });

    it('should populate and arrange selected movies in order of time', () => {
        var options = {
            movies: ["test1::1685052000", "test2::1685066400", "test3::1685059200"]
        }

        let result = streamConstructor.getScheduledMedia(options, testmedia, []);

        expect(result[0]).to.deep.equal(new SelectedMedia(
            testMovie1,
            "",
            MediaType.Movie,
            1685052000,
            7200,
            ["tag1", "tag2", "tag3"]
        ));
        expect(result[1]).to.deep.equal(new SelectedMedia(
            testMovie3,
            "",
            MediaType.Movie,
            1685059200,
            7200,
            ["tag2", "tag3"]
        ));
        expect(result[2]).to.deep.equal(new SelectedMedia(
            testMovie2,
            "",
            MediaType.Movie,
            1685066400,
            7200,
            ["tag1", "tag2"]
        ));
    });

    it('should populate and arrange selected movies and collections in order of time', () => {
        var options = {
            movies: ["test1::1685052000", "test2::1685073600", "test3::1685059200", "test4"],
            blocks: ["collection1::1685066400"]
        }

        let testmedia = new Media([], [], [], [], [], [], []);
        testmedia.Movies = [testMovie1, testMovie2, testMovie3, testMovie4];
        testmedia.Collections.push(collection1);
        testmedia.Shows = [show1, show2, show3, show4, show5]

        let progression = new MediaProgression("collection1", "Collection", [
            new ShowProgression("show1", 1),
            new ShowProgression("show2", 1),
            new ShowProgression("show3", 1),
            new ShowProgression("show4", 1),
        ])

        let collectionShow1 = collShow1;
        collectionShow1.Episode = episode1;

        let collectionShow2 = collShow2;
        collectionShow2.Episode = episode1;

        let collectionShow3 = collShow3;
        collectionShow3.Episode = episode1;

        let collectionShow4 = collShow4;
        collectionShow4.Episode = episode1;

        let targetCollection = deepCopy(collection1);
        targetCollection.Shows = [collectionShow1, collectionShow2, collectionShow3, collectionShow4];

        new SelectedMedia(targetCollection, "", MediaType.Collection, 1, 7200, ["tag4"])

        let result = streamConstructor.getScheduledMedia(options, testmedia, [progression]);

        expect(result[0]).to.deep.equal(new SelectedMedia(
            testMovie1,
            "",
            MediaType.Movie,
            1685052000,
            7200,
            ["tag1", "tag2", "tag3"]
        ));
        expect(result[1]).to.deep.equal(new SelectedMedia(
            testMovie3,
            "",
            MediaType.Movie,
            1685059200,
            7200,
            ["tag2", "tag3"]
        ));
        expect(result[2]).to.deep.equal(new SelectedMedia(
            targetCollection,
            "",
            MediaType.Collection,
            1685066400,
            7200,
            ["tag4"]
        ));
        expect(result[3]).to.deep.equal(new SelectedMedia(
            testMovie2,
            "",
            MediaType.Movie,
            1685073600,
            7200,
            ["tag1", "tag2"]
        ));
    });
});

describe('getInjectedMovies function', () => {
    it('should populate selected movies without scheduled times', () => {
        let movies = [testMovie1, testMovie2, testMovie3];
        let options = {
            movies: ["test1", "test2::1685052000", "test3"]
        };

        let injectedMovies: SelectedMedia[] =
            [
                new SelectedMedia(
                    testMovie1,
                    "",
                    MediaType.Movie,
                    0,
                    7200,
                    ["tag1", "tag2", "tag3"]
                ),
                new SelectedMedia(
                    testMovie3,
                    "",
                    MediaType.Movie,
                    0,
                    7200,
                    ["tag2", "tag3"]
                )
            ]


        let result = streamConstructor.getInjectedMovies(options, movies)

        expect(injectedMovies).to.deep.equal(result);
    });
});

describe('evaluateStreamEndTime function', () => {
    it('should populate end time from options when present', () => {
        let options = {
            endTime: 1685080800
        };

        let scheduledMedia: SelectedMedia[] = [
            new SelectedMedia(
                testMovie1,
                "",
                MediaType.Movie,
                1685052000,
                7200,
                ["tag1", "tag2", "tag3"]
            ),
            new SelectedMedia(
                testMovie3,
                "",
                MediaType.Movie,
                1685059200,
                7200,
                ["tag2", "tag3"]
            ),
            new SelectedMedia(
                collection1,
                "",
                MediaType.Collection,
                1685066400,
                7200,
                ["tag4"]
            ),
            new SelectedMedia(
                testMovie2,
                "",
                MediaType.Movie,
                1685073600,
                7200,
                ["tag1", "tag2"]
            )
        ]

        let result = streamConstructor.evaluateStreamEndTime(options, scheduledMedia)

        expect(1685080800).to.deep.equal(result);
    });

    it('should populate end time from scheduled movies when not set in options', () => {
        let options = {
        };

        let scheduledMedia: SelectedMedia[] = [
            new SelectedMedia(
                testMovie1,
                "",
                MediaType.Movie,
                1685052000,
                7200,
                ["tag1", "tag2", "tag3"]
            ),
            new SelectedMedia(
                testMovie3,
                "",
                MediaType.Movie,
                1685059200,
                7200,
                ["tag2", "tag3"]
            ),
            new SelectedMedia(
                collection1,
                "",
                MediaType.Collection,
                1685066400,
                7200,
                ["tag4"]
            ),
            new SelectedMedia(
                testMovie2,
                "",
                MediaType.Movie,
                1685073600,
                7200,
                ["tag1", "tag2"]
            )
        ]

        let result = streamConstructor.evaluateStreamEndTime(options, scheduledMedia)

        expect(result).to.deep.equal(1685080800);
    });

    it('should populate end time as end of day if no scheduled movies and when not set in options', () => {

        let endTime: number = moment().startOf('day').add(1, "days").unix();

        let options = {
        };

        let scheduledMedia: SelectedMedia[] = []

        let result = streamConstructor.evaluateStreamEndTime(options, scheduledMedia)

        expect(endTime).to.deep.equal(result);
    });
});

describe('setProceduralTags function', () => {
    it('should populate tags from selected movies and collections into options.tagsOR if tagsOR is undefined', () => {
        let options: CommandLineArgs = new CommandLineArgs();

        let stagedmedia: StagedMedia = new StagedMedia(
            [
                new SelectedMedia(
                    testMovie1,
                    "",
                    MediaType.Movie,
                    1685052000,
                    7200,
                    ["tag1", "tag2", "tag3"]
                ),
                new SelectedMedia(
                    testMovie3,
                    "",
                    MediaType.Movie,
                    1685059200,
                    7200,
                    ["tag2", "tag3"]
                ),
                new SelectedMedia(
                    collection1,
                    "",
                    MediaType.Collection,
                    1685066400,
                    7200,
                    ["tag4"]
                ),
                new SelectedMedia(
                    testMovie2,
                    "",
                    MediaType.Movie,
                    1685073600,
                    7200,
                    ["tag1", "tag2"]
                )
            ],
            [],
            0
        )

        streamConstructor.setProceduralTags(options, stagedmedia)

        expect(options["tagsOR"]).to.deep.equal(['tag1', 'tag2', 'tag3', 'tag4']);
    });
});