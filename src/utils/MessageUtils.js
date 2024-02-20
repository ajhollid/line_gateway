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
  if (!alerts || alerts.length == 0) return [];

  return alerts
    .map((alert) => {
      const status = extractProperty(alert, "status");
      const labels = extractProperty(alert, "labels");
      const annotations = extractProperty(alert, "annotations");
      const alertname = extractProperty(labels, "alertname");
      const severity = extractProperty(labels, "severity");
      const summary = extractProperty(annotations, "summary");
      const description = extractProperty(annotations, "description");

      let messageParts = [
        alertname && `Alert Name: ${alertname}`,
        status && `Status: ${status}`,
        severity &&
          `Severity: ${TextUtils.severityColorLookup(severity)} ${severity}`,
        summary && `Summary: ${summary}`,
        description && `Description: ${description}`,
      ].filter(Boolean);
      return messageParts.length > 0 ? `\n${messageParts.join("\n")}` : null;
    })
    .filter(Boolean);
};

export default { buildMessages, extractProperty, extractTokenFromHeaders };
