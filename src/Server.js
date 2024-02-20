import express from "express";
import multer from "multer";
import TextUtils from "./utils/TextUtils.js";
import prometheusMiddleware from "./middleware/PrometheusMiddleware.js";
import errorHandler from "./middleware/ErrorHandlerMiddleware.js";
import NotifyController from "./controller/NotifyController.js";
import HealthController from "./controller/HealthController.js";
import Config from "./config/Config.js";
import HttpServerSetup from "./config/HttpServerSetup.js";

const upload = multer();
const app = express();
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
// Handle termination signals
// *********************
const handleTerminationSignals = (signal) => {
  console.log(TextUtils.buildBoldLog(`${signal}, ending process...`));
  process.exit();
};

process.on("SIGINT", () => handleTerminationSignals("SIGINT"));
process.on("SIGTERM", () => handleTerminationSignals("SIGTERM"));

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
// eslint-disable-next-line no-unused-vars
app.use(errorHandler);
