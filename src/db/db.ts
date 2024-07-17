import mongoose from "mongoose";
import { ShowModel, Show } from '../models/show';
import { MovieModel, Movie } from '../models/movie';
import { PromoModel, Promo } from '../models/promo';
import { CommercialModel, Commercial } from '../models/commercial';
import { MusicModel, Music } from '../models/music';
import { ShortModel, Short } from '../models/short';
import { EnvConfigurationModel, EnvConfiguration } from "../models/envConfiguration";
import * as dataTrans from "../services/dataTransformer";
import { MediaType } from "../models/enum/mediaTypes";
import { Config } from "../models/config";
import { keyNormalizer } from "../utils/utilities";
import fs from "fs";

const uri: string = "mongodb://127.0.0.1:27017/streamAssistantMedia";
export async function connectToDB() {
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

export async function GetDefaultEnvConfig(defaultPromo: string): Promise<EnvConfiguration> {
    // Check if default env config exists
    const defaultEnvConfig = await EnvConfigurationModel.findOne({ LoadTitle: "default" });
    if (defaultEnvConfig) {
        console.log("Default Env Configuration already exists");
        return defaultEnvConfig;
    }

    const envConfig = new EnvConfigurationModel({
        Title: "Default",
        LoadTitle: "default",
        Favorites: [],
        BlackList: [],
        DefaultPromo: defaultPromo
    });

    await envConfig.save();
    console.log("Default Env Configuration Created");
    return envConfig;
}

export async function GetEnvConfig(loadTitle: string): Promise<[EnvConfiguration, string]> {
    const envConfig = await EnvConfigurationModel.findOne({ LoadTitle: loadTitle });
    // If it doesn't exist, return error
    if (!envConfig) {
        console.log("Env Configuration does not exist");
        return [new EnvConfiguration("", "", [], [], [], ""), "Specified Environment Configuration does not exist, please create it through the admin panel or use the default configuration."];
    }
    console.log("Env Configuration Found");
    return [envConfig, ""];
}

export async function LoadEnvConfigList(): Promise<EnvConfiguration[]> {
    const envConfigs = await EnvConfigurationModel.find();

    if (!envConfigs || envConfigs.length === 0) {
        console.log("No Env Configurations Found");
        return [];
    }
    console.log(envConfigs.length + " Env Configurations loaded");
    return envConfigs;
}

export async function CreateDefaultPromo(config: Config): Promise<void> {
    // Check if default promo exists in the database
    const defaultPromo = await PromoModel.findOne({ LoadTitle: "default" });
    // If it exists, return
    if (defaultPromo) {
        console.log("Default Promo already exists");
        return;
    }

    // Check if the promo path exists and get the duration
    let duration = await dataTrans.getMediaDuration(config.DefaultPromo);

    // Create default promo
    const promo = new PromoModel({
        Title: "Default",
        LoadTitle: "default",
        Duration: duration,
        Path: config.DefaultPromo,
        Type: MediaType.Promo,
        Tags: ["default"]
    });
    // Save the default promo to the database
    await promo.save();
}

export async function CreateDefaultCommercials(config: Config): Promise<void> {
    // Get all commercials that have the tag "default"
    const defaultCommercials = await CommercialModel.find({ Tags: "default" });
    let commercialList: Commercial[] = [];
    for (let i = 0; i < defaultCommercials.length; i++) {
        commercialList.push(Commercial.fromMongoObject(defaultCommercials[i]));
    }
    // If there are default commercials, return
    if (defaultCommercials.length > 0) {
        if (CheckBufferViability(commercialList)) {
            console.log("Default Commercials already exist");
        } else {
            // Throw error if default commercials are not viable
            console.log("Default Commercials from DB are not viable");
            throw new Error("Default Commercials from DB are not viable");
        }
        return;
    }

    // If there are no default commercials, get the default commercial folder from the config
    const defaultCommercialFolder = config.DefaultCommercialFolder;
    // For each file in the folder
    fs.readdir(defaultCommercialFolder, async (err: any, files: any) => {
        if (err) {
            console.log("Error reading default commercial folder");
            return;
        }

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let path = defaultCommercialFolder + "/" + file;
            let duration = await dataTrans.getMediaDuration(path);
            // Create a new commercial object
            // Create commercial name from file name removing the extension
            let commercialName = file.replace(/\.[^/.]+$/, "");

            // Create commercial object and add it to commercial list
            commercialList.push(new Commercial(
                commercialName,
                keyNormalizer(commercialName),
                duration,
                path,
                MediaType.Commercial,
                ["default"]
            ));
        }
    });

    // Check if the default commercials are viable
    if (CheckBufferViability(commercialList)) {
        // Save the default commercials to the database
        for (let i = 0; i < commercialList.length; i++) {
            let commercial = commercialList[i];
            const newCommercial = new CommercialModel({
                Title: commercial.Title,
                LoadTitle: commercial.LoadTitle,
                Duration: commercial.Duration,
                Path: commercial.Path,
                Type: commercial.Type,
                Tags: commercial.Tags
            });
            await newCommercial.save();
        }
        console.log("Default Commercials Created");
    } else {
        console.log("Default Commercials from Default Commercial Folder are not viable");
        throw new Error("Default Commercials from Default Commercial Folder are not viable");
    }
}

export function CheckBufferViability(commercialList: Commercial[]): boolean {

    // Get list of unique commercial durations
    let uniqueDurations: number[] = [...new Set(commercialList.map(c => c.Duration))];
    let isViable = false;
    // For each number from 15 to 150
    for (let i = 15; i <= 29; i++) {
        // Where i is the duration needing to be filled with commercials
        // First try to find a commercial duration from the uniqueDurations list that is exactly i seconds long
        let duration = uniqueDurations.find(d => d === i);

        // If commmercial is found, go to next iteration
        if (duration) {
            isViable = true;
        } else {
            console.log("No commercial found for " + i + " seconds");
            break;
        }
    }

    return isViable;
}