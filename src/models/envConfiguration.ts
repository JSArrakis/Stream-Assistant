import mongoose, { Model } from 'mongoose';

export interface IEnvConfiguration {
    Title: string;
    LoadTitle: string;
    Favorites: string[];
    BlackList: string[];
    DefaultTags: string[];
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
    DefaultTags: [String],
    DefaultPromo: String
});

export class EnvConfiguration {
    Title: string;
    LoadTitle: string;
    Favorites: string[];
    BlackList: string[];
    DefaultTags: string[];
    DefaultPromo: string;

    constructor(
        title: string,
        loadTitle: string,
        favorites: string[],
        blackList: string[],
        defaultTags: string[],
        defaultPromo: string,
    ) {

        this.Title = title;
        this.LoadTitle = loadTitle;
        this.Favorites = favorites;
        this.BlackList = blackList;
        this.DefaultTags = defaultTags
        this.DefaultPromo = defaultPromo;
    }

    static fromMongoObject(mongoObject: any): EnvConfiguration {
        return new EnvConfiguration(
            mongoObject.title,
            mongoObject.loadTitle,
            mongoObject.favorites,
            mongoObject.blackList,
            mongoObject.defaultTags,
            mongoObject.defaultPromo,
        );
    }

    static toMongoObject(envConfig: EnvConfiguration): any {
        return {
            title: envConfig.Title,
            loadTitle: envConfig.LoadTitle,
            favorites: envConfig.Favorites,
            blackList: envConfig.BlackList,
            defaultTags: envConfig.DefaultTags,
            defaultPromo: envConfig.DefaultPromo
        };
    }

    static fromRequestObject(requestObject: any): EnvConfiguration {
        return new EnvConfiguration(
            requestObject.title,
            requestObject.loadTitle,
            requestObject.favorites,
            requestObject.blackList,
            requestObject.defaultTags,
            requestObject.defaultPromo
        );
    }
}

export const EnvConfigurationModel: Model<IEnvConfiguration> = mongoose.model<IEnvConfiguration>('EnvConfiguration', EnvConfigurationSchema);