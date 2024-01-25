import * as chai from "chai";
import { describe, it } from "mocha";
import { buildMessage } from "../WebhookServer.js";
import { severityColorLookup } from "../TextUtils.js";
let expect = chai.expect;

describe("buildMessage()", () => {
  let alertname = "Test Alert";
  let status = "Firing";
  let group = "Test Group";
  let severity = "critical";
  let unknownSeverity = "unknownSeverity";
  let summary = "Test Summary";
  let description = "Test Description";

  describe("Build empty message", () => {
    it("Should return an empty message", () => {
      expect(buildMessage("")).to.equal("");
    });
  });

  describe("Build message with alert name only", () => {
    it("Should return a message with an alert name", () => {
      expect(buildMessage(alertname)).to.equal("\nAlert Name: " + alertname);
    });
  });

  describe("Build message with status only", () => {
    it("Should return a message with a status", () => {
      expect(buildMessage(undefined, status)).to.equal("\nStatus: " + status);
    });
  });

  describe("Build message with group name only", () => {
    it("Should return a message with a group name", () => {
      expect(buildMessage(undefined, undefined, group)).to.equal(
        "\nGroup: " + group
      );
    });
  });

  describe("Build message with severity level only", () => {
    it("Should return a message with severity level", () => {
      expect(buildMessage(undefined, undefined, undefined, severity)).to.equal(
        "\nSeverity: " + severityColorLookup[severity]() + ` ${severity}`
      );
    });
  });

  describe("Build message with uknown severity level only", () => {
    it("Should return a message with default severity level", () => {
      const severityEmoji = severityColorLookup[unknownSeverity]
        ? severityColorLookup[unknownSeverity]()
        : severityColorLookup.default();
      expect(
        buildMessage(undefined, undefined, undefined, unknownSeverity)
      ).to.equal("\nSeverity: " + severityEmoji + ` ${unknownSeverity}`);
    });
  });

  describe("Build message with summary only", () => {
    it("Should return a message with a summary", () => {
      expect(
        buildMessage(undefined, undefined, undefined, undefined, summary)
      ).to.equal("\nSummary: " + summary);
    });
  });

  describe("Build message with description only", () => {
    it("Should return a message with a description", () => {
      expect(
        buildMessage(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          description
        )
      ).to.equal("\nDescription: " + description);
    });
  });

  describe("Build message with undefined fields", () => {
    it("Should return a message with an empty message", () => {
      expect(
        buildMessage(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        )
      ).to.equal("");
    });
  });

  describe("Build message with all fields", () => {
    it("Should return a properly built message", () => {
      expect(
        buildMessage(alertname, status, group, severity, summary, description)
      ).to.equal(
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          status +
          "\nGroup: " +
          group +
          "\n" +
          "Severity: " +
          severityColorLookup[severity]() +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description
      );
    });
  });
});
