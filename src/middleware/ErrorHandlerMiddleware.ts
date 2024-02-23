import ServerException from "../model/ServerException.js";
import TextUtils from "../utils/TextUtils.js";
import { Response, Request, NextFunction } from "express";
import HttpStatus from "http-status-codes";

// eslint-disable-next-line no-unused-vars
const errorHandler = (
  err: Error | ServerException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(TextUtils.buildBoldLog("Error: " + err.message));
  err.stack && console.log(err.stack);

  if (err instanceof ServerException) {
    res
      .status(err.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: err.httpStatus, message: err.message, stack: err.stack });
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
      stack: err.stack,
    });
  }
};

export default errorHandler;
