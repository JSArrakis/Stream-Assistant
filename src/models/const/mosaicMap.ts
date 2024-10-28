import { Mosaic } from "../mosaic";
import { Music } from "../music";
import { MainGenres } from "./mainGenres";
import { MusicGenres } from "./musicGenres";

export const MosaicMap: Mosaic[] = [
    new Mosaic(
        "action",
        [
            MainGenres.Action
        ],
        [
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Punk,
            MusicGenres.Electronic,
            MusicGenres.HipHop,
        ],
        [],
    ),
    new Mosaic(
        "adventure",
        [
            MainGenres.Adventure
        ],
        [
            MusicGenres.Rock,
            MusicGenres.Pop,
        ],
        [],
    ),
    new Mosaic(
        "comedy",
        [
            MainGenres.Comedy
        ],
        [
            MusicGenres.Pop,
            MusicGenres.RnB,
        ],
        [],
    ),
    new Mosaic(
        "crime",
        [
            MainGenres.Crime
        ],
        [
            MusicGenres.Rock,
            MusicGenres.HipHop,
            MusicGenres.RnB,
            MusicGenres.Blues,
            MusicGenres.Jazz,
            MusicGenres.Classical,
        ],
        [],
    ),
    new Mosaic(
        "drama",
        [
            MainGenres.Drama
        ],
        [
            MusicGenres.EasyListening,
            MusicGenres.Pop,
            MusicGenres.Blues,
            MusicGenres.Jazz,
            MusicGenres.Classical,
        ],
        [],
    ),
    new Mosaic(
        "educational",
        [
            MainGenres.Educational
        ],
        [
            MusicGenres.Classical,
            MusicGenres.EasyListening,
            MusicGenres.Folk,
        ],
        [],
    ),
    new Mosaic(
        "fantasy",
        [
            MainGenres.Fantasy
        ],
        [
            MusicGenres.EasyListening,
            MusicGenres.Folk,
            MusicGenres.Pop,
            MusicGenres.Classical,
        ],
        [],
    ),
    new Mosaic(
        "horror",
        [
            MainGenres.Horror
        ],
        [
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Punk,
        ],
        [],
    ),
    new Mosaic(
        "musical",
        [
            MainGenres.Musical
        ],
        [
            MusicGenres.Pop,
            MusicGenres.Classical,
        ],
        [],
    ),
    new Mosaic(
        "mystery",
        [
            MainGenres.Mystery
        ],
        [
            MusicGenres.Blues,
            MusicGenres.Jazz,
        ],
        [],
    ),
    new Mosaic(
        "scifi",
        [
            MainGenres.SciFi
        ],
        [
            MusicGenres.Electronic,
            MusicGenres.Classical,
        ],
        [],
    ),
    new Mosaic(
        "war",
        [
            MainGenres.War
        ],
        [
            MusicGenres.Classical,
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Blues,
            MusicGenres.Country,
        ],
        [],
    ),
    new Mosaic(
        "western",
        [
            MainGenres.Western
        ],
        [
            MusicGenres.Country,
            MusicGenres.Folk,
            MusicGenres.Rock,
            MusicGenres.Blues,
            MusicGenres.Classical,
        ],
        [],
    ),
]