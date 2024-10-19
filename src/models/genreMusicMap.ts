import mongoose, { Model } from 'mongoose';

export interface IGenreMusicMap {
    Genre: string;
    MusicGenres: string[];
    MusicSubGenres: string[];
}

export const GenreMusicMapSchema = new mongoose.Schema({
    Genre: String,
    MusicGenres: [String],
    MusicSubGenres: [String],
});

export class GenreMusicMap {
    Genre: string;
    MusicGenres: string[];
    MusicSubGenres: string[];

    constructor(
        genre: string,
        musicGenres: string[],
        musicSubGenres: string[],
    ) {

        this.Genre = genre;
        this.MusicGenres = musicGenres;
        this.MusicSubGenres = musicSubGenres;
    }

    static fromMongoObject(mongoObject: any): GenreMusicMap {
        return new GenreMusicMap(
            mongoObject.genre,
            mongoObject.musicGenres,
            mongoObject.musicSubGenres,
        );
    }

    static toMongoObject(genreMusicMap: GenreMusicMap): any {
        return {
            genre: genreMusicMap.Genre,
            musicGenres: genreMusicMap.MusicGenres,
            musicSubGenres: genreMusicMap.MusicSubGenres,
        };
    }

    static fromRequestObject(requestObject: any): GenreMusicMap {
        return new GenreMusicMap(
            requestObject.genre,
            requestObject.musicGenres,
            requestObject.musicSubGenres,
        );
    }
}

export const GenreMusicMapModel: Model<IGenreMusicMap> = mongoose.model<IGenreMusicMap>('GenreMusicMap', GenreMusicMapSchema);