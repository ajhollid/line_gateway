import ServerException from "../model/ServerException.js";
import HttpStatus from "http-status-codes";

const getHealth = (req, res, next) => {
  let uptime = new Date(Math.floor(process.uptime()) * 1000)
    .toISOString()
    .substring(11, 19);
  uptime = uptime.substring(0, 2) + "h" + uptime.substring(2);
  uptime = uptime.substring(0, 6) + "m" + uptime.substring(6);
  uptime = uptime.substring(0, 12) + "s" + uptime.substring(12);

  const healthCheck = {
    uptime,
    message: "OK",
    timestamp: new Date(Date.now()).toLocaleString(),
  };
  try {
    res.send(healthCheck);
  } catch (err) {
    healthCheck.message = err;
    next(new ServerException(HttpStatus.INTERNAL_SERVER_ERROR, err));
  }
};

export default { getHealth };
