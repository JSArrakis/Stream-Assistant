import * as fs from 'fs';
import * as path from 'path';
import * as dataMan from "./src/services/dataManager";
import express from 'express';
import { cycleCheck, setEndOfDayMarker, setTomorrow } from "./src/services/backgroundService";
import { connectToDB } from "./src/db/db";
import { Config } from "./src/models/config";
import * as commonCont from "./src/controllers/common";
import * as movCont from "./src/controllers/movieControllers";
import * as showCont from "./src/controllers/showControllers";
import * as commCont from "./src/controllers/commercialControllers";
import * as shortCont from "./src/controllers/shortControllers";
import * as musicCont from "./src/controllers/musicControllers";
import * as promoCont from "./src/controllers/promoControllers";
import * as streamCont from "./src/controllers/streamControllers";

// Define the path to the config file
const configFilePath = path.join(__dirname, 'config.json');

// Read and parse the config file
const rawConfigData = fs.readFileSync(configFilePath, 'utf-8');
console.log("Raw Config Data: ");
console.log(rawConfigData);
const configData = JSON.parse(rawConfigData);
console.log("Parsed Config Data: ");
console.log(configData);
// TODO - Validate the config data
const config = Config.fromJsonObject(configData);
console.log("Config Object: ");
console.log(config);

// Gets the config from the config.json file and sets it in the stream service
dataMan.setConfig(config);

// Loads media from the JSON files
// TODO - Load media from the database
// TODO - Due to media being loaded as an async function, we will need to ensure all media is loaded before the service starts
// TODO - Restructure this for clean code
connectToDB().then(() => {
    dataMan.loadMedia(dataMan.getConfig()).then(() => {

        const app = express();
        const port = process.env.PORT || 3001;
        app.use(express.json());
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Sets the end of day marker as 30 minutes before midnight on the day the service is started
        // This time is used to determine when the service should start preparing the stream for the next day
        setEndOfDayMarker();

        // Sets the unix timestamp for the start of the next day at midnight
        setTomorrow();

        // The cycle check is a function that runs every 5 minutes to check if the stream should progress to the next media block
        cycleCheck();

        // ===========================================
        //              STREAM CONTROL
        // ===========================================
        //Start Stream with the intention of playing continuously with no end time until stopped manually
        app.post('/api/v1/continuous-stream', streamCont.contStreamValidationRules, streamCont.continuousStreamHandler);

        // ===========================================
        //            DATABASE MANAGEMENT
        // ===========================================

        //Show Management
        app.post('/api/admin/v1/create-show', showCont.createShowValidationRules, showCont.createShowHandler);
        app.delete('/api/admin/v1/delete-show', showCont.deleteShowValidationRules, showCont.deleteShowHandler);
        app.put('/api/admin/v1/update-show', showCont.updateShowValidationRules, showCont.updateShowHandler);
        app.get('/api/admin/v1/get-show', showCont.getShowValidationRules, showCont.getShowHandler);
        app.get('/api/admin/v1/get-all-show-data', showCont.getShowValidationRules, showCont.getAllShowsDataHandler);

        //Movie Management
        app.post('/api/admin/v1/create-movie', movCont.createMovieValidationRules, movCont.createMovieHandler);
        app.post('/api/admin/v1/bulk-create-movies', movCont.bulkCreateMoviesValidationRules, movCont.bulkCreateMovieHandler);
        app.delete('/api/admin/v1/delete-movie', movCont.deleteMovieValidationRules, movCont.deleteMovieHandler);
        app.put('/api/admin/v1/update-movie', movCont.updateMovieValidationRules, movCont.updateMovieHandler);
        app.get('/api/admin/v1/get-movie', movCont.getMovieValidationRules, movCont.getMovieHandler);
        app.get('/api/admin/v1/get-all-movies', movCont.getMovieValidationRules, movCont.getAllMoviesHandler);

        //Commercial Management
        app.post('/api/admin/v1/create-commercial', commonCont.createBufferValidationRules, commCont.createCommercialHandler);
        app.post('/api/admin/v1/bulk-create-commercials', commonCont.bulkCreateBufferValidationRules, commCont.bulkCreateCommercialHandler);
        app.delete('/api/admin/v1/delete-commercial', commonCont.deleteBufferValidationRules, commCont.deleteCommercialHandler);
        app.put('/api/admin/v1/update-commercial', commonCont.updateBufferValidationRules, commCont.updateCommercialHandler);
        app.get('/api/admin/v1/get-commercial', commonCont.getBufferValidationRules, commCont.getCommercialHandler);
        app.get('/api/admin/v1/get-all-commercials', commonCont.getBufferValidationRules, commCont.getAllCommercialsHandler);

        //Short Management
        app.post('/api/admin/v1/create-short', commonCont.createBufferValidationRules, shortCont.createShortHandler);
        app.post('/api/admin/v1/bulk-create-shorts', commonCont.bulkCreateBufferValidationRules, shortCont.bulkCreateShortHandler);
        app.delete('/api/admin/v1/delete-short', commonCont.deleteBufferValidationRules, shortCont.deleteShortHandler);
        app.put('/api/admin/v1/update-short', commonCont.updateBufferValidationRules, shortCont.updateShortHandler);
        app.get('/api/admin/v1/get-short', commonCont.getBufferValidationRules, shortCont.getShortHandler);
        app.get('/api/admin/v1/get-all-shorts', commonCont.getBufferValidationRules, shortCont.getAllShortsHandler);

        //Music Management
        app.post('/api/admin/v1/create-music', commonCont.createBufferValidationRules, musicCont.createMusicHandler);
        app.post('/api/admin/v1/bulk-create-music', commonCont.bulkCreateBufferValidationRules, musicCont.bulkCreateMusicHandler);
        app.delete('/api/admin/v1/delete-music', commonCont.deleteBufferValidationRules, musicCont.deleteMusicHandler);
        app.put('/api/admin/v1/update-music', commonCont.updateBufferValidationRules, musicCont.updateMusicHandler);
        app.get('/api/admin/v1/get-music', commonCont.getBufferValidationRules, musicCont.getMusicHandler);
        app.get('/api/admin/v1/get-all-music', commonCont.getBufferValidationRules, musicCont.getAllMusicHandler);

        //Promo Management
        app.post('/api/admin/v1/create-promo', commonCont.createBufferValidationRules, promoCont.createPromoHandler);
        app.post('/api/admin/v1/bulk-create-promos', commonCont.bulkCreateBufferValidationRules, promoCont.bulkCreatePromoHandler);
        app.delete('/api/admin/v1/delete-promo', commonCont.deleteBufferValidationRules, promoCont.deletePromoHandler);
        app.put('/api/admin/v1/update-promo', commonCont.updateBufferValidationRules, promoCont.updatePromoHandler);
        app.get('/api/admin/v1/get-promo', commonCont.getBufferValidationRules, promoCont.getPromoHandler);
        app.get('/api/admin/v1/get-all-promos', commonCont.getBufferValidationRules, promoCont.getAllPromosHandler);
    });
});