import * as chai from "chai";
import { describe, it } from "mocha";
import { severityColorLookup } from "../TextUtils.js";
let expect = chai.expect;

describe("textUtils()", () => {
  describe("Severity Color Lookup", () => {
    describe("Severity: none", () => {
      it("Should return a blue emoji", () => {
        expect(severityColorLookup["none"]()).to.equal("🔵 ");
      });
    });

    describe("Severity: warning", () => {
      it("Should return a yellow emoji", () => {
        expect(severityColorLookup["warning"]()).to.equal("🟡 ");
      });
    });

    describe("Severity: critical", () => {
      it("Should return a red emoji", () => {
        expect(severityColorLookup["critical"]()).to.equal("🔴 ");
      });
    });

    describe("Default severity", () => {
      it("Should return a white emoji", () => {
        expect(severityColorLookup.default()).to.equal("⚪ ");
      });
    });
  });
});
