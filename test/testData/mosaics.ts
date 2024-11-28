import { MainGenres } from "../../src/models/const/mainGenres";
import { MusicGenres, MusicSubGenres } from "../../src/models/const/musicGenres";
import { Mosaic } from "../../src/models/mosaic";

export const actionMosaic: Mosaic = {
  Key: MainGenres.Action,
  Genres: [MainGenres.Action],
  MusicGenres: [
    MusicGenres.Rock,
    MusicGenres.Metal,
    MusicGenres.Punk,
    MusicGenres.HipHop,
  ],
  MusicSubGenres: [],
};

export const horrorMosaic: Mosaic = {
  Key: MainGenres.Horror,
  Genres: [MainGenres.Horror],
  MusicGenres: [MusicGenres.Metal],
  MusicSubGenres: [
    MusicSubGenres.DarkWave,
    MusicSubGenres.IndustrialRock,
    MusicSubGenres.Synthwave,
    MusicSubGenres.AvantGarde,
  ],
};

export const scifiMosaic: Mosaic = {
  Key: MainGenres.SciFi,
  Genres: [MainGenres.SciFi],
  MusicGenres: [],
  MusicSubGenres: [
    MusicSubGenres.ElectronicMinimalist,
    MusicSubGenres.ElectronicAmbient,
    MusicSubGenres.NeoClassical,
  ],
};

export const actionHorrorMosaic: Mosaic = {
  Key: `${MainGenres.Action}-${MainGenres.Horror}`,
  Genres: [MainGenres.Action, MainGenres.Horror],
  MusicGenres: [MusicGenres.Metal],
  MusicSubGenres: [
    MusicSubGenres.IndustrialRock,
    MusicSubGenres.Synthwave,
    MusicSubGenres.PostRock,
  ],
};

export const actionSciFiMosaic: Mosaic = {
  Key: `${MainGenres.Action}-${MainGenres.SciFi}`,
  Genres: [MainGenres.Action, MainGenres.SciFi],
  MusicGenres: [],
  MusicSubGenres: [
    MusicSubGenres.Synthwave,
    MusicSubGenres.IndustrialRock,
    MusicSubGenres.NeoClassical,
    MusicSubGenres.Ambient,
  ],
};

export const horrorSciFiMosaic: Mosaic = {
  Key: `${MainGenres.Horror}-${MainGenres.SciFi}`,
  Genres: [MainGenres.Horror, MainGenres.SciFi],
  MusicGenres: [],
  MusicSubGenres: [
    MusicSubGenres.IndustrialRock,
    MusicSubGenres.DarkWave,
    MusicSubGenres.Synthwave,
    MusicSubGenres.AvantGarde,
  ],
};

export const actionHorrorSciFiMosaic: Mosaic = {
  Key: `${MainGenres.Action}-${MainGenres.Horror}-${MainGenres.SciFi}`,
  Genres: [MainGenres.Action, MainGenres.Horror, MainGenres.SciFi],
  MusicGenres: [MusicGenres.Metal],
  MusicSubGenres: [
    MusicSubGenres.IndustrialRock,
    MusicSubGenres.DarkAmbient,
    MusicSubGenres.Synthwave,
    MusicSubGenres.Breakcore,
  ],
};

export const mosaics: Mosaic[] = [
  actionMosaic,
  horrorMosaic,
  scifiMosaic,
  actionHorrorMosaic,
  actionSciFiMosaic,
  horrorSciFiMosaic,
  actionHorrorSciFiMosaic,
];
