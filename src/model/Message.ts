import TextUtils from "../utils/TextUtils.js";
export default class Message {
  private readonly alertname: string;
  private readonly status: string;
  private readonly severity: string;
  private readonly message: string;
  private readonly summary: string;
  private readonly description: string;

  constructor(
    alertname?: string,
    status?: string,
    severity?: string,
    message?: string,
    summary?: string,
    description?: string
  ) {
    this.alertname = alertname;
    this.status = status;
    this.severity = severity;
    this.message = message;
    this.summary = summary;
    this.description = description;
  }

  private buildMessage(): string {
    let messageParts: Array<string> = [
      this.alertname && `Alert Name: ${this.alertname}`,
      this.status &&
        `Status: ${TextUtils.statusLookup(this.status)} ${this.status}`,
      this.severity &&
        `Severity: ${TextUtils.severityColorLookup(this.severity)} ${
          this.severity
        }`,
      this.message && `Message: ${this.message}`,
      this.summary && `Summary: ${this.summary}`,
      this.description && `Description: ${this.description}`,
    ];

    const message = messageParts.filter(Boolean).join("\n");

    return message ? `\n${message}` : null;
  }

  toString(): string {
    return this.buildMessage();
  }
}
