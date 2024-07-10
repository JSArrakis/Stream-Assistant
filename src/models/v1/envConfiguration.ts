import mongoose, { Model } from 'mongoose';

export interface IEnvConfiguration {
    Title: string;
    LoadTitle: string;
    Favorites: string[];
    BlackList: string[];
    DefaultPromo: string;
}

export const EnvConfigurationSchema = new mongoose.Schema({
    Title: String,
    LoadTitle: {
        type: String,
        index: true,
    },
    Favorites: [String],
    BlackList: [String],
    DefaultPromo: String
});

export class EnvConfiguration {
    Title: string;
    LoadTitle: string;
    Favorites: string[];
    BlackList: string[];
    DefaultPromo: string;

    constructor(
        title: string,
        loadTitle: string,
        favorites: string[],
        blackList: string[],
        defaultPromo: string,
    ) {

        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Favorites = favorites;
        this.BlackList = blackList;
        this.DefaultPromo = defaultPromo;
    }

    static fromMongoObject(mongoObject: any): EnvConfiguration {
        return new EnvConfiguration(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.favorites,
            mongoObject.blackList,
            mongoObject.defaultPromo,
        );
    }

    static toMongoObject(envConfig: EnvConfiguration): any {
        return {
            title: envConfig.Title,
            loadTitle: envConfig.LoadTitle,
            alias: envConfig.Favorites,
            imdb: envConfig.BlackList,
            tags: envConfig.DefaultPromo
        };
    }

    static fromRequestObject(requestObject: any): EnvConfiguration {
        return new EnvConfiguration(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.favorites,
            requestObject.blackList,
            requestObject.defaultPromo
        );
    }
}

export const EnvConfigurationModel: Model<IEnvConfiguration> = mongoose.model<IEnvConfiguration>('EnvConfiguration', EnvConfigurationSchema);