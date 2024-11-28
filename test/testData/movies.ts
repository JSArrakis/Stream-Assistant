import { MainGenres } from "../../src/models/const/mainGenres";
import { Movie } from "../../src/models/movie";

export const inception = new Movie(
  'Inception',
  'inception',
  'inception',
  'tt1375666',
  ['scifi'],
  '/path/inception.mp4',
  8880,
  9000,
  '',
  0,
);
export const matrix = new Movie(
  'The Matrix',
  'thematrix',
  'matrix',
  'tt0133093',
  ['action'],
  '/path/matrix.mp4',
  8160,
  9000,
  '',
  1,
);
export const interstellar = new Movie(
  'Interstellar',
  'interstellar',
  'interstellar',
  'tt0816692',
  ['scifi'],
  '/path/interstellar.mp4',
  10140,
  10800,
  '',
  0,
);
export const dune = new Movie(
  'Dune',
  'dune',
  'dune',
  'tt1160419',
  ['scifi'],
  '/path/dune.mp4',
  9120,
  10800,
  '',
  1,
);
export const terminator2 = new Movie(
  'Terminator 2: Judgement Day',
  'terminator2',
  'terminator2',
  'tt0103064',
  [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi],
  '/path/terminator2.mp4',
  9300,
  10800,
  '',
  0,
);
