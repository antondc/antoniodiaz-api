import express, { NextFunction, Request, Response } from 'express';

import { FileDeleteOneUseCase } from '@domain/file/useCases/FileDeleteOneUseCase';
import { FileUploadOneUseCase } from '@domain/file/useCases/FileUploadOneUseCase';
import { FileUploadOneController } from '@infrastructure/http/controllers/FileUploadOneController';
import { FileHandler } from '@infrastructure/http/middlewares/FileHandler';
import { FileRepo } from '@infrastructure/persistence/fileSystem/repositories/FileRepo';
import { FileDeleteOneController } from '../controllers/FileDeleteOneController';

const FilesRoute = express.Router({ mergeParams: true });

FilesRoute.post('/single', FileHandler.handleSingleFile(), FileHandler.wrapSingleFile, async (req: Request, res: Response, next: NextFunction) => {
  const fileRepo = new FileRepo();

  const fileUploadOneUseCase = new FileUploadOneUseCase(fileRepo);
  const fileUploadOneController = new FileUploadOneController(fileUploadOneUseCase);

  const response = await fileUploadOneController.execute(req, res, next);

  return response;
});

FilesRoute.delete('/single', FileHandler.handleSingleFile(), async (req: Request, res: Response, next: NextFunction) => {
  const fileRepo = new FileRepo();

  const fileDeleteOneUseCase = new FileDeleteOneUseCase(fileRepo);
  const fileDeleteOneController = new FileDeleteOneController(fileDeleteOneUseCase);

  const response = await fileDeleteOneController.execute(req, res, next);

  return response;
});

export { FilesRoute };
