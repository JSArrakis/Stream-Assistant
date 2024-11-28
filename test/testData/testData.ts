import { Commercial } from '../../src/models/commercial';
import { AgeGroups } from '../../src/models/const/ageGroups';
import { Eras } from '../../src/models/const/eras';
import { MainGenres } from '../../src/models/const/mainGenres';
import {
  MusicGenres,
  MusicSubGenres,
} from '../../src/models/const/musicGenres';
import { MediaType } from '../../src/models/enum/mediaTypes';
import { Mosaic } from '../../src/models/mosaic';
import { Movie } from '../../src/models/movie';
import { Music } from '../../src/models/music';
import {
  ProgressionContext,
  WatchRecord,
} from '../../src/models/progressionContext';
import { Short } from '../../src/models/short';
import { Episode, Show } from '../../src/models/show';

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

export const sailor = new Show(
  'Sailor Moon',
  'sailormoon',
  'sailormoon',
  'tt0103369',
  1800,
  false,
  false,
  ['fantasy', 'action'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/sailormoon1.mp4',
      'A Moon Star is Born',
      '',
      1448,
      1800,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/sailormoon2.mp4',
      'Punishment Awaits! The House of Fortune is the Monster Mansion',
      '',
      1449,
      1800,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/sailormoon3.mp4',
      'Talk Radio',
      '',
      1448,
      1800,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/sailormoon4.mp4',
      'Slim City',
      '',
      1449,
      1800,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/sailormoon5.mp4',
      'So You Want to be a Superstar',
      '',
      1447,
      1800,
      [],
    ),
  ],
);
export const reboot = new Show(
  'Reboot',
  'reboot',
  'reboot',
  'tt0108903',
  1800,
  false,
  false,
  ['scifi', 'adventure'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/reboot1.mp4',
      'The Tearing',
      '',
      1353,
      1800,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/reboot2.mp4',
      'Racing the Clock',
      '',
      1355,
      1800,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/reboot3.mp4',
      'Quick and the Fed',
      '',
      1340,
      1800,
      [],
    ),
    new Episode(1, 4, 4, '/path/reboot4.mp4', 'Medusa Bug', '', 1354, 1800, []),
    new Episode(
      1,
      5,
      5,
      '/path/reboot5.mp4',
      'In the Belly of the Beast',
      '',
      1353,
      1800,
      [],
    ),
  ],
);
export const dragonballz = new Show(
  'Dragon Ball Z',
  'dragonballz',
  'dragonballz',
  'tt0214341',
  1800,
  false,
  false,
  ['action', 'adventure'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/dragonballz1.mp4',
      'The New Threat',
      '',
      1244,
      1800,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/dragonballz2.mp4',
      'Reunions',
      '',
      1165,
      1800,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/dragonballz3.mp4',
      'Unlikely Alliance',
      '',
      1188,
      1800,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/dragonballz4.mp4',
      "Piccolo's Plan",
      '',
      1166,
      1800,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/dragonballz5.mp4',
      "Gohan's Rage",
      '',
      1189,
      1800,
      [],
    ),
  ],
);
export const gundam = new Show(
  'Gundam Wing',
  'gundamwing',
  'gundamwing',
  'tt0122816',
  1800,
  false,
  false,
  ['scifi', 'action'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/gundamwing1.mp4',
      'The Shooting Star She Saw',
      '',
      1437,
      1800,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/gundamwing2.mp4',
      'The Gundam Deathscythe',
      '',
      1442,
      1800,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/gundamwing3.mp4',
      'Five Gundams Confirmed',
      '',
      1441,
      1800,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/gundamwing4.mp4',
      'The Victoria Nightmare',
      '',
      1442,
      1800,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/gundamwing5.mp4',
      "Relena's Secret",
      '',
      1442,
      1800,
      [],
    ),
  ],
);
export const tenchi = new Show(
  'Tenchi Muyo',
  'tenchimuyo',
  'tenchimuyo',
  'tt0108921',
  1800,
  true,
  false,
  ['scifi', 'comedy'],
  [],
  5,
  [
    new Episode(
      1,
      4,
      1,
      '/path/tenchimuyo1.mp4',
      'Mihoshi Falls to the Land of Stars',
      '',
      1778,
      1800,
      [],
    ),
    new Episode(
      1,
      5,
      2,
      '/path/tenchimuyo2.mp4',
      'Kagato Attacks!',
      '',
      1779,
      1800,
      [],
    ),
    new Episode(
      1,
      6,
      3,
      '/path/tenchimuyo3.mp4',
      'We Need Tenchi',
      '',
      1750,
      1800,
      [],
    ),
    new Episode(
      1,
      7,
      4,
      '/path/tenchimuyo4.mp4',
      'The Night Before the Carnival',
      '',
      2590,
      3600,
      [],
    ),
    new Episode(
      2,
      1,
      5,
      '/path/tenchimuyo5.mp4',
      'Hello Baby!',
      '',
      1721,
      1800,
      [],
    ),
  ],
);
export const batman = new Show(
  'Batman: The Animated Series',
  'batmantheanimatedseries',
  'batman',
  'tt0103359',
  1800,
  false,
  false,
  ['action', 'drama'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/batman1.mp4',
      'On Leather Wings',
      '',
      1341,
      1800,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/batman2.mp4',
      'Christmas with the Joker',
      '',
      1342,
      1800,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/batman3.mp4',
      'Nothing to Fear',
      '',
      1345,
      1800,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/batman4.mp4',
      'The Last Laugh',
      '',
      1338,
      1800,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/batman5.mp4',
      'Pretty Poison',
      '',
      1340,
      1800,
      [],
    ),
  ],
);
export const startrek = new Show(
  'Star Trek: The Next Generation',
  'startrekthenextgeneration',
  'startrek',
  'tt0092455',
  3600,
  true,
  true,
  ['scifi', 'adventure'],
  [],
  5,
  [
    new Episode(
      1,
      1,
      1,
      '/path/startrek1.mp4',
      'Encounter at Farpoint',
      '',
      5484,
      7200,
      [],
    ),
    new Episode(
      1,
      2,
      2,
      '/path/startrek2.mp4',
      'The Naked Now',
      '',
      2763,
      3600,
      [],
    ),
    new Episode(
      1,
      3,
      3,
      '/path/startrek3.mp4',
      'Code of Honor',
      '',
      2763,
      3600,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/startrek4.mp4',
      'The Last Outpost',
      '',
      2763,
      3600,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/startrek5.mp4',
      'Where No One Has Gone Before',
      '',
      2756,
      3600,
      [],
    ),
  ],
);

export const farscape = new Show(
  'Farscape',
  'farscape',
  'farscape',
  'tt0187636',
  3600,
  false,
  false,
  ['scifi', 'adventure'],
  [],
  5,
  [
    new Episode(1, 1, 1, '/path/farscape1.mp4', 'Premiere', '', 2921, 3600, []),
    new Episode(1, 2, 2, '/path/farscape2.mp4', 'I, E.T.', '', 2887, 3600, []),
    new Episode(
      1,
      3,
      3,
      '/path/farscape3.mp4',
      'Exodus from Genesis',
      '',
      2976,
      3600,
      [],
    ),
    new Episode(
      1,
      4,
      4,
      '/path/farscape5.mp4',
      'Back and Back and Back to the Future',
      '',
      2887,
      3600,
      [],
    ),
    new Episode(
      1,
      5,
      5,
      '/path/farscape4.mp4',
      'Throne for a Loss',
      '',
      2888,
      3600,
      [],
    ),
  ],
);

export const sailorWatchRecord = new WatchRecord(
  'Sailor Moon',
  'sailormoon',
  0,
  0,
  1800,
);
export const rebootWatchRecord = new WatchRecord(
  'Reboot',
  'reboot',
  1,
  0,
  1800,
);
export const gundamWatchRecord = new WatchRecord(
  'Gundam Wing',
  'gundamwing',
  3,
  0,
  1800,
);
export const tenchiWatchRecord = new WatchRecord(
  'Tenchi Muyo',
  'tenchimuyo',
  2,
  0,
  1800,
);
export const batmanWatchRecord = new WatchRecord(
  'Batman: The Animated Series',
  'batmantheanimatedseries',
  5,
  0,
  1800,
);
export const startrekWatchRecord = new WatchRecord(
  'Star Trek: The Next Generation',
  'startrekthenextgeneration',
  0,
  0,
  7200,
);

export const continuousProgression = new ProgressionContext(
  'Continuous',
  'continuous',
  'Test',
  0,
  [
    sailorWatchRecord,
    rebootWatchRecord,
    gundamWatchRecord,
    tenchiWatchRecord,
    batmanWatchRecord,
    startrekWatchRecord,
  ],
);

export const jurassicparktoys1 = new Commercial(
  'Jurassic Park Toys 1',
  'jurassicparktoys1',
  10,
  '/path/jurassicparktoys1.mp4',
  MediaType.Commercial,
  ['jurassicpark', MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const marvelvsstreetfighter98 = new Commercial(
  '98 Marvel vs StreetFighter',
  '98marvelvsstreetfighter',
  15,
  '/path/98marvelvsstreetfighter.mp4',
  MediaType.Commercial,
  [
    'marvel',
    'streetfighter',
    MainGenres.Action,
    AgeGroups.Kids,
    Eras.nnineties,
  ],
);
export const wildones = new Commercial(
  'Wild Ones',
  'wildones',
  15,
  '/path/wildones.mp4',
  MediaType.Commercial,
  [MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const dreambuilders = new Commercial(
  'Dream Builders',
  'dreambuilders',
  15,
  '/path/dreambuilders.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const jurassicparktoys2 = new Commercial(
  '93 Jurassic Park Toys 2',
  '93 jurassicparktoys2',
  15,
  '/path/jurassicparktoys2.mp4',
  MediaType.Commercial,
  ['jurassicpark', MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const jurassicparktoys3 = new Commercial(
  '93 Jurassic Park Toys 3',
  '93 jurassicparktoys3',
  15,
  '/path/jurassicparktoys3.mp4',
  MediaType.Commercial,
  ['jurassicpark', MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const littleoopsiedaisy = new Commercial(
  'Little Oopsie Daisy',
  'littleoopsiedaisy',
  15,
  '/path/littleoopsiedaisy.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const meninblacktoys97 = new Commercial(
  '97 Men in Black Toys',
  '97meninblacktoys',
  15,
  '/path/97meninblacktoys.mp4',
  MediaType.Commercial,
  [
    'meninblack',
    MainGenres.SciFi,
    MainGenres.Action,
    AgeGroups.Kids,
    Eras.nnineties,
  ],
);
export const monsterfacetoy = new Commercial(
  'Monster Face Toy',
  'monsterfacetoy',
  15,
  '/path/monsterfacetoy.mp4',
  MediaType.Commercial,
  ['halloween', MainGenres.Horror, AgeGroups.Kids, Eras.nnineties],
);
export const newbluemms = new Commercial(
  'New Blue M&Ms',
  'newbluemms',
  15,
  '/path/newbluemms.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges, Eras.nnineties],
);
export const superduperdoublelooper = new Commercial(
  'Super Duper Double Looper',
  'superduperdoublelooper',
  15,
  '/path/superduperdoublelooper.mp4',
  MediaType.Commercial,
  [MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const transformersbeastwarstoys = new Commercial(
  'Transformers Beast Wars Toys',
  'transformersbeastwarstoys',
  15,
  '/path/transformersbeastwarstoys.mp4',
  MediaType.Commercial,
  [
    'transformers',
    MainGenres.SciFi,
    MainGenres.Action,
    AgeGroups.Kids,
    Eras.nnineties,
  ],
);
export const gamegear1 = new Commercial(
  'Game Gear 1',
  'gamegear1',
  26,
  '/path/gamegear1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const sonicandknuckles1 = new Commercial(
  'Sonic and Knuckles 1',
  'sonicandknuckles1',
  30,
  '/path/sonicandknuckles1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const banjokazooie1 = new Commercial(
  'Banjo Kazooie 1',
  'banjokazooie1',
  30,
  '/path/banjokazooie1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const fzero1 = new Commercial(
  'F-Zero 1',
  'fzero1',
  30,
  '/path/fzero1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const gauntletlegends1 = new Commercial(
  'Gauntlet Legends 1',
  'gauntletlegends1',
  30,
  '/path/gauntletlegends1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const halloween711 = new Commercial(
  'Halloween 7-11',
  'halloween711',
  30,
  '/path/halloween711.mp4',
  MediaType.Commercial,
  ['halloween', AgeGroups.AllAges, Eras.nnineties],
);
export const alientrailer1 = new Commercial(
  'Alien Trailer 1',
  'alientrailer1',
  30,
  '/path/alientrailer1.mp4',
  MediaType.Commercial,
  [
    'alien',
    MainGenres.SciFi,
    MainGenres.Horror,
    AgeGroups.Mature,
    Eras.nseventies,
  ],
);
export const americanwerewolfinlondontrailer1 = new Commercial(
  'American Werewolf in London Trailer 1',
  'americanwerewolfinlondontrailer1',
  30,
  '/path/americanwerewolfinlondontrailer1.mp4',
  MediaType.Commercial,
  [MainGenres.Horror, AgeGroups.Mature, Eras.neighties],
);
export const beetlejuicetrailer1 = new Commercial(
  'Beetlejuice Trailer 1',
  'beetlejuicetrailer1',
  30,
  '/path/beetlejuicetrailer1.mp4',
  MediaType.Commercial,
  [MainGenres.Horror, MainGenres.Comedy, AgeGroups.YoungAdult, Eras.neighties],
);
export const ocarinaoftimetrailer1 = new Commercial(
  'Ocarina of Time Trailer 1',
  'ocarinaoftimetrailer1',
  62,
  '/path/ocarinaoftimetrailer1.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const ijustshippedmybed = new Commercial(
  'I Just Shipped My Bed',
  'ijustshippedmybed',
  69,
  '/path/ijustshippedmybed.mp4',
  MediaType.Commercial,
  [MainGenres.Comedy, AgeGroups.AllAges, Eras.ttens],
);
export const cornpopsgolf = new Commercial(
  'Corn Pops Golf',
  'cornpopsgolf',
  30,
  '/path/cornpopsgolf.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const blacktronlegomaniac = new Commercial(
  'Blacktron Lego Maniac',
  'blacktronlegomaniac',
  30,
  '/path/blacktronlegomaniac.mp4',
  MediaType.Commercial,
  ['lego', AgeGroups.Kids, Eras.nnineties],
);
export const starttrektoys = new Commercial(
  'Star Trek Toys',
  'starttrektoys',
  30,
  '/path/starttrektoys.mp4',
  MediaType.Commercial,
  ['startrek', MainGenres.SciFi, AgeGroups.Kids, Eras.nnineties],
);
export const sharkbitesfruitsnacks = new Commercial(
  'Shark Bites Fruit Snacks',
  'sharkbitesfruitsnacks',
  30,
  '/path/sharkbitesfruitsnacks.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const ricecrispiescerealtalks = new Commercial(
  'Rice Crispies Cereal Talks',
  'ricecrispiescerealtalks',
  30,
  '/path/ricecrispiescerealtalks.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const pizzahutxmen = new Commercial(
  'Pizza Hut X-Men',
  'pizzahutxmen',
  30,
  '/path/pizzahutxmen.mp4',
  MediaType.Commercial,
  ['xmen', 'marvel', MainGenres.Action, AgeGroups.Kids, Eras.nnineties],
);
export const mcdonaldscrush = new Commercial(
  'McDonalds Crush',
  'mcdonaldscrush',
  30,
  '/path/mcdonaldscrush.mp4',
  MediaType.Commercial,
  [AgeGroups.Kids, Eras.nnineties],
);
export const transformers80s1 = new Commercial(
  'Transformers 80s 1',
  'transformers80s1',
  30,
  '/path/transformers80s1.mp4',
  MediaType.Commercial,
  [
    'transformers',
    MainGenres.Action,
    MainGenres.SciFi,
    AgeGroups.Kids,
    Eras.neighties,
  ],
);
export const alienstoys1 = new Commercial(
  'Aliens Toys 1',
  'alienstoys1',
  30,
  '/path/alienstoys1.mp4',
  MediaType.Commercial,
  [
    'alien',
    MainGenres.Horror,
    MainGenres.Action,
    MainGenres.SciFi,
    AgeGroups.Kids,
    Eras.nnineties,
  ],
);
export const jurassicpark3toys = new Commercial(
  'Jurassic Park 3 Toys',
  'jurassicpark3toys',
  30,
  '/path/jurassicpark3toys.mp4',
  MediaType.Commercial,
  ['jurassicpark', MainGenres.Action, AgeGroups.Kids, Eras.twothousands],
);

export const commercials = [
  jurassicparktoys1,
  marvelvsstreetfighter98,
  wildones,
  dreambuilders,
  jurassicparktoys2,
  jurassicparktoys3,
  littleoopsiedaisy,
  meninblacktoys97,
  monsterfacetoy,
  newbluemms,
  superduperdoublelooper,
  transformersbeastwarstoys,
  gamegear1,
  sonicandknuckles1,
  banjokazooie1,
  fzero1,
  gauntletlegends1,
  halloween711,
  alientrailer1,
  americanwerewolfinlondontrailer1,
  beetlejuicetrailer1,
  ocarinaoftimetrailer1,
  ijustshippedmybed,
  cornpopsgolf,
  blacktronlegomaniac,
  starttrektoys,
  sharkbitesfruitsnacks,
  ricecrispiescerealtalks,
  pizzahutxmen,
  mcdonaldscrush,
  transformers80s1,
  alienstoys1,
  jurassicpark3toys,
];

export const default1 = new Commercial(
  'Default 1',
  'default1',
  15,
  '/path/default1.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default2 = new Commercial(
  'Default 2',
  'default2',
  16,
  '/path/default2.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default3 = new Commercial(
  'Default 3',
  'default3',
  17,
  '/path/default3.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default4 = new Commercial(
  'Default 4',
  'default4',
  18,
  '/path/default4.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default5 = new Commercial(
  'Default 5',
  'default5',
  19,
  '/path/default5.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default6 = new Commercial(
  'Default 6',
  'default6',
  20,
  '/path/default6.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default7 = new Commercial(
  'Default 7',
  'default7',
  30,
  '/path/default7.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default8 = new Commercial(
  'Default 8',
  'default8',
  60,
  '/path/default8.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);
export const default9 = new Commercial(
  'Default 9',
  'default9',
  120,
  '/path/default9.mp4',
  MediaType.Commercial,
  [AgeGroups.AllAges],
);

export const defaultCommercials = [
  default1,
  default2,
  default3,
  default4,
  default5,
  default6,
  default7,
  default8,
  default9,
];

export const bufferCommercials = [];

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

export const sweetchildomine = new Music(
  'Sweet Child O Mine - Guns and Roses',
  'sweetchildomine-gunsandroses',
  293,
  '/path/sweetchildomine-gunsandroses.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges],
);
export const hotelcalifornia = new Music(
  'Hotel California - Eagles',
  'hotelcalifornia-eagles',
  369,
  '/path/hotelcalifornia-eagles.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges],
);
export const backinblack = new Music(
  'Back in Black - ACDC',
  'backinblack-acdc',
  255,
  '/path/backinblack-acdc.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges, 'ironman', 'marvel'],
);
export const heyjude = new Music(
  'Hey Jude - The Beatles',
  'heyjude-thebeatles',
  431,
  '/path/heyjude-thebeatles.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges],
);
export const alive = new Music(
  'Alive - Pearl Jam',
  'alive-pearljam',
  312,
  '/path/alive-pearljam.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges],
);
export const paranoid = new Music(
  'Paranoid - Black Sabbath',
  'paranoid-blacksabbath',
  172,
  '/path/paranoid-blacksabbath.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges],
);
export const one = new Music(
  'One - Metallica',
  'one-metallica',
  448,
  '/path/one-metallica.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges],
);
export const aceofspades = new Music(
  'Ace of Spades - Motorhead',
  'aceofspades-motorhead',
  170,
  '/path/aceofspades-motorhead.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges],
);
export const holydiver = new Music(
  'Holy Diver - Dio',
  'holydiver-dio',
  310,
  '/path/holydiver-dio.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges],
);
export const painkiller = new Music(
  'Painkiller - Judas Priest',
  'painkiller-judaspriest',
  399,
  '/path/painkiller-judaspriest.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges],
);
export const rapperdelight = new Music(
  'Rapper Delight - Sugarhill Gang',
  'rapperdelight-sugarhillgang',
  900,
  '/path/rapperdelight-sugarhillgang.mp4',
  MediaType.Music,
  [MusicGenres.HipHop, AgeGroups.AllAges],
);
export const loseyourself = new Music(
  'Lose Yourself - Eminem',
  'loseyourself-eminem',
  366,
  '/path/loseyourself-eminem.mp4',
  MediaType.Music,
  [MusicGenres.HipHop, AgeGroups.AllAges],
);
export const nystateofmind = new Music(
  'NY State of Mind - Nas',
  'nystateofmind-nas',
  241,
  '/path/nystateofmind-nas.mp4',
  MediaType.Music,
  [MusicGenres.HipHop, AgeGroups.AllAges],
);
export const blitzkriegbop = new Music(
  'Blitzkrieg Bop - The Ramones',
  'blitzkriegbop-theramones',
  144,
  '/path/blitzkriegbop-theramones.mp4',
  MediaType.Music,
  [MusicGenres.Punk, AgeGroups.AllAges],
);
export const anarchyintheuk = new Music(
  'Anarchy in the UK - Sex Pistols',
  'anarchyintheuk-sexpistols',
  210,
  '/path/anarchyintheuk-sexpistols.mp4',
  MediaType.Music,
  [MusicGenres.Punk, AgeGroups.AllAges],
);
export const londoncalling = new Music(
  'London Calling - The Clash',
  'londoncalling-theclash',
  199,
  '/path/londoncalling-theclash.mp4',
  MediaType.Music,
  [MusicGenres.Punk, AgeGroups.AllAges],
);
export const holidayincambodia = new Music(
  'Holiday in Cambodia - Dead Kennedys',
  'holidayincambodia-deadkennedys',
  211,
  '/path/holidayincambodia-deadkennedys.mp4',
  MediaType.Music,
  [MusicGenres.Punk, AgeGroups.AllAges],
);
export const louise = new Music(
  'Louise - Clan of Xymox',
  'louise-clanofxymox',
  292,
  '/path/louise-clanofxymox.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkWave, AgeGroups.AllAges],
);
export const hostofseraphim = new Music(
  'Host of Seraphim - Dead Can Dance',
  'hostofseraphim-deadcandance',
  366,
  '/path/hostofseraphim-deadcandance.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkWave, AgeGroups.AllAges],
);
export const duskislikeadagger = new Music(
  'Dusk is Like a Dagger - Attrition',
  'duskislikeadagger-attrition',
  292,
  '/path/duskislikeadagger-attrition.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkWave, AgeGroups.AllAges],
);
export const thetimehascomeandgone = new Music(
  'The Time Has Come and Gone - The Frozen Autumn',
  'thetimehascomeandgone-thefrozenautumn',
  292,
  '/path/thetimehascomeandgone-thefrozenautumn.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkWave, AgeGroups.AllAges],
);
export const ritüel = new Music(
  'Ritüel - She Past Away',
  'ritüel-shepastaway',
  292,
  '/path/ritüel-shepastaway.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkWave, AgeGroups.AllAges],
);
export const headlikeahole = new Music(
  'Head Like a Hole - Nine Inch Nails',
  'headlikeahole-nineinchnails',
  292,
  '/path/headlikeahole-nineinchnails.mp4',
  MediaType.Music,
  [MusicSubGenres.IndustrialRock, AgeGroups.AllAges],
);
export const stigmata = new Music(
  'Stigmata - Ministry',
  'stigmata-ministry',
  292,
  '/path/stigmata-ministry.mp4',
  MediaType.Music,
  [MusicSubGenres.IndustrialRock, AgeGroups.AllAges],
);
export const adrugagainstwar = new Music(
  'A Drug Against War - KMFDM',
  'adrugagainstwar-kmfdm',
  292,
  '/path/adrugagainstwar-kmfdm.mp4',
  MediaType.Music,
  [MusicSubGenres.IndustrialRock, AgeGroups.AllAges],
);
export const dragula = new Music(
  'Dragula - Rob Zombie',
  'dragula-robzombie',
  292,
  '/path/dragula-robzombie.mp4',
  MediaType.Music,
  [MusicSubGenres.IndustrialRock, AgeGroups.AllAges],
);
export const thebeautifulpeople = new Music(
  'The Beautiful People - Marilyn Manson',
  'thebeautifulpeople-marilynmanson',
  292,
  '/path/thebeautifulpeople-marilynmanson.mp4',
  MediaType.Music,
  [MusicSubGenres.IndustrialRock, AgeGroups.AllAges],
);
export const nightcall = new Music(
  'Nightcall - Kavinsky',
  'nightcall-kavinsky',
  292,
  '/path/nightcall-kavinsky.mp4',
  MediaType.Music,
  [MusicSubGenres.Synthwave, AgeGroups.AllAges],
);
export const neotokyo = new Music(
  'Neotokyo - Purturbator',
  'neotokyo-purturbator',
  292,
  '/path/neotokyo-purturbator.mp4',
  MediaType.Music,
  [MusicSubGenres.Synthwave, AgeGroups.AllAges],
);
export const daysofthunder = new Music(
  'Days of Thunder - The Midnight',
  'daysofthunder-themidnight',
  292,
  '/path/daysofthunder-themidnight.mp4',
  MediaType.Music,
  [MusicSubGenres.Synthwave, AgeGroups.AllAges],
);
export const turbokiller = new Music(
  'Turbokiller - Carpenter Brut',
  'turbokiller-carpenterbrut',
  292,
  '/path/turbokiller-carpenterbrut.mp4',
  MediaType.Music,
  [MusicSubGenres.Synthwave, AgeGroups.AllAges],
);
export const technoir = new Music(
  'Technoir - Gunship',
  'technoir-gunship',
  292,
  '/path/technoir-gunship.mp4',
  MediaType.Music,
  [MusicSubGenres.Synthwave, AgeGroups.AllAges],
);
export const requiemiikyrie = new Music(
  'Requiem II. Kyrie - György Ligeti',
  'requiemiikyrie-gyorgyligeti',
  292,
  '/path/requiemiikyrie-gyorgyligeti.mp4',
  MediaType.Music,
  [MusicSubGenres.AvantGarde, AgeGroups.AllAges],
);
export const sonatasandinterludes = new Music(
  'Sonatas and Interludes - John Cage',
  'sonatasandinterludes-johncage',
  292,
  '/path/sonatasandinterludes-johncage.mp4',
  MediaType.Music,
  [MusicSubGenres.AvantGarde, AgeGroups.AllAges],
);
export const stimmung = new Music(
  'Stimmung - Karlheinz Stockhausen',
  'stimmung-karlheinzstockhausen',
  292,
  '/path/stimmung-karlheinzstockhausen.mp4',
  MediaType.Music,
  [MusicSubGenres.AvantGarde, AgeGroups.AllAges],
);
export const anendingascent = new Music(
  'An Ending, Ascent - Brian Eno',
  'anendingascent-brianeno',
  292,
  '/path/anendingascent-brianeno.mp4',
  MediaType.Music,
  [MusicSubGenres.Ambient, AgeGroups.AllAges],
);
export const no3 = new Music(
  '#3 - Aphex Twin',
  'no3-aphextwin',
  292,
  '/path/no3-aphextwin.mp4',
  MediaType.Music,
  [MusicSubGenres.Ambient, AgeGroups.AllAges],
);
export const deepstaria = new Music(
  'Deepstaria - Hello Meteor',
  'deepstaria-hellometeor',
  292,
  '/path/deepstaria-hellometeor.mp4',
  MediaType.Music,
  [MusicSubGenres.Ambient, AgeGroups.AllAges],
);
export const bluemoonstation = new Music(
  'Blue Moon Station - Solar Fields',
  'bluemoonstation-solarfields',
  292,
  '/path/bluemoonstation-solarfields.mp4',
  MediaType.Music,
  [MusicSubGenres.Ambient, AgeGroups.AllAges],
);
export const kobresia = new Music(
  'Kobresia - Biosphere',
  'kobresia-biosphere',
  292,
  '/path/kobresia-biosphere.mp4',
  MediaType.Music,
  [MusicSubGenres.Ambient, AgeGroups.AllAges],
);
export const onthenatureofdaylight = new Music(
  'On the Nature of Daylight - Max Richter',
  'onthenatureofdaylight-maxrichter',
  292,
  '/path/onthenatureofdaylight-maxrichter.mp4',
  MediaType.Music,
  [MusicSubGenres.NeoClassical, AgeGroups.AllAges],
);
export const re = new Music(
  'Re - Nil Frahm',
  're-nilfrahm',
  292,
  '/path/re-nilfrahm.mp4',
  MediaType.Music,
  [MusicSubGenres.NeoClassical, AgeGroups.AllAges],
);
export const nuvole = new Music(
  'Nuvole Bianche - Ludovico Einaudi',
  'nuvolebianche-ludovicoeinaudi',
  292,
  '/path/nuvolebianche-ludovicoeinaudi.mp4',
  MediaType.Music,
  [MusicSubGenres.NeoClassical, AgeGroups.AllAges],
);
export const saman = new Music(
  'Saman - Ólafur Arnalds',
  'saman-olafurarnalds',
  292,
  '/path/saman-olafurarnalds.mp4',
  MediaType.Music,
  [MusicSubGenres.NeoClassical, AgeGroups.AllAges],
);
export const abovo = new Music(
  'Abovo - Joep Beving',
  'abovo-joepbeving',
  292,
  '/path/abovo-joepbeving.mp4',
  MediaType.Music,
  [MusicSubGenres.NeoClassical, AgeGroups.AllAges],
);
export const xerroxisola = new Music(
  'Xerrox Isola - Alva Noto',
  'xerroxisola-alvanoto',
  292,
  '/path/xerroxisola-alvanoto.mp4',
  MediaType.Music,
  [MusicSubGenres.ElectronicMinimalist, AgeGroups.AllAges],
);
export const dexter = new Music(
  'Dexter - Ricardo Villalobos',
  'dexter-ricardovillalobos',
  292,
  '/path/dexter-ricardovillalobos.mp4',
  MediaType.Music,
  [MusicSubGenres.ElectronicMinimalist, AgeGroups.AllAges],
);
export const sticktomyside = new Music(
  'Stick to My Side - Pantha du Prince',
  'sticktomyside-panthaduprince',
  292,
  '/path/sticktomyside-panthaduprince.mp4',
  MediaType.Music,
  [MusicSubGenres.ElectronicMinimalist, AgeGroups.AllAges],
);
export const camino = new Music(
  'Camino - Murcof',
  'camino-murcof',
  292,
  '/path/camino-murcof.mp4',
  MediaType.Music,
  [MusicSubGenres.ElectronicMinimalist, AgeGroups.AllAges],
);
export const easthastings = new Music(
  'East Hastings - Godspeed You! Black Emperor',
  'easthastings-godspeedyoublackemperor',
  292,
  '/path/easthastings-godspeedyoublackemperor.mp4',
  MediaType.Music,
  [MusicSubGenres.PostRock, AgeGroups.AllAges],
);
export const yourhandinmine = new Music(
  'Your Hand in Mine - Explosions in the Sky',
  'yourhandinmine-explosionsinthesky',
  292,
  '/path/yourhandinmine-explosionsinthesky.mp4',
  MediaType.Music,
  [MusicSubGenres.PostRock, AgeGroups.AllAges],
);
export const mogwaifearsatan = new Music(
  'Mogwai Fear Satan - Mogwai',
  'mogwaifearsatan-mogwai',
  292,
  '/path/mogwaifearsatan-mogwai.mp4',
  MediaType.Music,
  [MusicSubGenres.PostRock, AgeGroups.AllAges],
);
export const untitledno3 = new Music(
  'Untitled #3 - Sigur Rós',
  'untitledno3-sigurros',
  292,
  '/path/untitledno3-sigurros.mp4',
  MediaType.Music,
  [MusicSubGenres.PostRock, AgeGroups.AllAges],
);
export const ashesinthesnow = new Music(
  'Ashes in the Snow - Mono',
  'ashesinthesnow-mono',
  292,
  '/path/ashesinthesnow-mono.mp4',
  MediaType.Music,
  [MusicSubGenres.PostRock, AgeGroups.AllAges],
);
export const thedarkplacesoftheearth = new Music(
  'The Dark Places of the Earth - Lustmord',
  'thedarkplacesoftheearth-lustmord',
  292,
  '/path/thedarkplacesoftheearth-lustmord.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkAmbient, AgeGroups.AllAges],
);
export const endtitles = new Music(
  'End Titles - Atrium Carceri',
  'endtitles-atriumcarceri',
  292,
  '/path/endtitles-atriumcarceri.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkAmbient, AgeGroups.AllAges],
);
export const reflectinginshadows = new Music(
  'Reflecting in Shadows - Kammarheit',
  'reflectinginshadows-kammarheit',
  292,
  '/path/reflectinginshadows-kammarheit.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkAmbient, AgeGroups.AllAges],
);
export const hypnagogic = new Music(
  'Hypnagogic - Kammarheit',
  'hypnagogic-kammarheit',
  292,
  '/path/hypnagogic-kammarheit.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkAmbient, AgeGroups.AllAges],
);
export const twoonefourfive = new Music(
  '2145 - Sabled Sun',
  '2145-sabledsun',
  292,
  '/path/2145-sabledsun.mp4',
  MediaType.Music,
  [MusicSubGenres.DarkAmbient, AgeGroups.AllAges],
);
export const hajnal = new Music(
  'Hajnal - Venetian Snares',
  'hajnal-venetiansnares',
  292,
  '/path/hajnal-venetiansnares.mp4',
  MediaType.Music,
  [MusicSubGenres.Breakcore, AgeGroups.AllAges],
);
export const nostep = new Music(
  'No Step - Bong-Ra',
  'nostep-bongra',
  292,
  '/path/nostep-bongra.mp4',
  MediaType.Music,
  [MusicSubGenres.Breakcore, AgeGroups.AllAges],
);
export const thesoundoftheunderground = new Music(
  'The Sound of the Underground - Shitmat',
  'thesoundoftheunderground-shitmat',
  292,
  '/path/thesoundoftheunderground-shitmat.mp4',
  MediaType.Music,
  [MusicSubGenres.Breakcore, AgeGroups.AllAges],
);
export const manicpanic = new Music(
  'Manic Panic - Otto Von Schirach',
  'manicpanic-ottovonschirach',
  292,
  '/path/manicpanic-ottovonschirach.mp4',
  MediaType.Music,
  [MusicSubGenres.Breakcore, AgeGroups.AllAges],
);
export const blackacid = new Music(
  'Black Acid - Enduser',
  'blackacid-enduser',
  292,
  '/path/blackacid-enduser.mp4',
  MediaType.Music,
  [MusicSubGenres.Breakcore, AgeGroups.AllAges],
);
export const hereitschristmastime = new Music(
  "Here It's Christmas Time - Kevin Bacon",
  'hereitschristmastime-kevinbacon',
  292,
  '/path/hereitschristmastime-kevinbacon.mp4',
  MediaType.Music,
  [MusicGenres.Pop, AgeGroups.AllAges, 'christmas', 'marvel'],
);
export const allIwantforchristmasisyou = new Music(
  'All I Want for Christmas is You - Mariah Carey',
  'alliwantforchristmasisyou-mariahcarey',
  292,
  '/path/alliwantforchristmasisyou-mariahcarey.mp4',
  MediaType.Music,
  [MusicGenres.Pop, AgeGroups.AllAges, 'christmas'],
);
export const kidnapthesandyclaws = new Music(
  'Kidnap the Sandy Claws - Korn',
  'kidnapthesandyclaws-korn',
  292,
  '/path/kidnapthesandyclaws-korn.mp4',
  MediaType.Music,
  [MusicGenres.Metal, AgeGroups.AllAges, 'christmas', 'halloween'],
);
export const monstermash = new Music(
  'Monster Mash - Bobby Pickett',
  'monstermash-bobbypickett',
  292,
  '/path/monstermash-bobbypickett.mp4',
  MediaType.Music,
  [MusicGenres.Pop, AgeGroups.AllAges, 'halloween'],
);
export const comeandgetyourlove = new Music(
  'Come and Get Your Love - Redbone',
  'comeandgetyourlove-redbone',
  292,
  '/path/comeandgetyourlove-redbone.mp4',
  MediaType.Music,
  [MusicGenres.Rock, AgeGroups.AllAges, 'guardiansofthegalaxy', 'marvel'],
);
export const ohhchild = new Music(
  'Ohh Child - The Five Stairsteps',
  'ohhchild-thefivestairsteps',
  292,
  '/path/ohhchild-thefivestairsteps.mp4',
  MediaType.Music,
  [MusicGenres.RnB, AgeGroups.AllAges, 'guardiansofthegalaxy', 'marvel'],
);

export const music = [
  sweetchildomine,
  hotelcalifornia,
  backinblack,
  heyjude,
  alive,
  paranoid,
  one,
  aceofspades,
  holydiver,
  painkiller,
  rapperdelight,
  loseyourself,
  nystateofmind,
  blitzkriegbop,
  anarchyintheuk,
  londoncalling,
  holidayincambodia,
  louise,
  hostofseraphim,
  duskislikeadagger,
  thetimehascomeandgone,
  ritüel,
  headlikeahole,
  stigmata,
  adrugagainstwar,
  dragula,
  thebeautifulpeople,
  nightcall,
  neotokyo,
  daysofthunder,
  turbokiller,
  technoir,
  requiemiikyrie,
  sonatasandinterludes,
  stimmung,
  anendingascent,
  no3,
  deepstaria,
  bluemoonstation,
  kobresia,
  onthenatureofdaylight,
  re,
  nuvole,
  saman,
  abovo,
  xerroxisola,
  dexter,
  sticktomyside,
  camino,
  easthastings,
  yourhandinmine,
  mogwaifearsatan,
  untitledno3,
  ashesinthesnow,
  thedarkplacesoftheearth,
  endtitles,
  reflectinginshadows,
  hypnagogic,
  twoonefourfive,
  hajnal,
  nostep,
  thesoundoftheunderground,
  manicpanic,
  blackacid,
  hereitschristmastime,
  allIwantforchristmasisyou,
  kidnapthesandyclaws,
  monstermash,
  comeandgetyourlove,
  ohhchild,
];

export const nonHolidayMusic = [
  sweetchildomine,
  hotelcalifornia,
  backinblack,
  heyjude,
  alive,
  paranoid,
  one,
  aceofspades,
  holydiver,
  painkiller,
  rapperdelight,
  loseyourself,
  nystateofmind,
  blitzkriegbop,
  anarchyintheuk,
  londoncalling,
  holidayincambodia,
  louise,
  hostofseraphim,
  duskislikeadagger,
  thetimehascomeandgone,
  ritüel,
  headlikeahole,
  stigmata,
  adrugagainstwar,
  dragula,
  thebeautifulpeople,
  nightcall,
  neotokyo,
  daysofthunder,
  turbokiller,
  technoir,
  requiemiikyrie,
  sonatasandinterludes,
  stimmung,
  anendingascent,
  no3,
  deepstaria,
  bluemoonstation,
  kobresia,
  onthenatureofdaylight,
  re,
  nuvole,
  saman,
  abovo,
  xerroxisola,
  dexter,
  sticktomyside,
  camino,
  easthastings,
  yourhandinmine,
  mogwaifearsatan,
  untitledno3,
  ashesinthesnow,
  thedarkplacesoftheearth,
  endtitles,
  reflectinginshadows,
  hypnagogic,
  twoonefourfive,
  hajnal,
  nostep,
  thesoundoftheunderground,
  manicpanic,
  blackacid,
  comeandgetyourlove,
  ohhchild,
];

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
