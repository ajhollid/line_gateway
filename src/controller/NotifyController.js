import TextUtils from "../utils/TextUtils.js";
import MessageUtils from "../utils/MessageUtils.js";
import ServerException from "../model/ServerException.js";
import HttpStatus from "http-status-codes";
import LineNotifyService from "../service/LineNotifyService.js";
import Config from "../config/Config.js";

const NO_TOKEN_ERROR = "No token supplied, request not sent";
const NO_ALERTS_ERROR = "No alerts found, request not sent";
const NO_MESSAGES_ERROR = "No messages found, request not sent";

const getToken = (req) => {
  if (req && req.headers) {
    return MessageUtils.extractTokenFromHeaders(req);
  } else if (Config.DEFAULT_LINE_TOKEN) {
    return process.env.DEFAULT_LINE_TOKEN;
  } else {
    return null;
  }
};

const handleNotify = async (req, res, next) => {
  // ********************
  // Log alert received
  // ********************
  const time = new Date();
  console.log(
    TextUtils.buildBoldLog("Alert received at: " + time.toLocaleString())
  );
  console.log(JSON.stringify(req.body, null, 2));

  // ********************
  // Try to get token from headers, if not present, look for default token
  // If no token supplied, send an error
  // ********************
  const token = getToken(req);

  if (!token) {
    next(new ServerException(HttpStatus.UNAUTHORIZED, NO_TOKEN_ERROR));
    return;
  }

  // ********************
  // Build message for LINE server
  // ********************
  const alerts = MessageUtils.extractProperty(req.body, "alerts");
  if (!alerts) {
    next(new ServerException(HttpStatus.BAD_REQUEST, NO_ALERTS_ERROR));
    return;
  }

  let messages = MessageUtils.buildMessages(alerts);
  if (messages.length <= 0) {
    next(new ServerException(HttpStatus.BAD_REQUEST, NO_MESSAGES_ERROR));
    return;
  }

  try {
    const results = await LineNotifyService.postToLineServer(messages, token);
    res.send(results);
  } catch (err) {
    next(new ServerException(HttpStatus.INTERNAL_SERVER_ERROR, err, err.stack));
  }
};

export default {
  handleNotify,
  NO_ALERTS_ERROR,
  NO_TOKEN_ERROR,
  NO_MESSAGES_ERROR,
};
