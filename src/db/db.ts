import mongoose from "mongoose";
import { ShowModel, Show } from '../models/show';
import { MovieModel, Movie } from '../models/movie';
import { PromoModel, Promo } from '../models/promo';
import { CommercialModel, Commercial } from '../models/commercial';
import { MusicModel, Music } from '../models/music';
import { ShortModel, Short } from '../models/short';
import { MediaProgressionModel, MediaProgression, Progression } from '../models/mediaProgression';
import { EnvConfigurationModel, EnvConfiguration } from "../models/v1/envConfiguration";
import { getConfig } from "../services/streamManager";
import { Config } from "../models/config";

const uri: string = "mongodb://127.0.0.1:27017/streamAssistantMedia";
export async function connectToDB() {
    mongoose.set('debug', true);
    await mongoose.connect(uri)
        .then(() => {
            console.log("Connected to Mongo");
        }, (err) => {
            console.log("Error connecting to Mongo: ", err);
        });
}

export async function LoadMovies(): Promise<Movie[]> {
    const movies = await MovieModel.find() as Movie[];

    if (!movies || movies.length === 0) {
        console.log("No Movies Found");
        return [];
    }
    console.log(movies.length + " Movies loaded");
    return movies;
}

export async function LoadShows(): Promise<Show[]> {
    const shows = await ShowModel.find() as Show[];

    if (!shows || shows.length === 0) {
        console.log("No Shows Found");
        return [];
    }
    console.log(shows.length + " Shows loaded");
    return shows;
}

export async function LoadPromos(): Promise<Promo[]> {
    const promos = await PromoModel.find() as Promo[];

    if (!promos || promos.length === 0) {
        console.log("No Promos Found");
        return [];
    }
    console.log(promos.length + " Promos loaded");
    return promos;
}

export async function LoadCommercials(): Promise<Commercial[]> {
    const commercials = await CommercialModel.find() as Commercial[];

    if (!commercials || commercials.length === 0) {
        console.log("No Commercials Found");
        return [];
    }
    console.log(commercials.length + " Commercials loaded");
    return commercials;
}

export async function LoadMusic(): Promise<Music[]> {
    const music = await MusicModel.find();

    if (!music || music.length === 0) {
        console.log("No Music Found");
        return [];
    }
    console.log(music.length + " Music loaded");
    return music;
}

export async function LoadShorts(): Promise<Short[]> {
    const shorts = await ShortModel.find();

    if (!shorts || shorts.length === 0) {
        console.log("No Shorts Found");
        return [];
    }
    console.log(shorts.length + " Shorts loaded");
    return shorts;
}

export async function LoadProgression(): Promise<any> {
    const progression = await MediaProgressionModel.find();

    if (!progression || progression.length === 0) {
        console.log("No Progression Found");
        return [];
    }
    console.log(progression.length + " Progression loaded");
    return progression;
}

export async function AddOrUpdateProgression(progressionTitle: string, progressionLoadTitle: string, mediaTitle: string, mediaLoadTitle: string, episode: number): Promise<void> {
    const mediaProgression = await MediaProgressionModel.findOne({ LoadTitle: progressionLoadTitle });
    const progression = new Progression(mediaTitle, mediaLoadTitle, episode, 0);

    if (!mediaProgression) {
        // Create new Media Progression
        const newMediaProgression = new MediaProgressionModel({ Title: progressionTitle, LoadTitle: progressionLoadTitle, Progressions: [progression] });
        // Add Media Progression to DB
        await newMediaProgression.save();
        return;
    }

    const episodeIndex = mediaProgression.Progressions.findIndex(episode => episode.LoadTitle === mediaLoadTitle);
    if (episodeIndex === -1) {
        mediaProgression.Progressions.push(progression);
    } else {
        mediaProgression.Progressions[episodeIndex].Episode = episode;
    }

    await MediaProgressionModel.updateOne({ _id: mediaProgression._id }, mediaProgression);
}

export async function GetDefaultEnvConfiguration(): Promise<EnvConfiguration> {
    let envConfig = await EnvConfigurationModel.findOne({ LoadTitle: "default" });
    let config: Config = getConfig();
    if (!envConfig) {
        console.log("No Default Environment Configuration Found, Creating Default Configuration");
        let newEnvConfig = new EnvConfigurationModel({ Title: "Default", LoadTitle: "default", Favorites: [], BlackList: [], DefaultPromo: config.DefaultPromo });
        // Add Environment Configuration to DB
        await newEnvConfig.save();
        return newEnvConfig;
    }
    console.log("Environment Configuration loaded");
    return envConfig;
}