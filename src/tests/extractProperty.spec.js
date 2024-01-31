import * as chai from "chai";
import { describe, it } from "mocha";
import { extractProperty } from "../WebhookServer.js";
let expect = chai.expect;

describe("extractCommonLabelsFromReq()", () => {
  describe("Try to extract labels from undefined body", () => {
    it("Should return an empty object", () => {
      expect(extractProperty(undefined), "commonLabels").to.equal("");
    });
  });

  describe("Try to extract labels from request with empty body", () => {
    it("Should return an empty object", () => {
      expect(extractProperty({}), "commonLabels").to.deep.equal("");
    });
  });

  describe("Try to extract labels from request with no common labels", () => {
    it("Should return an empty object", () => {
      expect(
        extractProperty({ commonLabels: {} }),
        "commonLabels"
      ).to.deep.equal("");
    });
  });

  describe("Try to extract labels from request with common labels", () => {
    it("Should return common labels object", () => {
      expect(
        extractProperty(
          { commonLabels: { label1: "test", label2: "test2" } },
          "commonLabels"
        )
      ).to.deep.equal({ label1: "test", label2: "test2" });
    });
  });

  describe("Try to extract nonexistant property from request", () => {
    it("Should return an empty object", () => {
      expect(
        extractProperty(
          { commonLabels: { label1: "test", label2: "test2" } },

          "nonexistantProperty"
        )
      ).to.deep.equal("");
    });
  });
});
