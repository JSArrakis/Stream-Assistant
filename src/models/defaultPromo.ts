import mongoose, { Model } from 'mongoose';
import { MediaType } from './enum/mediaTypes';

export interface IDefaultPromo {
  Title: string;
  LoadTitle: string;
  Duration: number;
  Path: string;
  Type: number;
  Tags: string[];
}

export const DefaultPromoSchema = new mongoose.Schema({
  Title: String,
  LoadTitle: String,
  Duration: Number,
  Path: String,
  Type: Number,
  Tags: [String],
});

export class DefaultPromo {
  Title: string;
  LoadTitle: string;
  Duration: number;
  Path: string;
  Type: number;
  Tags: string[];

  constructor(
    title: string,
    loadtitle: string,
    duration: number,
    path: string,
    type: number,
    tags: string[],
  ) {
    this.Title = title;
    this.LoadTitle = loadtitle;
    this.Duration = duration;
    this.Path = path;
    this.Type = type;
    this.Tags = tags;
  }

  static fromMongoObject(mongoObject: any): DefaultPromo {
    return new DefaultPromo(
      mongoObject.title,
      mongoObject.loadTitle,
      mongoObject.duration,
      mongoObject.path,
      mongoObject.type,
      mongoObject.tags,
    );
  }

  static toMongoObject(movie: DefaultPromo): any {
    return {
      title: movie.Title,
      loadTitle: movie.LoadTitle,
      duration: movie.Duration,
      path: movie.Path,
      type: movie.Type,
      tags: movie.Tags,
    };
  }

  static fromRequestObject(requestObject: any): DefaultPromo {
    return new DefaultPromo(
      requestObject.title,
      requestObject.loadTitle,
      requestObject.duration,
      requestObject.path,
      MediaType.Promo,
      requestObject.tags,
    );
  }
}

export const DefaultPromoModel: Model<IDefaultPromo> =
  mongoose.model<IDefaultPromo>('DefaultPromo', DefaultPromoSchema);
