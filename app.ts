import { Config } from "./src/models/config";
import { loadMedia } from "./dataAccess/dataManager";
import express from 'express';
import { continuousStreamHandler, adHocStreamHandler } from "./src/controllers/streamController";
import { streamStartValidationRules } from "./src/validators/streamValidator";
import { setConfig } from "./src/services/streamService";
import { cycleCheck } from "./src/services/backgroundService";

const config: Config = require('./config.json') as Config;
loadMedia(config);
setConfig(config);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

cycleCheck();

app.post('/api/continuousStream', streamStartValidationRules, continuousStreamHandler);
app.post('/api/adhocStream', streamStartValidationRules, adHocStreamHandler);