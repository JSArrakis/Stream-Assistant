export class Config {
    vlcLocation: string;
    destinationFolder: string;
    testFolder: string;
    dataFolder: string;
    playlistName: string;
    repeatInterval: number;
    interval: number;
    backgroundInterval: number;

    constructor(vlcLocation: string, destinationFolder: string, testFolder: string, dataFolder: string, playlistName: string, repeatInterval: number, interval: number, backgroundInterval: number) {
        this.vlcLocation = vlcLocation;
        this.destinationFolder = destinationFolder;
        this.testFolder = testFolder;
        this.dataFolder = dataFolder;
        this.playlistName = playlistName;
        this.repeatInterval = repeatInterval;
        this.interval = interval;
        this.backgroundInterval = backgroundInterval;
    }
        
}