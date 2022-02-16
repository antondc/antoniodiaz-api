import express, { NextFunction, Request, Response } from 'express';

import { RssGetOneUseCase } from '@domain/rss/useCases/RssGetOneUseCase';
import { RssUpdateAllUseCase } from '@domain/rss/useCases/RssUpdateAllUseCase';
import { RssGetOneController } from '@infrastructure/http/controllers/RssGetOneController';
import { RssUpdateAllController } from '@infrastructure/http/controllers/RssUpdateAllController';
import { RssRepo } from '@infrastructure/persistence/fileSystem/repositories/rssRepo';

const RssRoute = express.Router({ mergeParams: true });

RssRoute.get('/:feed', async (req: Request, res: Response, next: NextFunction) => {
  const rssRepo = new RssRepo();
  const rssGetOneUseCase = new RssGetOneUseCase(rssRepo);
  const rssGetOneController = new RssGetOneController(rssGetOneUseCase);

  const response = await rssGetOneController.execute(req, res, next);

  return response;
});

RssRoute.post('/:feed', async (req: Request, res: Response, next: NextFunction) => {
  const rssRepo = new RssRepo();
  const rssUpdateAllUseCase = new RssUpdateAllUseCase(rssRepo);
  const rssUpdateAllController = new RssUpdateAllController(rssUpdateAllUseCase);

  const response = await rssUpdateAllController.execute(req, res, next);

  return response;
});

export { RssRoute };
