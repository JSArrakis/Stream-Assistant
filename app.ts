import { loadMedia } from "./src/services/dataManager";
import express from 'express';
import { continuousStreamHandler } from "./src/controllers/streamController";
import { streamValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
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

const config: Config = require('./config.json') as Config;
// Gets the config from the config.json file and sets it in the stream service
setConfig(config);

// Loads media from the JSON files
// TODO - Load media from the database
// TODO - Due to media being loaded as an async function, we will need to ensure all media is loaded before the service starts
// TODO - Restructure this for clean code
connectToDB().then(() => {
    loadMedia(config).then(() => {

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
        app.post('/api/continuous-stream', streamValidationRules, continuousStreamHandler);

        // ===========================================
        //            DATABASE MANAGEMENT
        // ===========================================

        //Show Management
        app.post('/api/admin/create-show', showCont.createShowValidationRules, showCont.createShowHandler);
        app.delete('/api/admin/delete-show', showCont.deleteShowValidationRules, showCont.deleteShowHandler);
        app.put('/api/admin/update-show', showCont.updateShowValidationRules, showCont.updateShowHandler);
        app.get('/api/admin/get-show', showCont.getShowValidationRules, showCont.getShowHandler);
        app.get('/api/admin/get-all-show-data', showCont.getShowValidationRules, showCont.getAllShowsDataHandler);

        //Movie Management
        app.post('/api/admin/create-movie', movCont.createMovieValidationRules, movCont.createMovieHandler);
        app.post('/api/admin/bulk-create-movies', movCont.bulkCreateMoviesValidationRules, movCont.bulkCreateMovieHandler);
        app.delete('/api/admin/delete-movie', movCont.deleteMovieValidationRules, movCont.deleteMovieHandler);
        app.put('/api/admin/update-movie', movCont.updateMovieValidationRules, movCont.updateMovieHandler);
        app.get('/api/admin/get-movie', movCont.getMovieValidationRules, movCont.getMovieHandler);
        app.get('/api/admin/get-all-movies', movCont.getMovieValidationRules, movCont.getAllMoviesHandler);

        //Commercial Management
        app.post('/api/admin/create-commercial', commonCont.createBufferValidationRules, commCont.createCommercialHandler);
        app.post('/api/admin/bulk-create-commercials', commonCont.bulkCreateBufferValidationRules, commCont.bulkCreateCommercialHandler);
        app.delete('/api/admin/delete-commercial', commonCont.deleteBufferValidationRules, commCont.deleteCommercialHandler);
        app.put('/api/admin/update-commercial', commonCont.updateBufferValidationRules, commCont.updateCommercialHandler);
        app.get('/api/admin/get-commercial', commonCont.getBufferValidationRules, commCont.getCommercialHandler);
        app.get('/api/admin/get-all-commercials', commonCont.getBufferValidationRules, commCont.getAllCommercialsHandler);

        //Short Management
        app.post('/api/admin/create-short', commonCont.createBufferValidationRules, shortCont.createShortHandler);
        app.post('/api/admin/bulk-create-shorts', commonCont.bulkCreateBufferValidationRules, shortCont.bulkCreateShortHandler);
        app.delete('/api/admin/delete-short', commonCont.deleteBufferValidationRules, shortCont.deleteShortHandler);
        app.put('/api/admin/update-short', commonCont.updateBufferValidationRules, shortCont.updateShortHandler);
        app.get('/api/admin/get-short', commonCont.getBufferValidationRules, shortCont.getShortHandler);
        app.get('/api/admin/get-all-shorts', commonCont.getBufferValidationRules, shortCont.getAllShortsHandler);

        //Music Management
        app.post('/api/admin/create-music', commonCont.createBufferValidationRules, musicCont.createMusicHandler);
        app.post('/api/admin/bulk-create-music', commonCont.bulkCreateBufferValidationRules, musicCont.bulkCreateMusicHandler);
        app.delete('/api/admin/delete-music', commonCont.deleteBufferValidationRules, musicCont.deleteMusicHandler);
        app.put('/api/admin/update-music', commonCont.updateBufferValidationRules, musicCont.updateMusicHandler);
        app.get('/api/admin/get-music', commonCont.getBufferValidationRules, musicCont.getMusicHandler);
        app.get('/api/admin/get-all-music', commonCont.getBufferValidationRules, musicCont.getAllMusicHandler);

        //Promo Management
        app.post('/api/admin/create-promo', commonCont.createBufferValidationRules, promoCont.createPromoHandler);
        app.post('/api/admin/bulk-create-promos', commonCont.bulkCreateBufferValidationRules, promoCont.bulkCreatePromoHandler);
        app.delete('/api/admin/delete-promo', commonCont.deleteBufferValidationRules, promoCont.deletePromoHandler);
        app.put('/api/admin/update-promo', commonCont.updateBufferValidationRules, promoCont.updatePromoHandler);
        app.get('/api/admin/get-promo', commonCont.getBufferValidationRules, promoCont.getPromoHandler);
        app.get('/api/admin/get-all-promos', commonCont.getBufferValidationRules, promoCont.getAllPromosHandler);
    });
});