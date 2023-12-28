import { loadMedia } from "./src/services/dataManager";
import express from 'express';
import { continuousStreamHandler } from "./src/controllers/streamController";
import { streamValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
import { cycleCheck, setEndOfDayMarker, setTomorrow } from "./src/services/backgroundService";
import { connectToDB } from "./src/db/db";
import { Config } from "./src/models/config";
import { createShowValidationRules, deleteShowValidationRules, getShowValidationRules, updateShowValidationRules } from "./src/validators/dataValidator";
import { createShowHandler, deleteShowHandler, getShowHandler, updateShowHandler } from "./src/controllers/adminController";

const config: Config = require('./config.json') as Config;
setConfig(config);
loadMedia(config);
const app = express();
const port = process.env.PORT || 3000;
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
app.post('/api/continuousStream', streamValidationRules, continuousStreamHandler);

//Database Management
app.post('/api/admin/createShow', createShowValidationRules, createShowHandler);
app.delete('/api/admin/deleteShow', deleteShowValidationRules, deleteShowHandler);
app.put('/api/admin/updateShow', updateShowValidationRules, updateShowHandler);
app.get('/api/admin/getShow', getShowValidationRules, getShowHandler);