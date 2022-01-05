import express, { NextFunction, Request, Response } from 'express';

import { UserCreateConfirmationUseCase } from '@domain/user/useCases/UserCreateConfirmationUseCase';
import { UserCreateOneUseCase } from '@domain/user/useCases/UserCreateOneUseCase';
import { UserDeleteOneUseCase } from '@domain/user/useCases/UserDeleteOneUseCase';
import { UserGetAllUseCase } from '@domain/user/useCases/UserGetAllUseCase';
import { UserGetByIdsUseCase } from '@domain/user/useCases/UserGetByIdsUseCase';
import { UserGetOneUseCase } from '@domain/user/useCases/UserGetOneUseCase';
import { UserUpdateOneUseCase } from '@domain/user/useCases/UserUpdateOneUseCase';
import { UserCreateConfirmationController } from '@infrastructure/http/controllers/UserCreateConfirmationController';
import { UserCreateOneController } from '@infrastructure/http/controllers/UserCreateOneController';
import { UserDeleteOneController } from '@infrastructure/http/controllers/UserDeleteOneController';
import { UserGetAllController } from '@infrastructure/http/controllers/UserGetAllController';
import { UserGetByIdsController } from '@infrastructure/http/controllers/UserGetByIdsController';
import { UserGetOneController } from '@infrastructure/http/controllers/UserGetOneController';
import { UserUpdateOneController } from '@infrastructure/http/controllers/UserUpdateOneController';
import { FileRepo } from '@infrastructure/persistence/fileSystem/repositories/FileRepo';
import { UserRepo } from '@infrastructure/persistence/mySQL/repositories/UserRepo';

const UsersRoute = express.Router({ mergeParams: true });

UsersRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userGetAllUseCase = new UserGetAllUseCase(userRepo);
  const userGetAllController = new UserGetAllController(userGetAllUseCase);

  const response = await userGetAllController.execute(req, res, next);

  return response;
});

UsersRoute.get('/ids', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userGetByIdsUseCase = new UserGetByIdsUseCase(userRepo);
  const userGetByIdsController = new UserGetByIdsController(userGetByIdsUseCase);

  const response = await userGetByIdsController.execute(req, res, next);

  return response;
});

UsersRoute.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userGetOneUseCase = new UserGetOneUseCase(userRepo);
  const userGetOneController = new UserGetOneController(userGetOneUseCase);

  const response = await userGetOneController.execute(req, res, next);

  return response;
});

UsersRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userCreateOneUseCase = new UserCreateOneUseCase(userRepo);
  const userCreateOneController = new UserCreateOneController(userCreateOneUseCase);

  const response = await userCreateOneController.execute(req, res, next);

  return response;
});

UsersRoute.post('/sign-up-confirmation', async (req: Request, res: Response, next: NextFunction) => {
  const userRepo = new UserRepo();
  const userCreateConfirmationUseCase = new UserCreateConfirmationUseCase(userRepo);
  const userCreateConfirmatioController = new UserCreateConfirmationController(userCreateConfirmationUseCase);

  const response = await userCreateConfirmatioController.execute(req, res, next);

  return response;
});

UsersRoute.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  const fileRepo = new FileRepo();
  const userRepo = new UserRepo();
  const userUpdateOneUseCase = new UserUpdateOneUseCase(userRepo, fileRepo);
  const userUpdateOneController = new UserUpdateOneController(userUpdateOneUseCase);

  const response = await userUpdateOneController.execute(req, res, next);

  return response;
});

UsersRoute.delete('/me', async (req: Request, res: Response, next: NextFunction) => {
  const fileRepo = new FileRepo();
  const userRepo = new UserRepo();
  const userDeleteOneUseCase = new UserDeleteOneUseCase(userRepo, fileRepo);
  const userDeleteOneController = new UserDeleteOneController(userDeleteOneUseCase);

  const response = await userDeleteOneController.execute(req, res, next);

  return response;
});

export { UsersRoute };
