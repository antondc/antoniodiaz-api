import express, { NextFunction, Request, Response } from 'express';

import { RssGetOneUseCase } from '@domain/rss/useCases/RssGetOneUseCase';
import { RssGetOneController } from '@infrastructure/http/controllers/RssGetOneController';
import { RssRepo } from '@infrastructure/persistence/fileSystem/repositories/rssRepo';

const RssRoute = express.Router({ mergeParams: true });

RssRoute.get('/:feed', async (req: Request, res: Response, next: NextFunction) => {
  const rssRepo = new RssRepo();
  const rssGetOneUseCase = new RssGetOneUseCase(rssRepo);
  const rssGetOneController = new RssGetOneController(rssGetOneUseCase);

  const response = await rssGetOneController.execute(req, res, next);

  return response;
});

export { RssRoute };
