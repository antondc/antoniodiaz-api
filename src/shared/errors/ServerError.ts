import { BaseError } from './BaseError';

export class ServerError extends BaseError {
  message: string;
  category: string;
  statusCode: number;
  error: Record<string, unknown>;

  constructor(message: string, statusCode: number, error?: Record<string, unknown>) {
    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
    this.category = 'Server Error';
    this.error = error;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
