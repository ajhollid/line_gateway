import TextUtils from "../utils/TextUtils.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log(TextUtils.buildBoldLog("Error: " + err.message));
  console.log(err.stack);
  res
    .status(err.httpStatus || 500)
    .json({ status: err.httpStatus, message: err.message, stack: err.stack });
};

export default errorHandler;
