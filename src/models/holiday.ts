import mongoose, { Model } from 'mongoose';

export interface IHoliday {
  Name: string;
  SeasonStartDate: Date;
  SeasonEndDate: Date;
  HolidayDate: Date;
}

export const HolidaySchema = new mongoose.Schema({
  Name: String,
  SeasonStartDate: Date,
  SeasonEndDate: Date,
  HolidayDate: Date,
});

export class Holiday {
  Name: string;
  SeasonStartDate: Date;
  SeasonEndDate: Date;
  HolidayDate: Date;

  constructor(
    name: string,
    seasonStartDate: Date,
    seasonEndDate: Date,
    holidayDate: Date,
  ) {
    this.Name = name;
    this.SeasonStartDate = seasonStartDate;
    this.SeasonEndDate = seasonEndDate;
    this.HolidayDate = holidayDate;
  }

  static fromMongoObject(mongoObject: any): Holiday {
    return new Holiday(
      mongoObject.name,
      mongoObject.seasonStartDate,
      mongoObject.seasonEndDate,
      mongoObject.holidayDate,
    );
  }

  static toMongoObject(holiday: Holiday): any {
    return {
      name: holiday.Name,
      seasonStartDate: holiday.SeasonStartDate,
      seasonEndDate: holiday.SeasonEndDate,
      holidayDate: holiday.HolidayDate,
    };
  }

  static fromRequestObject(requestObject: any): Holiday {
    return new Holiday(
      requestObject.name,
      requestObject.seasonStartDate,
      requestObject.seasonEndDate,
      requestObject.holidayDate,
    );
  }
}

export const HolidayModel: Model<IHoliday> = mongoose.model<IHoliday>(
  'Holiday',
  HolidaySchema,
);
