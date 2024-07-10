export class Config {
    DataFolder: string;
    Interval: number;
    DefaultPromo: string;

    constructor(dataFolder: string, interval: number, defaultPromo: string) {
        this.DataFolder = dataFolder;
        this.Interval = interval;
        this.DefaultPromo = defaultPromo;
    }

}