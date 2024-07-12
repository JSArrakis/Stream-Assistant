export class Config {
    DataFolder: string;
    Interval: number;
    DefaultCommercialFolder: string;
    DefaultPromo: string;

    constructor(dataFolder: string, interval: number, defaultCommercialFolder: string, defaultPromo: string) {
        this.DataFolder = dataFolder;
        this.Interval = interval;
        this.DefaultCommercialFolder = defaultCommercialFolder;
        this.DefaultPromo = defaultPromo;
    }
}