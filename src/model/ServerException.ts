export default class ServerException extends Error {
  readonly httpStatus: number;
  readonly stack?: string;

  constructor(httpStatus: number, message: string, stack?: string) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
