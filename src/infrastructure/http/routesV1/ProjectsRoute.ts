import express, { NextFunction, Request, Response } from 'express';

import { ProjectCreateOneUseCase } from '@domain/project/useCases/ProjectCreateOneUseCase';
import { ProjectDeleteOneUseCase } from '@domain/project/useCases/ProjectDeleteOneUseCase';
import { ProjectGetAllUseCase } from '@domain/project/useCases/ProjectGetAllUseCase';
import { ProjectGetOneUseCase } from '@domain/project/useCases/ProjectGetOneUseCase';
import { ProjectSortOneUseCase } from '@domain/project/useCases/ProjectSortOneUseCase';
import { ProjectUpdateOneUseCase } from '@domain/project/useCases/ProjectUpdateOneUseCase';
import { ProjectCreateOneController } from '@infrastructure/http/controllers/ProjectCreateOneController';
import { ProjectDeleteOneController } from '@infrastructure/http/controllers/ProjectDeleteOneController';
import { ProjectGetAllController } from '@infrastructure/http/controllers/ProjectGetAllController';
import { ProjectGetOneController } from '@infrastructure/http/controllers/ProjectGetOneController';
import { ProjectSortOneController } from '@infrastructure/http/controllers/ProjectSortOneController';
import { ProjectUpdateOneController } from '@infrastructure/http/controllers/ProjectUpdateOneController';
import { FileRepo } from '@infrastructure/persistence/fileSystem/repositories/FileRepo';
import { ProjectRepo } from '@infrastructure/persistence/mySQL/repositories/ProjectRepo';

const ProjectsRoute = express.Router({ mergeParams: true });

ProjectsRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const projectGetAllUseCase = new ProjectGetAllUseCase(projectRepo);
  const projectGetAllController = new ProjectGetAllController(projectGetAllUseCase);

  const response = await projectGetAllController.execute(req, res, next);

  return response;
});

ProjectsRoute.get('/:projectId', async (req: Request & { language: string }, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const projectGetOneUseCase = new ProjectGetOneUseCase(projectRepo);
  const projectGetOneController = new ProjectGetOneController(projectGetOneUseCase);

  const response = await projectGetOneController.execute(req, res, next);

  return response;
});

ProjectsRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const fileRepo = new FileRepo();
  const projectGetOneUseCase = new ProjectGetOneUseCase(projectRepo);
  const projectCreateOneUseCase = new ProjectCreateOneUseCase(projectRepo, fileRepo, projectGetOneUseCase);
  const projectCreateOneController = new ProjectCreateOneController(projectCreateOneUseCase);

  const response = await projectCreateOneController.execute(req, res, next);

  return response;
});

ProjectsRoute.put('/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const fileRepo = new FileRepo();
  const projectGetOneUseCase = new ProjectGetOneUseCase(projectRepo);
  const projectUpdateOneUseCase = new ProjectUpdateOneUseCase(projectRepo, fileRepo, projectGetOneUseCase);
  const projectUpdateOneController = new ProjectUpdateOneController(projectUpdateOneUseCase);

  const response = await projectUpdateOneController.execute(req, res, next);

  return response;
});

ProjectsRoute.patch('/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const projectGetOneUseCase = new ProjectGetOneUseCase(projectRepo);
  const projectSortOneUseCase = new ProjectSortOneUseCase(projectRepo, projectGetOneUseCase);
  const projectSortOneController = new ProjectSortOneController(projectSortOneUseCase);

  const response = await projectSortOneController.execute(req, res, next);

  return response;
});

ProjectsRoute.delete('/:projectId', async (req: Request, res: Response, next: NextFunction) => {
  const projectRepo = new ProjectRepo();
  const projectDeleteOneUseCase = new ProjectDeleteOneUseCase(projectRepo);
  const projectDeleteOneController = new ProjectDeleteOneController(projectDeleteOneUseCase);

  const response = await projectDeleteOneController.execute(req, res, next);

  return response;
});

export { ProjectsRoute };
