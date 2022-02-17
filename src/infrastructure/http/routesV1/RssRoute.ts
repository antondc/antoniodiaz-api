import express, { NextFunction, Request, Response } from 'express';

import { ArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { LanguageGetOneUseCase } from '@domain/language/useCases/LanguageGetOneUseCase';
import { RssBlogGetAllUseCase } from '@domain/rss/useCases/RssBlogGetAllUseCase';
import { RssBlogGetAllController } from '@infrastructure/http/controllers/RssBlogGetAllController';
import { ArticleRepo } from '@infrastructure/persistence/mySQL/repositories/ArticleRepo';
import { LanguageRepo } from '@infrastructure/persistence/mySQL/repositories/LanguageRepo';

const RssRoute = express.Router({ mergeParams: true });

RssRoute.get('/blog', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const languageRepo = new LanguageRepo();
  const languageGetOneUseCase = new LanguageGetOneUseCase(languageRepo);
  const articleGetAllUseCase = new ArticleGetAllUseCase(articleRepo);
  const rssBlogGetOneUseCase = new RssBlogGetAllUseCase(articleGetAllUseCase, languageGetOneUseCase);
  const rssBlogGetOneController = new RssBlogGetAllController(rssBlogGetOneUseCase);

  const response = await rssBlogGetOneController.execute(req, res, next);

  return response;
});

export { RssRoute };
