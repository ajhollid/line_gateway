import { Express } from "express";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import HttpStatus from "http-status-codes";
import { fileURLToPath } from "url";
import TextUtils from "../utils/TextUtils.js";
import ServerException from "../model/ServerException.js";
import Config from "./Config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HTTPS_ERROR = "Something went wrong starting HTTPS server";

const setupHttps = (app: Express) => {
  try {
    const key = fs.readFileSync(path.join(__dirname, "../../ssl/key.pem"));
    const cert = fs.readFileSync(path.join(__dirname, "../../ssl/crt.pem"));
    https.createServer({ key, cert }, app).listen(Config.HTTPS_PORT, () => {
      console.log(
        TextUtils.buildBoldLog(
          `Listening for HTTPS on port: ${Config.HTTPS_PORT} `
        )
      );
    });
  } catch (err) {
    console.log(TextUtils.buildBoldLog(HTTPS_ERROR));
    throw new ServerException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      HTTPS_ERROR,
      null
    );
  }
};

const setupHttp = (app: Express) => {
  http.createServer(app).listen(Config.PORT, () => {
    console.log(
      TextUtils.buildBoldLog(`Listening for HTTP on port: ${Config.PORT}`)
    );
  });
};

const setupServer = (app: Express) => {
  // ************************
  // If SSL has been enabled, start the HTTPS server, otherwise start HTTP Server
  // ************************
  if (Config.ENABLE_TLS) {
    setupHttps(app);
  } else {
    setupHttp(app);
  }
};

export default { setupServer };
