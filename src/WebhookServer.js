import { buildBoldLog, severityColorLookup } from "./TextUtils.js";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import request from "request";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINE_NOTIFY_URL = "https://notify-api.line.me/api/notify";
const PORT = 8080;
const HTTPS_PORT = 8443;

const app = express();
app.use(bodyParser.json());
const upload = multer();

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

http.createServer(app).listen(PORT, () => {
  console.log(buildBoldLog(`Listening for HTTP on port: ${PORT}`));
});

const buildMessage = (alertname, group, severity, summary, description) => {
  let message = "";
  alertname && (message += "\nAlert Name: " + alertname);
  group && (message += "\nGroup: " + group);
  severity && (message += "\n" + "Severity: ");
  severity &&
    (severityColorLookup[severity]
      ? (message += severityColorLookup[severity]())
      : (message += severityColorLookup.default()));
  severity && (message += severity);
  summary && (message += "\n" + "Summary: " + summary);
  description && (message += "\n" + "Description: " + description);
  return message;
};

// *********************
// POST /notify
// *********************

const postNotify = (req, res) => {
  const group = req.query.group;
  const { alertname, severity } = req.body.commonLabels
    ? req.body.commonLabels
    : {}; // destructure labels from the request body
  const { summary, description } = req.body.commonAnnotations
    ? req.body.commonAnnotations
    : {}; // deconstruct annotations from request body
  const time = new Date();

  // Log time of alert and request body
  console.log(buildBoldLog("Alert received at: " + time.toLocaleString()));
  console.log(req.headers);

  //Extract LINE token from request headers
  let token = "";
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  } else {
    //Load a default token from environtmental variables if one is not present in headers
    token = process.env.LINE_TOKEN;
  }

  // Post message to LINE Notify if a token has been supplied
  if (token) {
    // Build message for LINE Notify
    const message = buildMessage(
      alertname,
      group,
      severity,
      summary,
      description
    );
    request.post(
      {
        url: LINE_NOTIFY_URL,
        formData: { message },
        auth: {
          bearer: token,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        console.log("Forward Success, server responded with: ", body);
        res.send("done");
      }
    );
  } else {
    console.error(buildBoldLog("No token has been supplied, request not sent"));
    token && res.send("Error");
  }
};

app.post("/notify/", upload.none(), (req, res) => {
  postNotify(req, res);
});

export { buildMessage };

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
