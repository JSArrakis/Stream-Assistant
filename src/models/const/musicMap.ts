import { GenreMusicMap } from "../genreMusicMap";
import { Music } from "../music";
import { MainGenres } from "./mainGenres";
import { MusicGenres } from "./musicGenres";

export const MusicMap: GenreMusicMap[] = [
    new GenreMusicMap(
        MainGenres.Action,
        [
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Punk,
            MusicGenres.Electronic,
            MusicGenres.HipHop,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Adventure,
        [
            MusicGenres.Rock,
            MusicGenres.Pop,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Comedy,
        [
            MusicGenres.Pop,
            MusicGenres.RnB,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Crime,
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
    new GenreMusicMap(
        MainGenres.Documentary,
        [
            MusicGenres.Classical,
            MusicGenres.EasyListening,
            MusicGenres.Folk,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Drama,
        [
            MusicGenres.EasyListening,
            MusicGenres.Pop,
            MusicGenres.Blues,
            MusicGenres.Jazz,
            MusicGenres.Classical,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Fantasy,
        [
            MusicGenres.EasyListening,
            MusicGenres.Folk,
            MusicGenres.Pop,
            MusicGenres.Classical,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Horror,
        [
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Punk,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Musical,
        [
            MusicGenres.Pop,
            MusicGenres.Classical,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Mystery,
        [
            MusicGenres.Blues,
            MusicGenres.Jazz,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.SciFi,
        [
            MusicGenres.Electronic,
            MusicGenres.Classical,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.War,
        [
            MusicGenres.Classical,
            MusicGenres.Rock,
            MusicGenres.Metal,
            MusicGenres.Blues,
            MusicGenres.Country,
        ],
        [],
    ),
    new GenreMusicMap(
        MainGenres.Western,
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