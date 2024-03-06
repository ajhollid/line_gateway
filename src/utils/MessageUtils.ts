import { Request } from "express";
import Alert from "../model/Alert.js";
import Labels from "../model/Labels.js";
import Annotations from "../model/Annotations.js";
import Message from "../model/Message.js";

const extractTokenFromHeaders = (req: Request): string => {
  const authHeader: string = req?.headers?.authorization;
  if (typeof authHeader == "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7, authHeader.length);
  }
  return null;
};

const extractProperty: any = (obj: any, property: string): string => {
  if (obj && obj[property]) return obj[property];
  return null;
};

const buildMessages = (alerts: Array<Alert>): Array<string> => {
  if (!alerts || alerts.length == 0) return [];

  return alerts
    .map((alert): string => {
      const status: string = alert.status;
      const labels: Labels = alert.labels;
      const annotations: Annotations = alert.annotations;
      const alertname: string = extractProperty(labels, "alertname");
      const severity: string = extractProperty(labels, "severity");
      const message: string = extractProperty(annotations, "message");
      const summary: string = extractProperty(annotations, "summary");
      const description: string = extractProperty(annotations, "description");
      const lineMsg: Message = new Message(
        alertname,
        status,
        severity,
        message,
        summary,
        description
      );

      return lineMsg.toString();
    })
    .filter(Boolean);
};

export default { buildMessages, extractProperty, extractTokenFromHeaders };
