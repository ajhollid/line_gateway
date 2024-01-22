import { buildBoldLog, severityColorLookup } from "./TextUtils.js";
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import request from "request";

const app = express();
app.use(bodyParser.json());
const upload = multer();
const port = 3000;

const buildMessage = (alertname, group, severity, summary, description) => {
  let message = "";

  if (alertname) {
    message += "\nAlert Name: " + alertname;
  }

  if (group) {
    message += "\nGroup: " + group;
  }

  if (severity) {
    message = message + "\n" + "Severity: ";
    severityColorLookup[severity]
      ? (message += severityColorLookup[severity]())
      : (message += severityColorLookup.default());
    message += severity;
  }

  if (summary) {
    message = message + "\n" + "Summary: " + summary;
  }

  if (description) {
    message = message + "\n" + "Description: " + description;
  }
  return message;
};

app.listen(port, () => {
  console.log(`Listening for alerts on ${port}`);
});

app.post("/notify/", upload.none(), (req, res) => {
  const group = req.query.group;
  const { alertname, severity } = req.body.commonLabels
    ? req.body.commonLabels
    : {}; // destructure labels from the request body
  const { summary, description } = req.body.commonAnnotations
    ? req.body.commonAnnotations
    : {}; // deconstruct annotations from request body
  const time = new Date();

  // Log time alert received at
  console.log(buildBoldLog("Alert received at: " + time.toLocaleString()));
  //Log body of request
  let token = "";
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  }
  // console.log(req.body);

  // Build message for LINE Notify
  const message = buildMessage(
    alertname,
    group,
    severity,
    summary,
    description
  );

  // Post message to LINE Notify
  request.post(
    {
      url: "https://notify-api.line.me/api/notify",
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
});

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
