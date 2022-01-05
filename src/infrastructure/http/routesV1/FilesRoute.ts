import express, { NextFunction, Request, Response } from 'express';

import { FileUploadOneUseCase } from '@domain/file/useCases/FileUploadOneUseCase';
import { FileUploadOneController } from '@infrastructure/http/controllers/FileUploadOneController';
import { FileHandler } from '@infrastructure/http/middlewares/FileHandler';
import { FileRepo } from '@infrastructure/persistence/fileSystem/repositories/FileRepo';

const FilesRoute = express.Router({ mergeParams: true });

FilesRoute.post('/upload/single', FileHandler.handleSingleFile(), FileHandler.wrapSingleFile, async (req: Request, res: Response, next: NextFunction) => {
  const fileRepo = new FileRepo();

  const fileUploadOneUseCase = new FileUploadOneUseCase(fileRepo);
  const fileUploadOneController = new FileUploadOneController(fileUploadOneUseCase);

  const response = await fileUploadOneController.execute(req, res, next);

  return response;
});

export { FilesRoute };
