import { BaseError } from './BaseError';

export class RequestError extends BaseError {
  message: string;
  category: string;
  statusCode: number;
  error: Record<string, unknown>;

  constructor(message: string, statusCode: number, error?: Record<string, unknown>) {
    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
    this.category = 'Request Error';
    this.error = error;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
