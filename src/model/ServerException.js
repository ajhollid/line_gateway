export default class ServerException {
  constructor(httpStatus, message) {
    this.httpStatus = httpStatus;
    this.message = message;
  }
}
