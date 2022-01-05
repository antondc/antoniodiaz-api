import { NextFunction, Request, Response } from 'express';

import { AuthenticationError } from '@root/src/shared/errors/AuthenticationError';
import { TokenService } from '@shared/services/TokenService';

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const regexTestMe = /\b(\/me)\b/i;
  const urlIncludesMe = regexTestMe.test(req.baseUrl);

  if (
    (req.method === 'GET' && !urlIncludesMe) || // All get are free except routes using "me"
    (req.method === 'POST' && req.baseUrl === '/api/v1/login') || // Allow login
    (req.method === 'DELETE' && req.baseUrl === '/api/v1/login') || // Allow logout for users with corrupted cookies
    (req.method === 'PUT' && req.baseUrl === '/api/v1/login') || // Allow forgot password request
    (req.method === 'PATCH' && req.baseUrl === '/api/v1/login') || // Allow reset password request
    (req.method === 'POST' && req.baseUrl === '/api/v1/users') || // Allow user creation
    (req.method === 'POST' && req.baseUrl === '/api/v1/users/sign-up-confirmation') // Allow user creation confirmation
  ) {
    return next();
  }

  const tokenService = new TokenService();
  const sessionTokenDecoded = tokenService.decodeToken(req.cookies.sessionToken);

  if (!sessionTokenDecoded) throw new AuthenticationError('401 Unauthorized', 401);

  return next();
};
