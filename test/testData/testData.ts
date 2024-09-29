import { Commercial } from "../../src/models/commercial";
import { MediaType } from "../../src/models/enum/mediaTypes";
import { Movie } from "../../src/models/movie";
import { ProgressionContext, WatchRecord } from "../../src/models/progressionContext";
import { Episode, Show } from "../../src/models/show";

export const inception = new Movie('Inception', 'inception', 'inception', 'tt1375666', ['scifi'], '/path/inception.mp4', 8880, 9000, '', 0);
export const matrix = new Movie('The Matrix', 'thematrix', 'matrix', 'tt0133093', ['action'], '/path/matrix.mp4', 8160, 9000, '', 1);
export const interstellar = new Movie('Interstellar', 'interstellar', 'interstellar', 'tt0816692', ['scifi'], '/path/interstellar.mp4', 10140, 10800, '', 0);
export const dune = new Movie('Dune', 'dune', 'dune', 'tt1160419', ['scifi'], '/path/dune.mp4', 9120, 10800, '', 1);

export const sailor = new Show('Sailor Moon', 'sailormoon', 'sailormoon', 'tt0103369', 1800, false, false, ['fantasy', 'action'], [], 5, [
    new Episode(1, 1, 1, '/path/sailormoon1.mp4', "A Moon Star is Born", "", 1448, 1800, []),
    new Episode(1, 2, 2, '/path/sailormoon2.mp4', "Punishment Awaits! The House of Fortune is the Monster Mansion", "", 1449, 1800, []),
    new Episode(1, 3, 3, '/path/sailormoon3.mp4', "Talk Radio", "", 1448, 1800, []),
    new Episode(1, 4, 4, '/path/sailormoon4.mp4', "Slim City", "", 1449, 1800, []),
    new Episode(1, 5, 5, '/path/sailormoon5.mp4', "So You Want to be a Superstar", "", 1447, 1800, [])
]);
export const reboot = new Show('Reboot', 'reboot', 'reboot', 'tt0108903', 1800, false, false, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/reboot1.mp4', "The Tearing", "", 1353, 1800, []),
    new Episode(1, 2, 2, '/path/reboot2.mp4', "Racing the Clock", "", 1355, 1800, []),
    new Episode(1, 3, 3, '/path/reboot3.mp4', "Quick and the Fed", "", 1340, 1800, []),
    new Episode(1, 4, 4, '/path/reboot4.mp4', "Medusa Bug", "", 1354, 1800, []),
    new Episode(1, 5, 5, '/path/reboot5.mp4', "In the Belly of the Beast", "", 1353, 1800, [])
]);
export const dragonballz = new Show('Dragon Ball Z', 'dragonballz', 'dragonballz', 'tt0214341', 1800, false, false, ['action', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/dragonballz1.mp4', "The New Threat", "", 1244, 1800, []),
    new Episode(1, 2, 2, '/path/dragonballz2.mp4', "Reunions", "", 1165, 1800, []),
    new Episode(1, 3, 3, '/path/dragonballz3.mp4', "Unlikely Alliance", "", 1188, 1800, []),
    new Episode(1, 4, 4, '/path/dragonballz4.mp4', "Piccolo's Plan", "", 1166, 1800, []),
    new Episode(1, 5, 5, '/path/dragonballz5.mp4', "Gohan's Rage", "", 1189, 1800, [])
]);
export const gundam = new Show('Gundam Wing', 'gundamwing', 'gundamwing', 'tt0122816', 1800, false, false, ['scifi', 'action'], [], 5, [
    new Episode(1, 1, 1, '/path/gundamwing1.mp4', "The Shooting Star She Saw", "", 1437, 1800, []),
    new Episode(1, 2, 2, '/path/gundamwing2.mp4', "The Gundam Deathscythe", "", 1442, 1800, []),
    new Episode(1, 3, 3, '/path/gundamwing3.mp4', "Five Gundams Confirmed", "", 1441, 1800, []),
    new Episode(1, 4, 4, '/path/gundamwing4.mp4', "The Victoria Nightmare", "", 1442, 1800, []),
    new Episode(1, 5, 5, '/path/gundamwing5.mp4', "Relena's Secret", "", 1442, 1800, [])
]);
export const tenchi = new Show('Tenchi Muyo', 'tenchimuyo', 'tenchimuyo', 'tt0108921', 1800, true, false, ['scifi', 'comedy'], [], 5, [
    new Episode(1, 4, 1, '/path/tenchimuyo1.mp4', "Mihoshi Falls to the Land of Stars", "", 1778, 1800, []),
    new Episode(1, 5, 2, '/path/tenchimuyo2.mp4', "Kagato Attacks!", "", 1779, 1800, []),
    new Episode(1, 6, 3, '/path/tenchimuyo3.mp4', "We Need Tenchi", "", 1750, 1800, []),
    new Episode(1, 7, 4, '/path/tenchimuyo4.mp4', "The Night Before the Carnival", "", 2590, 3600, []),
    new Episode(2, 1, 5, '/path/tenchimuyo5.mp4', "Hello Baby!", "", 1721, 1800, [])
]);
export const batman = new Show('Batman: The Animated Series', 'batmantheanimatedseries', 'batman', 'tt0103359', 1800, false, false, ['action', 'drama'], [], 5, [
    new Episode(1, 1, 1, '/path/batman1.mp4', "On Leather Wings", "", 1341, 1800, []),
    new Episode(1, 2, 2, '/path/batman2.mp4', "Christmas with the Joker", "", 1342, 1800, []),
    new Episode(1, 3, 3, '/path/batman3.mp4', "Nothing to Fear", "", 1345, 1800, []),
    new Episode(1, 4, 4, '/path/batman4.mp4', "The Last Laugh", "", 1338, 1800, []),
    new Episode(1, 5, 5, '/path/batman5.mp4', "Pretty Poison", "", 1340, 1800, [])
]);
export const startrek = new Show('Star Trek: The Next Generation', 'startrekthenextgeneration', 'startrek', 'tt0092455', 3600, true, true, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/startrek1.mp4', "Encounter at Farpoint", "", 5484, 7200, []),
    new Episode(1, 2, 2, '/path/startrek2.mp4', "The Naked Now", "", 2763, 3600, []),
    new Episode(1, 3, 3, '/path/startrek3.mp4', "Code of Honor", "", 2763, 3600, []),
    new Episode(1, 4, 4, '/path/startrek4.mp4', "The Last Outpost", "", 2763, 3600, []),
    new Episode(1, 5, 5, '/path/startrek5.mp4', "Where No One Has Gone Before", "", 2756, 3600, [])
]);

export const farscape = new Show('Farscape', 'farscape', 'farscape', 'tt0187636', 3600, false, false, ['scifi', 'adventure'], [], 5, [
    new Episode(1, 1, 1, '/path/farscape1.mp4', "Premiere", "", 2921, 3600, []),
    new Episode(1, 2, 2, '/path/farscape2.mp4', "I, E.T.", "", 2887, 3600, []),
    new Episode(1, 3, 3, '/path/farscape3.mp4', "Exodus from Genesis", "", 2976, 3600, []),
    new Episode(1, 4, 4, '/path/farscape5.mp4', "Back and Back and Back to the Future", "", 2887, 3600, []),
    new Episode(1, 5, 5, '/path/farscape4.mp4', "Throne for a Loss", "", 2888, 3600, [])

]);

export const sailorWatchRecord = new WatchRecord('Sailor Moon', 'sailormoon', 0, 0, 1800);
export const rebootWatchRecord = new WatchRecord('Reboot', 'reboot', 1, 0, 1800);
export const gundamWatchRecord = new WatchRecord('Gundam Wing', 'gundamwing', 3, 0, 1800);
export const tenchiWatchRecord = new WatchRecord('Tenchi Muyo', 'tenchimuyo', 2, 0, 1800);
export const batmanWatchRecord = new WatchRecord('Batman: The Animated Series', 'batmantheanimatedseries', 5, 0, 1800);
export const startrekWatchRecord = new WatchRecord('Star Trek: The Next Generation', 'startrekthenextgeneration', 0, 0, 7200);

export const continuousProgression = new ProgressionContext('Continuous', 'continuous', 'Test', 0, [
    sailorWatchRecord,
    rebootWatchRecord,
    gundamWatchRecord,
    tenchiWatchRecord,
    batmanWatchRecord,
    startrekWatchRecord
]);

export const jurassicparktoys1 = new Commercial('Jurassic Park Toys 1', 'jurassicparktoys1', 10, '/path/jurassicparktoys1.mp4', MediaType.Commercial, ["action", "1990s", "kids", "jurassicpark"]);
export const marvelvsstreetfighter98 = new Commercial('98 Marvel vs StreetFighter', '98marvelvsstreetfighter', 15, '/path/98marvelvsstreetfighter.mp4', MediaType.Commercial, ["marvel", "streetfighter", "1990s", "action", "1990s", "kids"]);
export const wildones = new Commercial('Wild Ones', 'wildones', 15, '/path/wildones.mp4', MediaType.Commercial, ["action", "1990s", "kids"]);
export const dreambuilders = new Commercial('Dream Builders', 'dreambuilders', 15, '/path/dreambuilders.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const jurrassicparktoys2 = new Commercial('93 Jurassic Park Toys 2', '93 jurassicparktoys2', 15, '/path/jurassicparktoys2.mp4', MediaType.Commercial, ["action", "1990s", "kids", "jurassicpark"]);
export const jurrassicparktoys3 = new Commercial('93 Jurassic Park Toys 3', '93 jurassicparktoys3', 15, '/path/jurassicparktoys3.mp4', MediaType.Commercial, ["action", "1990s", "kids", "jurassicpark"]);
export const littleoopsiedaisy = new Commercial('Little Oopsie Daisy', 'littleoopsiedaisy', 15, '/path/littleoopsiedaisy.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const meninblacktoys97 = new Commercial('97 Men in Black Toys', '97meninblacktoys', 15, '/path/97meninblacktoys.mp4', MediaType.Commercial, ["action", "scifi", "1990s", "kids", "meninblack"]);
export const monsterfacetoy = new Commercial('Monster Face Toy', 'monsterfacetoy', 15, '/path/monsterfacetoy.mp4', MediaType.Commercial, ["horror", "1990s", "kids", "halloween"]);
export const newbluemms = new Commercial('New Blue M&Ms', 'newbluemms', 15, '/path/newbluemms.mp4', MediaType.Commercial, ["1990s"]);
export const superduperdoublelooper = new Commercial('Super Duper Double Looper', 'superduperdoublelooper', 15, '/path/superduperdoublelooper.mp4', MediaType.Commercial, ["action", "1990s", "kids"]);
export const transformersbeastwarstoys = new Commercial('Transformers Beast Wars Toys', 'transformersbeastwarstoys', 15, '/path/transformersbeastwarstoys.mp4', MediaType.Commercial, ["action", "scifi", "1990s", "kids", "transformers"]);
export const gamegear1 = new Commercial('Game Gear 1', 'gamegear1', 26, '/path/gamegear1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const sonicandknuckles1 = new Commercial('Sonic and Knuckles 1', 'sonicandknuckles1', 30, '/path/sonicandknuckles1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const banjokazooie1 = new Commercial('Banjo Kazooie 1', 'banjokazooie1', 30, '/path/banjokazooie1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const fzero1 = new Commercial('F-Zero 1', 'fzero1', 30, '/path/fzero1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const gauntletlegends1 = new Commercial('Gauntlet Legends 1', 'gauntletlegends1', 30, '/path/gauntletlegends1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const halloween711 = new Commercial('Halloween 7-11', 'halloween711', 30, '/path/halloween711.mp4', MediaType.Commercial, ["1990s", "halloween"]);
export const alientrailer1 = new Commercial('Alien Trailer 1', 'alientrailer1', 30, '/path/alientrailer1.mp4', MediaType.Commercial, ["scifi", "horror", "1970s", "alien"]);
export const americanwerewolfinlondontrailer1 = new Commercial('American Werewolf in London Trailer 1', 'americanwerewolfinlondontrailer1', 30, '/path/americanwerewolfinlondontrailer1.mp4', MediaType.Commercial, ["horror", "1980s"]);
export const beetlejuicetrailer1 = new Commercial('Beetlejuice Trailer 1', 'beetlejuicetrailer1', 30, '/path/beetlejuicetrailer1.mp4', MediaType.Commercial, ["horror", "comedy", "1980s"]);
export const ocarinaoftimetrailer1 = new Commercial('Ocarina of Time Trailer 1', 'ocarinaoftimetrailer1', 62, '/path/ocarinaoftimetrailer1.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const ijustshippedmybed = new Commercial('I Just Shipped My Bed', 'ijustshippedmybed', 69, '/path/ijustshippedmybed.mp4', MediaType.Commercial, ["comedy", "2010s"]);
export const cornpopsgolf = new Commercial('Corn Pops Golf', 'cornpopsgolf', 30, '/path/cornpopsgolf.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const blacktronlegomaniac = new Commercial('Blacktron Lego Maniac', 'blacktronlegomaniac', 30, '/path/blacktronlegomaniac.mp4', MediaType.Commercial, ["1990s", "kids", "lego"]);
export const starttrektoys = new Commercial('Star Trek Toys', 'starttrektoys', 30, '/path/starttrektoys.mp4', MediaType.Commercial, ["scifi", "1990s", "kids", "startrek"]);
export const sharkbitesfruitsnacks = new Commercial('Shark Bites Fruit Snacks', 'sharkbitesfruitsnacks', 30, '/path/sharkbitesfruitsnacks.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const ricecrispiescerealtalks = new Commercial('Rice Crispies Cereal Talks', 'ricecrispiescerealtalks', 30, '/path/ricecrispiescerealtalks.mp4', MediaType.Commercial, ["1990s", "kids"]);
export const pizzahutxmen = new Commercial('Pizza Hut X-Men', 'pizzahutxmen', 30, '/path/pizzahutxmen.mp4', MediaType.Commercial, ["action", "1990s", "kids", "xmen", "marvel"]);
export const mcdonaldscrush = new Commercial('McDonalds Crush', 'mcdonaldscrush', 30, '/path/mcdonaldscrush.mp4', MediaType.Commercial, ["1990s", "kids"]);

export const commercials = [
    jurassicparktoys1,
    marvelvsstreetfighter98,
    wildones,
    dreambuilders,
    jurrassicparktoys2,
    jurrassicparktoys3,
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
    mcdonaldscrush
];