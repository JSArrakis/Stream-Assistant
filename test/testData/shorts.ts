import { AgeGroups } from '../../src/models/const/ageGroups';
import { Eras } from '../../src/models/const/eras';
import { MainGenres } from '../../src/models/const/mainGenres';
import { MediaType } from '../../src/models/enum/mediaTypes';
import { Short } from '../../src/models/short';

export const code8 = new Short(
  'Code 8',
  'code8',
  600,
  '/path/code8.mp4',
  MediaType.Short,
  [
    MainGenres.Action,
    MainGenres.SciFi,
    AgeGroups.YoungAdult,
    Eras.twothousands,
  ],
);
export const lightsout = new Short(
  'Lights Out',
  'lightsout',
  180,
  '/path/lightsout.mp4',
  MediaType.Short,
  [MainGenres.Horror, AgeGroups.Mature, Eras.twothousands],
);
export const rakka = new Short(
  'Rakka',
  'rakka',
  480,
  '/path/rakka.mp4',
  MediaType.Short,
  [MainGenres.SciFi, AgeGroups.Mature, Eras.twothousands],
);
export const theblackhole = new Short(
  'The Black Hole',
  'theblackhole',
  180,
  '/path/theblackhole.mp4',
  MediaType.Short,
  [
    MainGenres.SciFi,
    MainGenres.Horror,
    AgeGroups.YoungAdult,
    Eras.twothousands,
  ],
);
export const cargo = new Short(
  'Cargo',
  'cargo',
  420,
  '/path/cargo.mp4',
  MediaType.Short,
  [MainGenres.Horror, AgeGroups.Mature, Eras.twothousands],
);
export const dust = new Short(
  'Dust',
  'dust',
  600,
  '/path/dust.mp4',
  MediaType.Short,
  [
    MainGenres.SciFi,
    MainGenres.Action,
    AgeGroups.YoungAdult,
    Eras.twothousands,
  ],
);
export const portal = new Short(
  'Portal',
  'portal',
  480,
  '/path/portal.mp4',
  MediaType.Short,
  [
    MainGenres.SciFi,
    MainGenres.Action,
    AgeGroups.YoungAdult,
    Eras.twothousands,
  ],
);
export const thegate = new Short(
  'The Gate',
  'thegate',
  360,
  '/path/thegate.mp4',
  MediaType.Short,
  [MainGenres.Horror, MainGenres.Action, AgeGroups.Mature, Eras.twothousands],
);
export const alienharvest = new Short(
  'Alien: Harvest',
  'alienharvest',
  540,
  '/path/alienharvest.mp4',
  MediaType.Short,
  [MainGenres.SciFi, MainGenres.Horror, AgeGroups.Mature, Eras.twothousands],
);
export const adam = new Short(
  'Adam',
  'adam',
  540,
  '/path/adam.mp4',
  MediaType.Short,
  [MainGenres.SciFi, AgeGroups.YoungAdult, Eras.twothousands],
);

export const shorts = [
  code8,
  lightsout,
  rakka,
  theblackhole,
  cargo,
  dust,
  portal,
  thegate,
  alienharvest,
  adam,
];
