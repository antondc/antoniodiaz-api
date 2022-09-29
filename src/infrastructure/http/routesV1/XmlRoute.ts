import express, { NextFunction, Request, Response } from 'express';

import { ArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { LanguageGetAllUseCase } from '@domain/language/useCases/LanguageGetAllUseCase';
import { LanguageGetOneUseCase } from '@domain/language/useCases/LanguageGetOneUseCase';
import { XmlRssGetAllUseCase } from '@domain/xml/useCases/XmlRssGetAllUseCase';
import { XmlSitemapGetAllUseCase } from '@domain/xml/useCases/XmlSitemapGetAllUseCase';
import { XmlRssGetAllController } from '@infrastructure/http/controllers/XmlRssGetAllController';
import { XmlSitemapGetAllController } from '@infrastructure/http/controllers/XmlSitemapGetAllController copy';
import { ArticleRepo } from '@infrastructure/persistence/mySQL/repositories/ArticleRepo';
import { LanguageRepo } from '@infrastructure/persistence/mySQL/repositories/LanguageRepo';

const XmlRoute = express.Router({ mergeParams: true });

XmlRoute.get('/rss', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const languageRepo = new LanguageRepo();
  const languageGetOneUseCase = new LanguageGetOneUseCase(languageRepo);
  const articleGetAllUseCase = new ArticleGetAllUseCase(articleRepo);
  const xmlRssgGetOneUseCase = new XmlRssGetAllUseCase(articleGetAllUseCase, languageGetOneUseCase);
  const xmlRssgGetOneController = new XmlRssGetAllController(xmlRssgGetOneUseCase);

  const response = await xmlRssgGetOneController.execute(req, res, next);

  return response;
});

XmlRoute.get('/sitemap', async (req: Request, res: Response, next: NextFunction) => {
  const articleRepo = new ArticleRepo();
  const languageRepo = new LanguageRepo();
  const languageGetAllUseCase = new LanguageGetAllUseCase(languageRepo);
  const articleGetAllUseCase = new ArticleGetAllUseCase(articleRepo);
  const xmlSitemapGetOneUseCase = new XmlSitemapGetAllUseCase(articleGetAllUseCase, languageGetAllUseCase);
  const xmlSitemapGetOneController = new XmlSitemapGetAllController(xmlSitemapGetOneUseCase);

  const response = await xmlSitemapGetOneController.execute(req, res, next);

  return response;
});

export { XmlRoute };
