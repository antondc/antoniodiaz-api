import { BaseError } from './BaseError';

export class UserError extends BaseError {
  message: string;
  category: string;
  statusCode: number;
  field: string;
  error: Record<string, unknown>;

  constructor(message: string, statusCode: number, field?: string, error?: Record<string, unknown>) {
    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
    this.category = 'User Error';
    this.field = field;
    this.error = error;
    Object.setPrototypeOf(this, UserError.prototype);
  }
}
