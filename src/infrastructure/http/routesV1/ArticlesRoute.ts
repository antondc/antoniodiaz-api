import express, { NextFunction, Request, Response } from 'express';

import { ArticleCreateOneUseCase } from '@domain/article/useCases/ArticleCreateOneUseCase';
import { ArticleDeleteOneUseCase } from '@domain/article/useCases/ArticleDeleteOneUseCase';
import { ArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { ArticleGetOneUseCase } from '@domain/article/useCases/ArticleGetOneUseCase';
import { ArticleUpdateOneUseCase } from '@domain/article/useCases/ArticleUpdateOneUseCase';
import { ArticleCreateOneController } from '@infrastructure/http/controllers/ArticleCreateOneController';
import { ArticleDeleteOneController } from '@infrastructure/http/controllers/ArticleDeleteOneController';
import { ArticleGetAllController } from '@infrastructure/http/controllers/ArticleGetAllController';
import { ArticleGetOneController } from '@infrastructure/http/controllers/ArticleGetOneController';
import { ArticleRepo } from '@infrastructure/persistence/mySQL/repositories/ArticleRepo';
import { ArticleUpdateOneController } from '../controllers/ArticleUpdateOneController';

const ArticlesRoute = express.Router({ mergeParams: true });

ArticlesRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const articleGetAllUseCase = new ArticleGetAllUseCase(articleRepo);
  const articleGetAllController = new ArticleGetAllController(articleGetAllUseCase);

  const response = await articleGetAllController.execute(req, res, next);

  return response;
});

ArticlesRoute.get('/:articleId', async (req: Request & { language: string }, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const articleGetOneUseCase = new ArticleGetOneUseCase(articleRepo);
  const articleGetOneController = new ArticleGetOneController(articleGetOneUseCase);

  const response = await articleGetOneController.execute(req, res, next);

  return response;
});

ArticlesRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const articleGetOneUseCase = new ArticleGetOneUseCase(articleRepo);
  const articleCreateOneUseCase = new ArticleCreateOneUseCase(articleRepo, articleGetOneUseCase);
  const articleCreateOneController = new ArticleCreateOneController(articleCreateOneUseCase);

  const response = await articleCreateOneController.execute(req, res, next);

  return response;
});

ArticlesRoute.put('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const articleGetOneUseCase = new ArticleGetOneUseCase(articleRepo);
  const articleUpdateOneUseCase = new ArticleUpdateOneUseCase(articleRepo, articleGetOneUseCase);
  const articleUpdateOneController = new ArticleUpdateOneController(articleUpdateOneUseCase);

  const response = await articleUpdateOneController.execute(req, res, next);

  return response;
});

ArticlesRoute.delete('/:articleId', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const articleDeleteOneUseCase = new ArticleDeleteOneUseCase(articleRepo);
  const articleDeleteOneController = new ArticleDeleteOneController(articleDeleteOneUseCase);

  const response = await articleDeleteOneController.execute(req, res, next);

  return response;
});

export { ArticlesRoute };
