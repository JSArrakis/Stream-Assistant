import * as proEng from '../../src/services/proceduralEngine';
import { Movie } from '../../src/models/movie';
import { ContStreamRequest } from '../../src/models/streamRequest';
import * as td from '../testData/testData';

describe('isMovieSelected', () => {
  it('should return true if the movie is in the list of previous movies', () => {
    let prevMovies: Movie[] = [td.inception, td.matrix, td.interstellar];

    let result = proEng.isMoviePreviouslySelected(td.inception, prevMovies);

    expect(result).toBeTrue;
  });

  it('should return false if the movie is not in the list of previous movies', () => {
    let prevMovies: Movie[] = [td.inception, td.matrix];

    let result = proEng.isMoviePreviouslySelected(td.interstellar, prevMovies);

    expect(result).toBeFalse;
  });
});

describe('selectMovieUnderDuration', () => {
  it('should return a movie that is under the duration limit that has the tags in the request object', () => {
    let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
    let prevMovies: Movie[] = [];
    let args: ContStreamRequest = new ContStreamRequest(
      'password',
      'title',
      'env',
      [],
      ['scifi'],
    );

    let result = proEng.selectMovieUnderDuration(
      args,
      movies,
      prevMovies,
      9000,
    );

    expect(result).toEqual(td.inception);
  });

  it('should return a movie that is under the duration limit that has the tags in the request object and has not been selected before', () => {
    let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
    let prevMovies: Movie[] = [td.inception, td.matrix, td.dune];
    let args: ContStreamRequest = new ContStreamRequest(
      'password',
      'title',
      'env',
      [],
      ['scifi', 'action'],
    );

    let result = proEng.selectMovieUnderDuration(
      args,
      movies,
      prevMovies,
      10800,
    );

    expect(result).toEqual(td.interstellar);
  });

  it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 1)', () => {
    let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
    let prevMovies: Movie[] = [
      td.inception,
      td.matrix,
      td.interstellar,
      td.dune,
    ];
    let args: ContStreamRequest = new ContStreamRequest(
      'password',
      'title',
      'env',
      [],
      ['scifi', 'action'],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.4);

    let result = proEng.selectMovieUnderDuration(
      args,
      movies,
      prevMovies,
      9000,
    );

    expect(result).toEqual(td.inception);

    randomSpy.mockRestore();
  });

  it('should return any movie that is under the duration limit that has the correct tags, when all movies with the criteria have been selected before (result scenario 2)', () => {
    let movies: Movie[] = [td.inception, td.matrix, td.interstellar, td.dune];
    let prevMovies: Movie[] = [
      td.inception,
      td.matrix,
      td.interstellar,
      td.dune,
    ];
    let args: ContStreamRequest = new ContStreamRequest(
      'password',
      'title',
      'env',
      [],
      ['scifi', 'action'],
    );
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    let result = proEng.selectMovieUnderDuration(
      args,
      movies,
      prevMovies,
      9000,
    );

    expect(result).toEqual(td.matrix);

    randomSpy.mockRestore();
  });
});
