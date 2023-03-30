import { Show } from "../models/show";
import { Movie } from "../models/movie";
import { Short } from "../models/short";
import { Music } from "../models/music";
import { Promo } from "../models/promo";
import { Commercial } from "../models/commercial";
import { Collection } from "../models/collection";
import { Media } from "../models/media";
import { MediaProgression } from "../models/mediaProgression";
import { TranslationTag } from "../models/translationTag";

const shows = require("../data/showList.json");
const movies = require("../data/movieList.json");
const shorts = require("../data/shortList.json");
const music = require("../data/musicList.json");
const promos = require("../data/promoList.json");
const commercials = require("../data/commercialList.json");
const collections = require("../data/collectionList.json");
const progression = require('./data/progression.json');
const transaltionTags = require('./data/translationTags.json');

export function loadMedia(): Media {
    const media: Media = {
        Shows: loadShows(),
        Movies: loadMovies(),
        Shorts: loadShorts(),
        Music: loadMusic(),
        Promos: loadPromos(),
        Commercials: loadCommercials(),
        Collections: loadCollections()
    }
    return media;
}

export function loadProgression() {
    return JSON.parse(progression) as MediaProgression[];
}

export function loadTranslationTags() {
    return JSON.parse(transaltionTags) as TranslationTag[];
}

function loadShows() {
    return JSON.parse(shows) as Show[];
}

function loadMovies() {
    return JSON.parse(movies) as Movie[];
}

function loadShorts() {
    return JSON.parse(shorts) as Short[];
}

function loadMusic() {
    return JSON.parse(music) as Music[];
}

function loadPromos() {
    return JSON.parse(music) as Promo[];
}

function loadCommercials() {
    return JSON.parse(commercials) as Commercial[];
}

function loadCollections() {
    return JSON.parse(collections) as Collection[];
}

