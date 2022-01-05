import { BaseError } from './BaseError';

export class AuthenticationError extends BaseError {
  message: string;
  category: string;
  statusCode: number;
  field: string;
  error: Record<string, unknown>;

  constructor(message: string, statusCode: number, field?: string, error?: Record<string, unknown>) {
    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
    this.category = 'Authentication Error';
    this.field = field;
    this.error = error;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
