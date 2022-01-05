import { AuthenticationError } from '@root/src/shared/errors/AuthenticationError';
import { BaseError } from '@root/src/shared/errors/BaseError';
import { NetWorkError } from '@root/src/shared/errors/NetworkError';
import { RequestError } from '@root/src/shared/errors/RequestError';
import { LOGGING } from '@shared/constants/env';

export const ErrorHandlerMiddleware = (err, req, res, next) => {
  const isCustomError = err instanceof BaseError || err instanceof NetWorkError || err instanceof RequestError;
  const isAuthenticationError = err instanceof AuthenticationError;

  if (err && isAuthenticationError)
    return res
      .clearCookie('sessionToken', { path: '/' })
      .status(err.statusCode)
      .send(LOGGING ? { error: err } : err.message)
      .end();

  if (err && isCustomError) return res.status(err.statusCode).send({ error: err });
  if (err && LOGGING) return res.status(err.statusCode || 500).send({ error: { message: err?.message, stack: err?.stack } });
  if (err) return res.status(500).send('500 Internal Server Error');

  return next();
};
