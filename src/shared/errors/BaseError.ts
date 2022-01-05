export class BaseError extends Error {
  message: string;
  statusCode: number;
  category: string;
  error: Record<string, unknown> | undefined;

  constructor(message: string, statusCode: number, error?: Record<string, unknown>) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
