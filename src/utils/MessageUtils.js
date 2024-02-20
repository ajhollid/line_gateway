import TextUtils from "./TextUtils.js";

const extractTokenFromHeaders = (req) => {
  let authHeader = req?.headers?.authorization;
  if (typeof authHeader == "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7, authHeader.length);
  }
  return null;
};

const extractProperty = (obj, property) => {
  if (obj && obj[property]) return obj[property];
  return null;
};

const buildMessages = (alerts) => {
  let messages = [];

  if (!alerts || alerts.length == 0) return messages;

  for (let i = 0; i < alerts.length; i++) {
    let message = "";
    let alert = alerts[i];
    let status = extractProperty(alert, "status");
    let labels = extractProperty(alert, "labels");
    let annotations = extractProperty(alert, "annotations");
    let alertname = extractProperty(labels, "alertname");
    let severity = extractProperty(labels, "severity");
    let summary = extractProperty(annotations, "summary");
    let description = extractProperty(annotations, "description");
    alertname && (message += "\nAlert Name: " + alertname);
    status && (message += "\nStatus: " + status);
    severity &&
      (message +=
        "\n" +
        "Severity: " +
        TextUtils.severityColorLookup(severity) +
        " " +
        severity);

    summary && (message += "\n" + "Summary: " + summary);
    description && (message += "\n" + "Description: " + description);
    if (message != "") {
      messages.push(message);
    }
  }
  return messages;
};

export default { buildMessages, extractProperty, extractTokenFromHeaders };
