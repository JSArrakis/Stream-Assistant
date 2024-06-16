import { loadMedia } from "./src/services/dataManager";
import express from 'express';
import { continuousStreamHandler } from "./src/controllers/streamController";
import { streamValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
import { cycleCheck, setEndOfDayMarker, setTomorrow } from "./src/services/backgroundService";
import { connectToDB } from "./src/db/db";
import { Config } from "./src/models/config";
import { bulkCreateMoviesValidationRules, createBufferValidationRules, createMovieValidationRules, createShowValidationRules, deleteBufferValidationRules, deleteMovieValidationRules, deleteShowValidationRules, getBufferValidationRules, getMovieValidationRules, getShowValidationRules, updateBufferValidationRules, updateMovieValidationRules, updateShowValidationRules } from "./src/validators/dataValidator";
import { bulkCreateMovieHandler, createBufferHandler, createMovieHandler, createShowHandler, deleteBufferHandler, deleteMovieHandler, deleteShowHandler, getAllMoviesHandler, getAllShowsDataHandler, getBufferHandler, getMovieHandler, getShowHandler, updateBufferHandler, updateMovieHandler, updateShowHandler } from "./src/controllers/adminController";

const config: Config = require('./config.json') as Config;
// Gets the config from the config.json file and sets it in the stream service
setConfig(config);

// Loads media from the JSON files
// TODO - Load media from the database
loadMedia(config);
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

// Connects to the database and starts the cycle check
// The cycle check is a function that runs every 5 minutes to check if the stream should progress to the next media block
connectToDB().then(() => {
    cycleCheck();
});

//Stream Control
//Start Stream with the intention of playing continuously with no end time until stopped manually
app.post('/api/continuous-stream', streamValidationRules, continuousStreamHandler);

//Database Management
app.post('/api/admin/create-show', createShowValidationRules, createShowHandler);
app.delete('/api/admin/delete-show', deleteShowValidationRules, deleteShowHandler);
app.put('/api/admin/update-show', updateShowValidationRules, updateShowHandler);
app.get('/api/admin/get-show', getShowValidationRules, getShowHandler);
app.get('/api/admin/get-all-show-data', getShowValidationRules, getAllShowsDataHandler);

app.post('/api/admin/create-movie', createMovieValidationRules, createMovieHandler);
app.post('/api/admin/bulk-create-movies', bulkCreateMoviesValidationRules, bulkCreateMovieHandler);
app.delete('/api/admin/delete-movie', deleteMovieValidationRules, deleteMovieHandler);
app.put('/api/admin/update-movie', updateMovieValidationRules, updateMovieHandler);
app.get('/api/admin/get-movie', getMovieValidationRules, getMovieHandler);
app.get('/api/admin/get-all-movies', getMovieValidationRules, getAllMoviesHandler);

app.post('/api/admin/create-buffer', createBufferValidationRules, createBufferHandler);
app.delete('/api/admin/delete-buffer', deleteBufferValidationRules, deleteBufferHandler);
app.put('/api/admin/update-buffer', updateBufferValidationRules, updateBufferHandler);
app.get('/api/admin/get-buffer', getBufferValidationRules, getBufferHandler);