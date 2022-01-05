import { BaseError } from './BaseError';

export class NetWorkError extends BaseError {
  message: string;
  category: string;
  statusCode: number;
  error: Record<string, unknown>;

  constructor(message: string, statusCode: number, error?: Record<string, unknown>) {
    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
    this.category = 'Network Error';
    this.error = error;
    Object.setPrototypeOf(this, NetWorkError.prototype);
  }
}
