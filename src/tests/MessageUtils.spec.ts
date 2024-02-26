/* eslint-env mocha */
import { expect } from "chai";

import MessageUtils from "../utils/MessageUtils.js";
import TextUtils from "../utils/TextUtils.js";
import { mockReq } from "sinon-express-mock";
import Alert from "../model/Alert.js";

describe("MessageUtils.buildMessage()", () => {
  const alertname: string = "Test Alert";
  const status: string = "firing";
  const severity: string = "critical";
  const unknownSeverity: string = "unknownSeverity";
  const summary: string = "Test Summary";
  const description: string = "Test Description";

  describe("Build messages from null array", () => {
    it("Should return an empty message", () => {
      expect(MessageUtils.buildMessages(null)).to.deep.equal([]);
    });
  });

  describe("Build message array with empty lables and empty annotations", () => {
    it("Should return an array with one empty message", () => {
      let sampleAlert: Alert = {
        labels: {},
        annotations: {},
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([]);
    });
  });

  describe("Build message array with one message and alert name only", () => {
    it("Should return an array with one message with only an alert name", () => {
      let sampleAlert: Alert = {
        labels: { alertname },
        annotations: {},
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nAlert Name: " + alertname,
      ]);
    });
  });

  describe("Build message array with one message and status only", () => {
    it("Should return an array with one message with a status", () => {
      let sampleAlert: Alert = {
        labels: { status },
        annotations: {},
        status,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nStatus: " + TextUtils.statusLookup(status) + ` ${status}`,
      ]);
    });
  });

  describe("Build message array with one message with severity level only", () => {
    it("Should return an array with one message with a severity level", () => {
      let sampleAlert: Alert = {
        labels: { severity },
        annotations: {},
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSeverity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}`,
      ]);
    });
  });

  describe("Build message array with one message with unknown severity level only", () => {
    it("Should return an array with one message with default severity level", () => {
      const severityEmoji: string =
        TextUtils.severityColorLookup(unknownSeverity);
      let sampleAlert: Alert = {
        labels: { severity: unknownSeverity },
        annotations: {},
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSeverity: " + severityEmoji + ` ${unknownSeverity}`,
      ]);
    });
  });

  describe("Build message array with one message with summary only", () => {
    it("Should return an array of messages with one message with a summary", () => {
      let sampleAlert: Alert = {
        labels: {},
        annotations: { summary },
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nSummary: " + summary,
      ]);
    });
  });

  describe("Build an array of messages with one message with description only", () => {
    it("Should return an array of messages with one message with a description", () => {
      let sampleAlert: Alert = {
        labels: {},
        annotations: { description },
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nDescription: " + description,
      ]);
    });
  });

  describe("Build message array with one message with undefined fields", () => {
    it("Should return a message with an empty message", () => {
      let sampleAlert: Alert = {
        labels: { alertname: undefined, severity: undefined },
        annotations: { summary: undefined, description: undefined },
        status: null,
      };
      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([]);
    });
  });

  describe("Build message array with one message with all fields", () => {
    it("Should return an array of messages with one properly built message", () => {
      let sampleAlert: Alert = {
        labels: { alertname, severity },
        annotations: { summary, description },
        status,
      };

      expect(MessageUtils.buildMessages([sampleAlert])).to.deep.equal([
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          TextUtils.statusLookup(status) +
          ` ${status}` +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
      ]);
    });
  });

  describe("Build message array with two messages with all fields", () => {
    it("Should return an array of messages with two properly built message", () => {
      let sampleAlert: Alert = {
        labels: { alertname, severity },
        annotations: { summary, description },
        status,
      };

      expect(
        MessageUtils.buildMessages([sampleAlert, sampleAlert])
      ).to.deep.equal([
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          TextUtils.statusLookup(status) +
          ` ${status}` +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
        "\nAlert Name: " +
          alertname +
          "\nStatus: " +
          TextUtils.statusLookup(status) +
          ` ${status}` +
          "\n" +
          "Severity: " +
          TextUtils.severityColorLookup(severity) +
          ` ${severity}` +
          "\n" +
          "Summary: " +
          summary +
          "\n" +
          "Description: " +
          description,
      ]);
    });
  });

  describe("Build message array with one message with all fields and one message with empty fields", () => {
    it("Should return an array of messages with one properly built message", () => {
      let sampleAlert: Alert = {
        status,
        labels: { alertname, severity },
        annotations: { summary, description },
      };

      let badAlert: Alert = {
        labels: {
          alertname: undefined,
          severity: undefined,
        },
        annotations: {
          summary: undefined,
          description: undefined,
        },
        status: undefined,
      };

      expect(MessageUtils.buildMessages([sampleAlert, badAlert])).to.deep.equal(
        [
          "\nAlert Name: " +
            alertname +
            "\nStatus: " +
            TextUtils.statusLookup(status) +
            ` ${status}` +
            "\n" +
            "Severity: " +
            TextUtils.severityColorLookup(severity) +
            ` ${severity}` +
            "\n" +
            "Summary: " +
            summary +
            "\n" +
            "Description: " +
            description,
        ]
      );
    });
  });
});

describe("MessageUtils.extractProperty()", () => {
  describe("Try to extract labels from undefined body", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractProperty(undefined), "labels").to.equal(null);
    });
  });

  describe("Try to extract labels from request with empty body", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractProperty({}), "labels").to.deep.equal(null);
    });
  });

  describe("Try to extract labels from request with no labels", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractProperty({ labels: {} }),
        "labels"
      ).to.deep.equal(null);
    });
  });

  describe("Try to extract labels from request with common labels", () => {
    it("Should return labels object", () => {
      expect(
        MessageUtils.extractProperty(
          { labels: { label1: "test", label2: "test2" } },
          "labels"
        )
      ).to.deep.equal({ label1: "test", label2: "test2" });
    });
  });

  describe("Try to extract nonexistant property from request", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractProperty(
          { labels: { label1: "test", label2: "test2" } },

          "nonexistantProperty"
        )
      ).to.deep.equal(null);
    });
  });
});

let testToken = "test_token";
describe("MessageUtils.extractTokenFromHeaders()", () => {
  describe("Try to extract token from undefined request", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractTokenFromHeaders(undefined)).to.equal(null);
    });
  });

  describe("Try to extract token from request with no headers", () => {
    it("Should return null", () => {
      expect(MessageUtils.extractTokenFromHeaders(mockReq())).to.equal(null);
    });
  });

  describe("Try to extract token from headers with no auth", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractTokenFromHeaders(mockReq({ headers: {} }))
      ).to.equal(null);
    });
  });

  describe("Try to extract token from headers with no bearer token", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractTokenFromHeaders(
          mockReq({
            headers: { authorization: "test" },
          })
        )
      ).to.equal(null);
    });
  });

  describe("Try to extract token from headers with bearer token", () => {
    it("Should return " + testToken, () => {
      expect(
        MessageUtils.extractTokenFromHeaders(
          mockReq({
            headers: { authorization: "Bearer " + testToken },
          })
        )
      ).to.equal(testToken);
    });
  });

  describe("Try to extract token from headers with invalid token format", () => {
    it("Should return null", () => {
      expect(
        MessageUtils.extractTokenFromHeaders(
          mockReq({
            headers: { authorization: 123 },
          })
        )
      ).to.equal(null);
    });
  });
});
