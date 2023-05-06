import { expect } from 'chai';
import { MediaType } from "../models/enum/mediaTypes";
import { Media } from "../models/media";
import { Movie } from "../models/movie";
import { SelectedMedia } from "../models/selectedMedia";
import { getMovie } from "../src/streamConstructor";

const media = new Media(
    [], //show
    [], //movie
    [], //short
    [], //music
    [], //promo
    [], //commercial
    [] //collection
);

const testMovie1 = new Movie(
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

const testMovie2 = new Movie(
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

const testMovie3 = new Movie(
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


describe('getMovie function', () => {
    it('should populate selected movie into selected Media object', () => {

        media.Movies.push(testMovie1)
        media.Movies.push(testMovie2)
        media.Movies.push(testMovie3)

        const loadTitle: string = "test1";
        const time: number = 0;
        const match: SelectedMedia = new SelectedMedia(
            testMovie1,
            MediaType.Movie,
            0,
            7200,
            ["tag1", "tag2", "tag3"]
        );

        const result = getMovie(loadTitle, media.Movies, time);

        expect(result).to.deep.equal(match);
    });

    it('should throw an error when an incorrect movie name is requested', () => {

        media.Movies.push(testMovie1)
        media.Movies.push(testMovie2)
        media.Movies.push(testMovie3)

        const loadTitle: string = "test4";
        const time: number = 0;

        expect(() => getMovie(loadTitle, media.Movies, time)).to.throw("test4 is not a valid load title for a movie, re-check your spelling or make sure the title youre attempting to load exists.");
    });

    it('should throw an error when a blank name is requested', () => {

        media.Movies.push(testMovie1)
        media.Movies.push(testMovie2)
        media.Movies.push(testMovie3)

        const loadTitle: string = "";
        const time: number = 0;

        expect(() => getMovie(loadTitle, media.Movies, time)).to.throw("Empty movie titles are not a valid input");
    });
});
