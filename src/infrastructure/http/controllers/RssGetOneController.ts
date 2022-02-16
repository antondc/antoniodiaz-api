import { Request, Response } from 'express';

import { IRssGetOneRequest } from '@domain/rss/useCases/interfaces/IRssGetOneRequest';
import { IRssGetOneUseCase } from '@domain/rss/useCases/RssGetOneUseCase';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class RssGetOneController extends BaseController {
  useCase: IRssGetOneUseCase;

  constructor(useCase: IRssGetOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE, feed } = req.params;

    const rssGetOneRequest: IRssGetOneRequest = {
      feed,
      language,
    };

    const response = await this.useCase.execute(rssGetOneRequest);

    return res.status(200).set('Content-Type', 'text/xml').send(response);
  }
}
