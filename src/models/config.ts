export class Config {
    DataFolder: string;
    Interval: number;

    constructor(dataFolder: string, interval: number) {
        this.DataFolder = dataFolder;
        this.Interval = interval;
    }

}