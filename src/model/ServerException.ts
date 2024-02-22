export default class ServerException extends Error {
  httpStatus: number;
  stack: any;

  constructor(httpStatus: number, message: string, stack: any) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.stack = stack ? stack : this.stack;
  }
}
