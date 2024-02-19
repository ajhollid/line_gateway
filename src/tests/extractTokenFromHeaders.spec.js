import * as chai from "chai";
import { describe, it } from "mocha";
import { extractTokenFromHeaders } from "../MessageUtils.js";
let expect = chai.expect;
let testToken = "test_token";

describe("extractTokenFromHeaders()", () => {
  describe("Try to extract token from undefined request", () => {
    it("Should return null", () => {
      expect(extractTokenFromHeaders(undefined)).to.equal(null);
    });
  });

  describe("Try to extract token from request with no headers", () => {
    it("Should return null", () => {
      expect(extractTokenFromHeaders({})).to.equal(null);
    });
  });

  describe("Try to extract token from headers with no auth", () => {
    it("Should return null", () => {
      expect(extractTokenFromHeaders({ headers: {} })).to.equal(null);
    });
  });

  describe("Try to extract token from headers with no bearer token", () => {
    it("Should return null", () => {
      expect(
        extractTokenFromHeaders({ headers: { authorization: "test" } })
      ).to.equal(null);
    });
  });

  describe("Try to extract token from headers with bearer token", () => {
    it("Should return " + testToken, () => {
      expect(
        extractTokenFromHeaders({
          headers: { authorization: "Bearer " + testToken },
        })
      ).to.equal(testToken);
    });
  });

  describe("Try to extract token from headers with invalid token format", () => {
    it("Should return null", () => {
      expect(
        extractTokenFromHeaders({
          headers: { authorization: 123 },
        })
      ).to.equal(null);
    });
  });
});
