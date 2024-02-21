export default class ServerException extends Error {
  constructor(httpStatus, message, stack) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.stack = stack ? stack : this.stack;
  }
}
