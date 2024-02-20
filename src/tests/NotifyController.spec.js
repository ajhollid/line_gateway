import HttpStatus from "http-status-codes";
import LineNotifyService from "../service/LineNotifyService.js";
import NotifyController from "../controller/NotifyController.js";
import MessageUtils from "../utils/MessageUtils.js";
import ServerException from "../model/ServerException.js";
import sinon from "sinon";
import { describe, it, afterEach } from "mocha";
import * as chai from "chai";

let expect = chai.expect;
describe("NotifyController", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should handle notify", async () => {
    const req = {
      headers: { authorization: "Bearer token" },
      body: { alerts: ["alert1", "alert2"] },
    };
    const res = { send: sinon.spy() };
    const next = sinon.spy();

    const tokenStub = sinon
      .stub(MessageUtils, "extractTokenFromHeaders")
      .returns("token");
    const alertsStub = sinon
      .stub(MessageUtils, "extractProperty")
      .returns(["alert1", "alert2"]);
    const messagesStub = sinon
      .stub(MessageUtils, "buildMessages")
      .returns(["message1", "message2"]);
    const postStub = sinon
      .stub(LineNotifyService, "postToLineServer")
      .resolves("success");

    await NotifyController.handleNotify(req, res, next);

    expect(tokenStub.calledOnce).to.be.true;
    expect(alertsStub.calledOnce).to.be.true;
    expect(messagesStub.calledOnce).to.be.true;
    expect(postStub.calledOnce).to.be.true;
    expect(res.send.calledWith("success")).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should handle empty alerts error", async () => {
    const req = { headers: { authorization: "Bearer token" }, body: {} };
    const res = { send: sinon.spy() };
    const next = sinon.spy();

    const tokenStub = sinon
      .stub(MessageUtils, "extractTokenFromHeaders")
      .returns("token");
    const alertsStub = sinon
      .stub(MessageUtils, "extractProperty")
      .returns(null);

    await NotifyController.handleNotify(req, res, next);

    expect(tokenStub.calledOnce).to.be.true;
    expect(alertsStub.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(ServerException))).to.be.true;
    expect(next.getCall(0).args[0].httpStatus).to.equal(HttpStatus.BAD_REQUEST);
    expect(next.getCall(0).args[0].message).to.equal(
      NotifyController.NO_ALERTS_ERROR
    );
  });

  it("should handle request with no token", async () => {
    const req = { headers: { authorization: "Bearer token" }, body: {} };
    const res = { send: sinon.spy() };
    const next = sinon.spy();

    const tokenStub = sinon
      .stub(MessageUtils, "extractTokenFromHeaders")
      .returns(null);

    await NotifyController.handleNotify(req, res, next);

    expect(tokenStub.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(ServerException))).to.be.true;
    expect(next.getCall(0).args[0].httpStatus).to.equal(
      HttpStatus.UNAUTHORIZED
    );
    expect(next.getCall(0).args[0].message).to.equal(
      NotifyController.NO_TOKEN_ERROR
    );
  });

  it("should handle empty messages", async () => {
    const req = {
      headers: { authorization: "Bearer token" },
      body: { alerts: ["alert1", "alert2"] },
    };
    const res = { send: sinon.spy() };
    const next = sinon.spy();

    const tokenStub = sinon
      .stub(MessageUtils, "extractTokenFromHeaders")
      .returns("token");
    const alertsStub = sinon
      .stub(MessageUtils, "extractProperty")
      .returns(["alert1", "alert2"]);
    const messagesStub = sinon.stub(MessageUtils, "buildMessages").returns([]);

    await NotifyController.handleNotify(req, res, next);

    expect(tokenStub.calledOnce).to.be.true;
    expect(alertsStub.calledOnce).to.be.true;
    expect(messagesStub.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(ServerException))).to.be.true;
    expect(next.getCall(0).args[0].httpStatus).to.equal(HttpStatus.BAD_REQUEST);
    expect(next.getCall(0).args[0].message).to.equal(
      NotifyController.NO_MESSAGES_ERROR
    );
  });

  it("should handle empty body", async () => {
    const req = {
      headers: { authorization: "Bearer token" },
      body: null,
    };
    const res = { send: sinon.spy() };
    const next = sinon.spy();

    const tokenStub = sinon
      .stub(MessageUtils, "extractTokenFromHeaders")
      .returns("token");

    await NotifyController.handleNotify(req, res, next);

    expect(tokenStub.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(ServerException))).to.be.true;
    expect(next.getCall(0).args[0].httpStatus).to.equal(HttpStatus.BAD_REQUEST);
    expect(next.getCall(0).args[0].message).to.equal(
      NotifyController.NO_ALERTS_ERROR
    );
  });
});
