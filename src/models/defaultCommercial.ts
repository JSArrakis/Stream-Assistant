import mongoose, { Model } from 'mongoose';
import { MediaType } from './enum/mediaTypes';
import { BaseMedia } from './mediaInterface';

export interface IDefaultCommercial extends BaseMedia {
  Title: string;
  LoadTitle: string;
  Duration: number;
  Path: string;
  Type: Number;
  Tags: string[];
}

export const DefaultCommercialSchema = new mongoose.Schema({
  Title: String,
  LoadTitle: String,
  Duration: Number,
  Path: String,
  Type: Number,
  Tags: [String],
});

export class DefaultCommercial {
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

  static fromMongoObject(mongoObject: any): DefaultCommercial {
    return new DefaultCommercial(
      mongoObject.Title,
      mongoObject.LoadTitle,
      mongoObject.Duration,
      mongoObject.Path,
      MediaType.Commercial,
      mongoObject.Tags,
    );
  }

  static toMongoObject(commercial: DefaultCommercial): any {
    return {
      title: commercial.Title,
      loadTitle: commercial.LoadTitle,
      duration: commercial.Duration,
      path: commercial.Path,
      type: commercial.Type,
      tags: commercial.Tags,
    };
  }

  static fromRequestObject(requestObject: any): DefaultCommercial {
    return new DefaultCommercial(
      requestObject.title,
      requestObject.loadTitle,
      requestObject.duration,
      requestObject.path,
      MediaType.Commercial,
      requestObject.tags,
    );
  }
}

export const DefaultCommercialModel: Model<IDefaultCommercial> =
  mongoose.model<IDefaultCommercial>(
    'DefaultCommercial',
    DefaultCommercialSchema,
  );
