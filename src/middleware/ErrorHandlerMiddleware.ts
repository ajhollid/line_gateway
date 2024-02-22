import ServerException from "../model/ServerException.js";
import TextUtils from "../utils/TextUtils.js";
import { Response, Request, NextFunction } from "express";

// eslint-disable-next-line no-unused-vars
const errorHandler = (
  err: ServerException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(TextUtils.buildBoldLog("Error: " + err.message));
  err.stack && console.log(err.stack);
  res
    .status(err.httpStatus || 500)
    .json({ status: err.httpStatus, message: err.message, stack: err.stack });
};

export default errorHandler;
