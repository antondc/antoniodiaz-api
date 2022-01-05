import express, { NextFunction, Request, Response } from 'express'; // eslint-disable-line @typescript-eslint/no-unused-vars

import { UserForgotPasswordUseCase } from '@domain/user/useCases/UserForgotPasswordUseCase';
import { UserLoginUseCase } from '@domain/user/useCases/UserLoginUseCase';
import { UserLogOutUseCase } from '@domain/user/useCases/UserLogOutUseCase';
import { UserResetPasswordUseCase } from '@domain/user/useCases/UserResetPasswordUseCase';
import { UserForgotPasswordController } from '@infrastructure/http/controllers/UserForgotPasswordController';
import { UserLoginController } from '@infrastructure/http/controllers/UserLoginController';
import { UserLogOutController } from '@infrastructure/http/controllers/UserLogOutController';
import { UserResetPasswordController } from '@infrastructure/http/controllers/UserResetPasswordController';
import { UserRepo } from '@infrastructure/persistence/mySQL/repositories/UserRepo';

const LoginRoute = express.Router({ mergeParams: true });

LoginRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userLoginUseCase = new UserLoginUseCase(userRepo);
  const userLoginController = new UserLoginController(userLoginUseCase);

  const response = await userLoginController.execute(req, res, next);

  return response;
});

LoginRoute.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userLogOutUseCase = new UserLogOutUseCase(userRepo);
  const userLogOutController = new UserLogOutController(userLogOutUseCase);

  const response = await userLogOutController.execute(req, res, next);

  return response;
});

LoginRoute.put('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userForgotPasswordUseCase = new UserForgotPasswordUseCase(userRepo);
  const userForgotPasswordController = new UserForgotPasswordController(userForgotPasswordUseCase);

  const response = await userForgotPasswordController.execute(req, res, next);

  return response;
});

LoginRoute.patch('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userResetPasswordUseCase = new UserResetPasswordUseCase(userRepo);
  const userResetPasswordController = new UserResetPasswordController(userResetPasswordUseCase);

  const response = await userResetPasswordController.execute(req, res, next);

  return response;
});

export { LoginRoute };
