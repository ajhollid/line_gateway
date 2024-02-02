import { buildBoldLog, severityColorLookup } from "./TextUtils.js";
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
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

const REQUEST_URL = process.env.REQUEST_URL;
const ENABLE_TLS = process.env.ENABLE_TLS;
const HTTPS_PORT = 8443;
const PORT = 8080;

//Configure proxy agent if it is specified
let PROXY_AGENT;
if (process.env.PROXY_URL) {
  PROXY_AGENT = new HttpsProxyAgent(process.env.PROXY_URL);
  console.log(buildBoldLog("Proxy: " + process.env.PROXY_URL));
}

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

// If SSL has been enabled, start the HTTPS server
if (ENABLE_TLS === "true") {
  try {
    const key = fs.readFileSync(path.join(__dirname, "../ssl/key.pem"));
    const cert = fs.readFileSync(path.join(__dirname, "../ssl/crt.pem"));
    https.createServer({ key, cert }, app).listen(HTTPS_PORT, () => {
      console.log(buildBoldLog(`Listening for HTTPS on port: ${HTTPS_PORT} `));
    });
  } catch (err) {
    console.log(buildBoldLog("Something went wrong starting HTTPS server"));
    console.error(err);
  }
}

// If it hasn't been enabled, start the HTTP server
ENABLE_TLS !== "true" &&
  http.createServer(app).listen(PORT, () => {
    console.log(buildBoldLog(`Listening for HTTP on port: ${PORT}`));
  });

// *********************
// POST /notify
// *********************

const extractTokenFromHeaders = (req) => {
  let authHeader = req?.headers?.authorization;
  if (typeof authHeader == "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7, authHeader.length);
  }
  return "";
};

const extractProperty = (obj, property) => {
  if (obj && obj[property]) return obj[property];
  return "";
};

const buildMessage = (
  alertname,
  status,
  group,
  severity,
  summary,
  description
) => {
  let message = "";
  alertname && (message += "\nAlert Name: " + alertname);
  status && (message += "\nStatus: " + status);
  group && (message += "\nGroup: " + group);
  severity && (message += "\n" + "Severity: ");
  severity &&
    (severityColorLookup[severity]
      ? (message += severityColorLookup[severity]())
      : (message += severityColorLookup.default()));
  severity && (message += ` ${severity}`);
  summary && (message += "\n" + "Summary: " + summary);
  description && (message += "\n" + "Description: " + description);
  return message;
};

const postNotify = (req, res) => {
  const group = req.query.group;

  //Extract properties from request
  const status = extractProperty(req, "status");
  const { alertname, severity } = extractProperty(req.body, "commonLabels");
  const { summary, description } = extractProperty(
    req.body,
    "commonAnnotations"
  );
  const time = new Date();

  // Log time of alert and request body
  console.log(buildBoldLog("Alert received at: " + time.toLocaleString()));
  // console.log(req.body);

  //Extract LINE token from request headers
  let token = extractTokenFromHeaders(req);
  //  Load a default token from environtmental variables if one is not present in headers
  if (!token) token = process.env.DEFAULT_LINE_TOKEN;

  // Build message for LINE Notify if we have a token
  let message = "";
  if (token)
    message = buildMessage(
      alertname,
      status,
      group,
      severity,
      summary,
      description
    );

  // Post message to LINE Notify if a token and message has been supplied
  if (token && message) {
    const form = new FormData();
    form.append("message", message);

    const config = {
      method: "POST",
      body: form,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    if (PROXY_AGENT) {
      config.agent = PROXY_AGENT;
    }

    fetch(REQUEST_URL, config)
      .then((response) => response.text())
      .then((body) => {
        console.log(buildBoldLog("Success: " + body));
        res.send(body);
      })
      .catch((err) => {
        console.error(buildBoldLog("Error: " + err.message));
        res.send(err.message);
      });
  } else {
    // Otherwise log error
    !token &&
      console.error(
        buildBoldLog("No token has been supplied, request not sent")
      );

    !message &&
      console.error(
        buildBoldLog("No message has been supplied, request not sent")
      );
    res.send("Error");
  }
};

app.post("/notify/", upload.none(), (req, res) => {
  postNotify(req, res);
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
    res.status(503).send;
  }
});

export { buildMessage, extractTokenFromHeaders, extractProperty };

// Sample Request

// {
//   "alerts":[
//      {
//         "status":"firing",
//         "labels":[
//            "Object"
//         ],
//         "annotations":{

//         },
//         "startsAt":"2024-01-17T05:57:27.549Z",
//         "endsAt":"0001-01-01T00:00:00Z",
//         "generatorURL":"http://demo-prometheus-deployment-5dcd658b49-9wgtx:9090/graph?g0.expr=up%7Bjob%3D%22grafana%22%7D+%3D%3D+0&g0.tab=1",
//         "fingerprint":"22ab40c8fd052d55"
//      }
//   ],
//   "groupLabels":{

//   },
//   "commonLabels":{
//      "alertname":"GrafanaDown",
//      "instance":"demo-grafana-service.alex-demo.svc.cluster.local:443",
//      "job":"grafana",
//      "severity":"critical",
//      "team":"line"
//   },
//   "commonAnnotations":{

//   },
//   "externalURL":"http://demo-alertmanager-deployment-7bf46c5b5c-pdw79:9093",
//   "version":"4",
//   "groupKey":"{}/{team=\"line\"}:{}",
//   "truncatedAlerts":0
// }
