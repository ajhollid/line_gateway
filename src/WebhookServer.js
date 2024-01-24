import { buildBoldLog, severityColorLookup } from "./TextUtils.js";
import express from "express";
import prometheus from "express-prometheus-middleware";
import bodyParser from "body-parser";
import multer from "multer";
import request from "request";
import http from "http";
import "dotenv/config";

const LINE_NOTIFY_URL = "https://notify-api.line.me/api/notify";
const PORT = 8080;

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

const extractProperty = (req, property) => {
  let body = req?.body;
  if (body && body[property]) return body[property];
  return {};
};

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

const postNotify = (req, res) => {
  const group = req.query.group;

  //Extract properties from request
  const { alertname, severity } = extractProperty(req, "commonLabels");
  const { summary, description } = extractProperty(req, "commonAnnotations");
  const time = new Date();

  // Log time of alert and request body
  console.log(buildBoldLog("Alert received at: " + time.toLocaleString()));
  console.log(req.body);

  //Extract LINE token from request headers
  let token = extractTokenFromHeaders(req);

  //Load a default token from environtmental variables if one is not present in headers
  if (!token) token = process.env.LINE_TOKEN;

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
    // Otherwise log error
    console.error(buildBoldLog("No token has been supplied, request not sent"));
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
  const healthCheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    message: "OK",
    timestamp: Date.now(),
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
