import { buildBoldLog } from "./TextUtils.js";
import express from "express";
import prometheus from "express-prometheus-middleware";
import bodyParser from "body-parser";
import multer from "multer";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import yn from "yn";
import {
  extractProperty,
  extractTokenFromHeaders,
  buildMessages,
} from "./MessageUtils.js";
import LineNotifyService from "./LineNotifyService.js";
import ServerException from "./ServerException.js";
import HttpStatus from "http-status-codes";

const REQUEST_URL = process.env.REQUEST_URL;
const ENABLE_TLS = yn(process.env.ENABLE_TLS);
const HTTPS_PORT = 8443;
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(
  prometheus({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  })
);

const upload = multer();
// ************************
// If SSL has been enabled, start the HTTPS server, otherwise start HTTP Server
// ************************
if (ENABLE_TLS) {
  try {
    const key = fs.readFileSync(path.join(__dirname, "../ssl/key.pem"));
    const cert = fs.readFileSync(path.join(__dirname, "../ssl/crt.pem"));
    https.createServer({ key, cert }, app).listen(HTTPS_PORT, () => {
      console.log(buildBoldLog(`Listening for HTTPS on port: ${HTTPS_PORT} `));
    });
  } catch (err) {
    console.log(buildBoldLog("Something went wrong starting HTTPS server"));
    throw new ServerException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong starting HTTPS server"
    );
  }
}

!ENABLE_TLS &&
  http.createServer(app).listen(PORT, () => {
    console.log(buildBoldLog(`Listening for HTTP on port: ${PORT}`));
  });

// *********************
// POST /notify
// *********************
app.post("/notify/", upload.none(), (req, res) => {
  // ********************
  // Log alert received
  // ********************
  const time = new Date();
  console.log(buildBoldLog("Alert received at: " + time.toLocaleString()));
  console.log(JSON.stringify(req.body, null, 2));

  // ********************
  // Try to get token from headers, if not present, look for default token
  // If no token supplied, send an error
  // ********************
  let token = null;
  if (req && req.headers) {
    token = extractTokenFromHeaders(req);
  } else {
    token = process.env.DEFAULT_LINE_TOKEN;
  }

  if (!token) {
    throw new ServerException(
      HttpStatus.UNAUTHORIZED,
      "No token supplied, request not sent"
    );
  }

  // ********************
  // Check for a request URL
  // ********************
  if (!REQUEST_URL) {
    throw new ServerException(
      HttpStatus.BAD_REQUEST,
      "No request URL supplied"
    );
  }

  // ********************
  // Build message for LINE server
  // ********************
  const alerts = extractProperty(req.body, "alerts");
  if (!alerts) {
    throw new ServerException(
      HttpStatus.BAD_REQUEST,
      "No alerts found, request not sent"
    );
  }

  let messages = buildMessages(alerts);
  if (messages.length <= 0) {
    console.log("No messages were built, request not sent");
    throw new ServerException(400, "No messages found, request not sent");
  }

  LineNotifyService.postToLineServer(messages, token)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      throw new ServerException(500, err);
    });
});

// *********************
// GET /health
// *********************
app.get("/health", (req, res) => {
  let uptime = new Date(Math.floor(process.uptime()) * 1000)
    .toISOString()
    .substring(11, 19);
  uptime = uptime.substring(0, 2) + "h" + uptime.substring(2);
  uptime = uptime.substring(0, 6) + "m" + uptime.substring(6);
  uptime = uptime.substring(0, 12) + "s" + uptime.substring(12);

  const healthCheck = {
    uptime,
    message: "OK",
    timestamp: new Date(Date.now()).toLocaleString(),
  };
  try {
    res.send(healthCheck);
  } catch (err) {
    healthCheck.message = err;
    throw new ServerException(HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
});

// *********************
// Error handling
// *********************
app.use((err, req, res, next) => {
  res
    .status(err.httpStatus || 500)
    .json({ status: err.httpStatus, message: err.message });
});

// *********************
// Handle termination signals
// *********************

process.on("SIGINT", () => {
  console.log(buildBoldLog("Caught interrupt signal"));
  process.exit();
});

process.on("SIGTERM", () => {
  console.log(buildBoldLog("Caught termination signal"));
  process.exit();
});
