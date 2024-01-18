const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const request = require("request");

const app = express();
app.use(bodyParser.json());
const upload = multer();
const port = process.env.PORT || 3000;
const token = process.env.LINE_TOKEN;

app.post("/line_hook", upload.none(), (req, res) => {
  const { alertname, namespace } = req.body.commonLabels;
  const { summary } = req.body.commonAnnotations;
  const time = new Date();
  console.log("Alert received at: " + time.toLocaleString());
  console.log(req.body);
  const message =
    "\nAlert Name: " +
    alertname +
    "\n" +
    "Namespace: " +
    namespace +
    "\n" +
    "Summary: " +
    summary +
    "\n";

  const formData = {
    message,
  };

  request.post(
    {
      url: "https://notify-api.line.me/api/notify",
      formData: formData,
      auth: {
        bearer: token,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
        return "error";
      }
      return "done";
    }
  );
  res.send("done");
});

app.listen(port, () => {
  console.log(`Listening for webhooks on ${port}`);
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
