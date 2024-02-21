export default class ServerException extends Error {
  constructor(httpStatus, message) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
  }
}
