import mongoose, { Model } from 'mongoose';

export interface IMosaic {
  Key: string;
  Genres: string[];
  MusicGenres: string[];
  MusicSubGenres: string[];
}

export const MosaicSchema = new mongoose.Schema({
  Key: String,
  Genres: [String],
  MusicGenres: [String],
  MusicSubGenres: [String],
});

export class Mosaic {
  Key: string;
  Genres: string[];
  MusicGenres: string[];
  MusicSubGenres: string[];

  constructor(
    key: string,
    genres: string[],
    musicGenres: string[],
    musicSubGenres: string[],
  ) {
    this.Key = key;
    this.Genres = genres;
    this.MusicGenres = musicGenres;
    this.MusicSubGenres = musicSubGenres;
  }

  static fromMongoObject(mongoObject: any): Mosaic {
    return new Mosaic(
      mongoObject.key,
      mongoObject.genre,
      mongoObject.musicGenres,
      mongoObject.musicSubGenres,
    );
  }

  static toMongoObject(mosaic: Mosaic): any {
    return {
      key: mosaic.Key,
      genre: mosaic.Genres,
      musicGenres: mosaic.MusicGenres,
      musicSubGenres: mosaic.MusicSubGenres,
    };
  }

  static fromRequestObject(requestObject: any): Mosaic {
    return new Mosaic(
      requestObject.key,
      requestObject.genre,
      requestObject.musicGenres,
      requestObject.musicSubGenres,
    );
  }
}

export const MosaicModel: Model<IMosaic> = mongoose.model<IMosaic>(
  'Mosaic',
  MosaicSchema,
);
