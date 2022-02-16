import { Request, Response } from 'express';

import { IRssUpdateAllRequest } from '@domain/rss/useCases/interfaces/IRssUpdateAllRequest';
import { IRssUpdateAllUseCase } from '@domain/rss/useCases/RssUpdateAllUseCase';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { BaseController } from './BaseController';

export class RssUpdateAllController extends BaseController {
  useCase: IRssUpdateAllUseCase;

  constructor(useCase: IRssUpdateAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE, feed } = req.params;

    const rssUpdateAllRequest: IRssUpdateAllRequest = { feed, language };

    const response = await this.useCase.execute(rssUpdateAllRequest);

    return res.status(200).set('Content-Type', 'text/xml').send(response);
  }
}
