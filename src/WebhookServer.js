import { buildBoldLog, severityColorLookup } from "./TextUtils.js";
import express from "express";
import prometheus from "express-prometheus-middleware";
import bodyParser from "body-parser";
import multer from "multer";
import axios from "axios";
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
  severity && (message += ` ${severity}`);
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
  // console.log(req.body);

  //Extract LINE token from request headers
  let token = extractTokenFromHeaders(req);
  //  Load a default token from environtmental variables if one is not present in headers
  if (!token) token = process.env.LINE_TOKEN;

  // Build message for LINE Notify if we have a token
  let message = "";
  if (token)
    message = buildMessage(alertname, group, severity, summary, description);

  // Post message to LINE Notify if a token and message has been supplied
  if (token && message) {
    const config = {
      headers: { Authorization: "Bearer " + token },
    };

    const form = new FormData();
    form.append("message", message);

    axios
      .post(LINE_NOTIFY_URL, form, config)
      .then((result) => {
        console.log(result.data);
        res.send(result.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        res.send(err.response.data);
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
