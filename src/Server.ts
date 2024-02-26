import express from "express";
import { Express } from "express";
import multer, { Multer } from "multer";
import TextUtils from "./utils/TextUtils.js";
import prometheusMiddleware from "./middleware/PrometheusMiddleware.js";
import errorHandler from "./middleware/ErrorHandlerMiddleware.js";
import NotifyController from "./controller/NotifyController.js";
import HealthController from "./controller/HealthController.js";
import Config from "./config/Config.js";
import HttpServerSetup from "./config/HttpServerSetup.js";
import Message from "./model/Message.js";

const upload: Multer = multer();
const app: Express = express();
app.use(express.json());
app.use(prometheusMiddleware);
// ********************
// Check for a request URL
// If not specified, end the process
// ********************
if (!Config.REQUEST_URL) {
  console.log(
    TextUtils.buildBoldLog("No request URL specified, ending process...")
  );
  process.exit(1);
}

// ********************
// Setup server to use HTTP or HTTPS
// ********************
HttpServerSetup.setupServer(app);

// *********************
// POST /notify
// *********************
app.post("/notify/", upload.none(), NotifyController.handleNotify);

// *********************
// GET /health
// *********************
app.get("/health", HealthController.getHealth);

// *********************
// Error handling
// *********************
app.use(errorHandler);
