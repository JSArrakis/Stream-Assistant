import { Config } from "./src/models/config";
import { loadMedia } from "./dataAccess/dataManager";
import express from 'express';
import { continuousStreamHandler, adHocStreamHandler, testHandler } from "./src/controllers/streamController";
import { streamStartValidationRules, testValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
import { cycleCheck, setEndOfDayMarker, setTomorrow } from "./src/services/backgroundService";

const config: Config = require('./config.json') as Config;
loadMedia(config);
setConfig(config);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

setEndOfDayMarker();
setTomorrow();
cycleCheck();

app.post('/api/continuousStream', testHandler);
// app.post('/api/adhocStream', streamStartValidationRules, adHocStreamHandler);