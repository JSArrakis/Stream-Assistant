export class Config {
  DataFolder: string;
  Interval: number;
  DefaultCommercialFolder: string;
  DefaultPromo: string;

  constructor(
    dataFolder: string,
    interval: number,
    defaultCommercialFolder: string,
    defaultPromo: string,
  ) {
    this.DataFolder = dataFolder;
    this.Interval = interval;
    this.DefaultCommercialFolder = defaultCommercialFolder;
    this.DefaultPromo = defaultPromo;
  }

  static fromJsonObject(object: any): Config {
    return new Config(
      object.dataFolder,
      object.interval,
      object.defaultCommercialFolder,
      object.defaultPromo,
    );
  }
}
