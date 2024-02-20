// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res
    .status(err.httpStatus || 500)
    .json({ status: err.httpStatus, message: err.message });
};

export default errorHandler;
