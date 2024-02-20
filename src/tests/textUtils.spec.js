import * as chai from "chai";
import { describe, it } from "mocha";
import TextUtils from "../utils/TextUtils.js";
let expect = chai.expect;

describe("textUtils()", () => {
  describe("Severity Color Lookup", () => {
    describe("Severity: none", () => {
      it("Should return a blue emoji", () => {
        expect(TextUtils.severityColorLookup("none")).to.equal("🔵");
      });
    });

    describe("Severity: warning", () => {
      it("Should return a yellow emoji", () => {
        expect(TextUtils.severityColorLookup("warning")).to.equal("🟡");
      });
    });

    describe("Severity: critical", () => {
      it("Should return a red emoji", () => {
        expect(TextUtils.severityColorLookup("critical")).to.equal("🔴");
      });
    });

    describe("Unknown severity", () => {
      it("Should return a white emoji", () => {
        expect(TextUtils.severityColorLookup("unknown")).to.equal("⚪");
      });
    });
  });
});
