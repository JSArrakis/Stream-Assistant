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

let episode1 = new Episode(1, 1, 1, "", "episode1", "episode1", 1648, 1800, [])
let episode2 = new Episode(1, 2, 2, "", "episode2", "episode2", 1709, 1800, [])
let episode3 = new Episode(1, 3, 3, "", "episode3", "episode3", 1603, 1800, [])
let episode4 = new Episode(1, 4, 4, "", "episode4", "episode4", 1600, 1800, [])
let episode5a = new Episode(1, 5, 5, "", "episode5", "episode5", 1699, 1800, [])
let episode5b = new Episode(1, 5, 5, "", "episode5", "episode5", 2703, 3600, [])

let show1 = new Show("Show1", "show1", "alias", "imdb", 1800, false, ["tag1", "tag5", "tag4"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show2 = new Show("Show2", "show2", "alias", "imdb", 1800, false, ["tag2", "tag5"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show3 = new Show("Show3", "show3", "alias", "imdb", 1800, false, ["tag5"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show4 = new Show("Show4", "show4", "alias", "imdb", 1800, false, ["tag4", "tag6"], 5, [episode1, episode2, episode3, episode4, episode5a])
let show5 = new Show("Show5", "show5", "alias", "imdb", 1800, true, ["tag6", "tag7"], 5, [episode1, episode2, episode3, episode4, episode5b])
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

let movieList = [testMovie1, testMovie2, testMovie3, testMovie4];

let stagedMedia: StagedMedia = new StagedMedia(
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
  1685080800)

describe('getFirstProceduralDuration function', () => {
  it('should calculate the correct number from first media of scheduled media if present', () => {
    let stagedMedia: StagedMedia = new StagedMedia(
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

describe('selectMovieUnderDuration', () => {
  const movies: Movie[] = [
    // Movies with matching tags
    new Movie('Movie 1', 'LoadTitle 1', 'Alias 1', 'IMDB 1', ['Tag1', 'Tag2'], 'Path 1', 6908, 7200, 'Collection 1', 1),
    new Movie('Movie 2', 'LoadTitle 2', 'Alias 2', 'IMDB 2', ['Tag1', 'Tag3'], 'Path 2', 6908, 7200, 'Collection 2', 1),
    new Movie('Movie 3', 'LoadTitle 3', 'Alias 3', 'IMDB 3', ['Tag1', 'Tag2', 'Tag3'], 'Path 3', 6908, 7200, 'Collection 3', 1),

    // Movies without matching tags
    new Movie('Movie 4', 'LoadTitle 4', 'Alias 4', 'IMDB 4', ['Tag4', 'Tag5'], 'Path 4', 6908, 7200, 'Collection 4', 1),
    new Movie('Movie 5', 'LoadTitle 5', 'Alias 5', 'IMDB 5', ['Tag5', 'Tag6'], 'Path 5', 6908, 7200, 'Collection 5', 1),
    new Movie('Movie 6', 'LoadTitle 6', 'Alias 6', 'IMDB 6', ['Tag6', 'Tag7'], 'Path 6', 6908, 7200, 'Collection 6', 1),
  ];

  it('should return a random movie with matching tags and duration', () => {
    let prevMovies: Movie[] = [];
    const options = {
      tagsOR: ['Tag1', 'Tag2'],
    };
    const duration = 14400;
    const selectedMovie = proceduralEngine.selectMovieUnderDuration(options, movies, prevMovies, duration);
    expect(selectedMovie).to.be.an.instanceOf(Movie);
    expect(selectedMovie.Tags).to.include.oneOf(options.tagsOR);
    expect(selectedMovie.DurationLimit).to.be.at.most(duration);
  });

  it('should only return movies not previously played in this round', () => {
    let prevMovies: Movie[] = [
      new Movie('Movie 2', 'LoadTitle 2', 'Alias 2', 'IMDB 2', ['Tag1', 'Tag3'], 'Path 2', 6908, 7200, 'Collection 2', 1),
      new Movie('Movie 3', 'LoadTitle 3', 'Alias 3', 'IMDB 3', ['Tag1', 'Tag2', 'Tag3'], 'Path 3', 6908, 7200, 'Collection 3', 1)
    ];

    const options = {
      tagsOR: ['Tag1'],
    };
    const duration = 14400;
    const selectedMovie = proceduralEngine.selectMovieUnderDuration(options, movies, prevMovies, duration);
    expect(selectedMovie).to.equal(movies[0]);
  });

  it('should return undefined if no movie matches the tags', () => {
    let prevMovies: Movie[] = [];
    const options = {
      tagsOR: ['Tag8'],
    };
    const duration = 14400;
    const selectedMovie = proceduralEngine.selectMovieUnderDuration(options, movies, prevMovies, duration);
    expect(selectedMovie).to.be.undefined;
  });

});

describe('selectShowUnderDuration function', () => {
  const shows: Show[] = [
    // Shows with matching tags
    new Show(
      'Show 1',
      'LoadTitle 1',
      'Alias 1',
      'IMDB 1',
      1800,
      false,
      ['Tag1', 'Tag2'],
      3,
      [
        new Episode(1, 1, 1, 'Path 1', 'Episode 1', 'LoadTitle 1', 1643, 1800, ['Tag1']),
        new Episode(1, 2, 2, 'Path 2', 'Episode 2', 'LoadTitle 2', 1643, 1800, ['Tag2']),
        new Episode(1, 3, 3, 'Path 3', 'Episode 3', 'LoadTitle 3', 1643, 1800, ['Tag1', 'Tag2']),
      ]
    ),
    new Show(
      'Show 2',
      'LoadTitle 4',
      'Alias 2',
      'IMDB 2',
      1800,
      false,
      ['Tag1', 'Tag3'],
      2,
      [
        new Episode(1, 1, 1, 'Path 4', 'Episode 1', 'LoadTitle 4', 1643, 1800, ['Tag1']),
        new Episode(1, 2, 2, 'Path 5', 'Episode 2', 'LoadTitle 5', 1643, 1800, ['Tag3']),
      ]
    ),

    // Shows without matching tags
    new Show(
      'Show 3',
      'LoadTitle 6',
      'Alias 3',
      'IMDB 3',
      1800,
      false,
      ['Tag4', 'Tag5'],
      3,
      [
        new Episode(1, 1, 1, 'Path 6', 'Episode 1', 'LoadTitle 6', 1643, 1800, ['Tag4']),
        new Episode(1, 2, 2, 'Path 7', 'Episode 2', 'LoadTitle 7', 1643, 1800, ['Tag5']),
        new Episode(1, 3, 3, 'Path 8', 'Episode 3', 'LoadTitle 8', 1643, 1800, ['Tag6']),
      ]
    ),
  ];

  const progression: MediaProgression[] = [
    new MediaProgression('Main', 'Type', [
      { LoadTitle: 'LoadTitle 1', Episode: 1 },
      { LoadTitle: 'LoadTitle 4', Episode: 1 },
      { LoadTitle: 'LoadTitle 6', Episode: 1 },
    ]),
  ];

  it('should return an array of episodes with matching tags and duration', () => {
    const options = {
      tagsOR: ['Tag1', 'Tag2'],
    };
    const duration = 1800;
    const result = proceduralEngine.selectShowUnderDuration(options, shows, progression, duration);
    expect(result[0]).to.be.an('array');
    expect(result[0]).to.have.lengthOf(1);
    const selectedEpisode = result[0][0];
    expect(selectedEpisode).to.be.an.instanceOf(Episode);
    expect(selectedEpisode.DurationLimit).to.be.at.most(duration);
  });
});

describe('getProceduralBlock', () => {

  it('should randomly select a combination of movies and shows that fill the time available', () => {
    const config: Config = new Config("", "", "", "", "", 0, 0);
    const options: any = { tagsOR: ["tag1", "tag2", "tag3"] };
    const media: Media = new Media(showList, movieList, [], [], [], [], []);;
    const prevMovies: Movie[] = [];
    const progression: MediaProgression[] = [new MediaProgression("Main", "Main", [])]
    const duration: number = 9000;
    const lastTimePoint: number = 1685066400;

    let result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);
    let totalDuration = result.reduce((acc, obj) => acc + obj.Duration, 0);
    let countShows = result.filter(show => show.Type === MediaType.Episode).length;
    let countMovies = result.filter(movie => movie.Type === MediaType.Movie).length;
    let allTagsValid = result.every(
      (obj) => obj.Tags.every((tag) => ["tag1", "tag2", "tag3"].includes(tag))
    );
    expect(result).to.be.an('array');
    expect(countShows === 5 || (countShows === 1 && countMovies === 1)).to.be.true;
    expect(totalDuration).to.equal(9000);
    expect(allTagsValid).to.be.true;
  });

  it('should get only shows when no more movies fit the criteria', () => {
    const config: Config = new Config("", "", "", "", "", 0, 0);
    const options: any = { tagsOR: ["tag1", "tag2", "tag3"] };
    const media: Media = new Media(showList, movieList, [], [], [], [], []);;
    const prevMovies: Movie[] = movieList;
    const progression: MediaProgression[] = [new MediaProgression("Main", "Main", [])]
    const duration: number = 7200;
    const lastTimePoint: number = 1685066400;

    let result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);
    let totalDuration = result.reduce((acc, obj) => acc + obj.Duration, 0);
    let allElementsAreShows = result.every((obj) => obj.Type === MediaType.Episode);
    let allTagsValid = result.every(
      (obj) => obj.Tags.every((tag) => ["tag1", "tag2", "tag3"].includes(tag))
    );
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(4);
    expect(totalDuration).to.equal(7200);
    expect(allElementsAreShows).to.be.true;
    expect(allTagsValid).to.be.true;
  });

  it('should get 1 over duration episode if within duration', () => {
    const config: Config = new Config("","","","","",0,0);
    const options: any = { tagsOR: ["tag7"] };
    const media: Media = new Media(showList, movieList, [], [], [], [], []);;
    const prevMovies: Movie[] = movieList;
    const progression: MediaProgression[] = [new MediaProgression("Main", "Main", [new ShowProgression("show5", 5)])]
    const duration: number = 3600;
    const lastTimePoint: number = 1685066400;

    let result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);
    let totalDuration = result.reduce((acc, obj) => acc + obj.Duration, 0);
    let allElementsAreShows = result.every((obj) => obj.Type === MediaType.Episode);
    let allTagsValid = result.every(
      (obj) => obj.Tags.every((tag) => ["tag7"].includes(tag))
    );
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);
    expect(totalDuration).to.equal(3600);
    expect(allElementsAreShows).to.be.true;
    expect(allTagsValid).to.be.true;
  });

  // OUT OF SCOPE
  // This needs addtional work on selectShowByDuration function to make considerations on unique situations
  // where it would be required to pick two sequential episodes from the same Over Duration show. 
  // We Might need to fill the last 30 minute gap with something else
  // it('should get two episodes from overduration show if not over duration episodes', () => {
  //   const config: Config = new Config();
  //   const options: any = { tagsOR: ["tag7"] };
  //   const media: Media = new Media(showList, movieList, [], [], [], [], []);;
  //   const prevMovies: Movie[] = movieList;
  //   const progression: MediaProgression[] = [new MediaProgression("Main", "Main", [new ShowProgression("show5", 3)])]
  //   const duration: number = 3600;
  //   const lastTimePoint: number = 1685066400;

  //   let result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);
  //   let totalDuration = result.reduce((acc, obj) => acc + obj.Duration, 0);
  //   let allElementsAreShows = result.every((obj) => obj.Type === MediaType.Episode);
  //   let allTagsValid = result.every(
  //     (obj) => obj.Tags.every((tag) => ["tag7"].includes(tag))
  //   );
  //   expect(result).to.be.an('array');
  //   expect(result).to.have.lengthOf(2);
  //   expect(totalDuration).to.equal(3600);
  //   expect(allElementsAreShows).to.be.true;
  //   expect(allTagsValid).to.be.true;
  // });
});