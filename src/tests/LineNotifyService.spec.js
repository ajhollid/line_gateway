import ServerException from "../model/ServerException.js";
import LineNotifyService from "../service/LineNotifyService.js";
import { expect } from "chai";
/* eslint-env mocha */
describe("LineNotifyService.createConfig()", () => {
  describe("Verify the method is POST", () => {
    it("Should return a config object with a method of POST", () => {
      expect(LineNotifyService.createConfig(null, "test", {}).method).to.equal(
        "POST"
      );
    });
  });

  describe("Verify auth headers", () => {
    it("Should return a config object with authorization headers", () => {
      expect(
        LineNotifyService.createConfig(null, "test", {}).headers.Authorization
      ).to.equal("Bearer test");
    });
  });

  describe("Create config without proxy or body", () => {
    const appConfig = {};
    it("Should return a config object without a body or proxy", () => {
      expect(
        LineNotifyService.createConfig(null, "test", appConfig)
      ).to.deep.equal({
        method: "POST",
        body: null,
        headers: {
          Authorization: "Bearer test",
        },
      });
    });
  });

  describe("Create config with proxy but no body", () => {
    const config = {
      PROXY_URL: "http://localhost:8080",
    };

    console.log(
      LineNotifyService.createConfig(null, "test", config).agent.proxy.href
    );
    it("Should return a config with a proxy and null body", () => {
      expect(
        LineNotifyService.createConfig(null, "test", config).agent.proxy.href
      ).to.equal(config.PROXY_URL + "/");
      expect(
        LineNotifyService.createConfig(null, "test", config).body
      ).to.equal(null);
    });
  });

  describe("Create config with body but no proxy", () => {
    const form = new FormData();
    form.append("message", "test");
    const config = {};
    it("Should return a config with a body and no proxy", () => {
      expect(
        LineNotifyService.createConfig(form, "test", config).body
      ).to.equal(form);
      expect(
        LineNotifyService.createConfig(form, "test", config).agent
      ).to.equal(undefined);
    });
  });

  describe("Create config with proxy and body", () => {
    const form = new FormData();
    form.append("message", "test");
    const config = {
      PROXY_URL: "http://localhost:8080",
    };
    it("Should return a config with a body and proxy", () => {
      expect(
        LineNotifyService.createConfig(form, "test", config).body
      ).to.equal(form);
      expect(
        LineNotifyService.createConfig(form, "test", config).agent.proxy.href
      ).to.equal(config.PROXY_URL + "/");
    });
  });
});

describe("LineNotifyService.createForm", () => {
  describe("Create form with no message", () => {
    it("Should throw an error", () => {
      expect(() => LineNotifyService.createForm()).to.throw(
        ServerException,
        LineNotifyService.MESSAGE_ERROR
      );
    });
  });

  describe("Create form with null message", () => {
    it("Should throw an error", () => {
      expect(() => LineNotifyService.createForm(null)).to.throw(
        ServerException,
        LineNotifyService.MESSAGE_ERROR
      );
    });
  });

  describe("Create form with message", () => {
    it("Should return a form with the message", () => {
      expect(LineNotifyService.createForm("test").get("message")).to.equal(
        "test"
      );
    });
  });
});
