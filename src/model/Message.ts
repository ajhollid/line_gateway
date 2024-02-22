import TextUtils from "../utils/TextUtils.js";
export default class Message {
  alertname: string = null;
  status: string = null;
  severity: string = null;
  summary: string = null;
  description: string = null;

  constructor(
    alertname: string,
    status: string,
    severity: string,
    summary: string,
    description: string
  ) {
    this.alertname = alertname;
    this.status = status;
    this.severity = severity;
    this.summary = summary;
    this.description = description;
  }

  buildMessage(): string {
    console.log("STATUS:", this.status);
    let messageParts: Array<String> = [];
    this.alertname && messageParts.push(`Alert Name: ${this.alertname}`);
    this.status && messageParts.push(`Status: ${this.status}`);
    this.severity &&
      messageParts.push(
        `Severity: ${TextUtils.severityColorLookup(this.severity)} ${
          this.severity
        }`
      );
    this.summary && messageParts.push(`Summary: ${this.summary}`);
    this.description && messageParts.push(`Description: ${this.description}`);
    return messageParts.length > 0 ? `\n${messageParts.join("\n")}` : null;
  }
}
