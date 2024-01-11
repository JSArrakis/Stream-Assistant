import { loadMedia } from "./src/services/dataManager";
import express from 'express';
import { continuousStreamHandler } from "./src/controllers/streamController";
import { streamValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
import { cycleCheck, setEndOfDayMarker, setTomorrow } from "./src/services/backgroundService";
import { connectToDB } from "./src/db/db";
import { Config } from "./src/models/config";
import { createBufferValidationRules, createMovieValidationRules, createShowValidationRules, deleteBufferValidationRules, deleteMovieValidationRules, deleteShowValidationRules, getBufferValidationRules, getMovieValidationRules, getShowValidationRules, updateBufferValidationRules, updateMovieValidationRules, updateShowValidationRules } from "./src/validators/dataValidator";
import { createBufferHandler, createMovieHandler, createShowHandler, deleteBufferHandler, deleteMovieHandler, deleteShowHandler, getBufferHandler, getMovieHandler, getShowHandler, updateBufferHandler, updateMovieHandler, updateShowHandler } from "./src/controllers/adminController";

const config: Config = require('./config.json') as Config;
setConfig(config);
loadMedia(config);
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

setEndOfDayMarker();
setTomorrow();

connectToDB().then(() => {
    cycleCheck();
});

//Stream Control
app.post('/api/continuous-stream', streamValidationRules, continuousStreamHandler);

//Database Management
app.post('/api/admin/create-show', createShowValidationRules, createShowHandler);
app.delete('/api/admin/delete-show', deleteShowValidationRules, deleteShowHandler);
app.put('/api/admin/update-show', updateShowValidationRules, updateShowHandler);
app.get('/api/admin/get-show', getShowValidationRules, getShowHandler);

app.post('/api/admin/create-movie', createMovieValidationRules, createMovieHandler);
app.delete('/api/admin/delete-movie', deleteMovieValidationRules, deleteMovieHandler);
app.put('/api/admin/update-movie', updateMovieValidationRules, updateMovieHandler);
app.get('/api/admin/get-movie', getMovieValidationRules, getMovieHandler);

app.post('/api/admin/create-buffer', createBufferValidationRules, createBufferHandler);
app.delete('/api/admin/delete-buffer', deleteBufferValidationRules, deleteBufferHandler);
app.put('/api/admin/update-buffer', updateBufferValidationRules, updateBufferHandler);
app.get('/api/admin/get-buffer', getBufferValidationRules, getBufferHandler);