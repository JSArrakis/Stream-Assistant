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
    const selectedEpisodes = proceduralEngine.selectShowUnderDuration(options, shows, progression, duration);
    expect(selectedEpisodes).to.be.an('array');
    expect(selectedEpisodes).to.have.lengthOf(1);
    const selectedEpisode = selectedEpisodes[0];
    expect(selectedEpisode).to.be.an.instanceOf(Episode);
    expect(selectedEpisode.DurationLimit).to.be.at.most(duration);
  });
});


describe('getProceduralBlock', () => {

  
    it('should select movies and episodes until the duration is reached', () => {
      const config: Config = /* create the config object */;
      const options: any = /* create the options object */;
      const stagedMedia: StagedMedia = /* create the stagedMedia object */;
      const media: Media = /* create the media object */;
      const prevMovies: Movie[] = /* create the prevMovies array */;
      const progression: MediaProgression[] = /* create the progression array */;
      const duration: number = /* set the duration value */;
      const lastTimePoint: number = /* set the lastTimePoint value */;
  
      const result = proceduralEngine.getProceduralBlock(config, options, stagedMedia, media, prevMovies, progression, duration, lastTimePoint);
  
      expect(result).to.be.an('array').that.is.not.empty;
  
      let totalDuration = 0;
      for (const item of result) {
        expect(item.Type).to.be.oneOf([MediaType.Movie, MediaType.Episode]);
        expect(item.Time).to.be.a('number');
        expect(item.Duration).to.be.a('number');
        expect(item.Tags).to.be.an('array');
  
        totalDuration += item.Duration;
      }
  
      expect(totalDuration).to.be.at.most(duration);
    });
  
    // Add more tests as needed for different scenarios
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