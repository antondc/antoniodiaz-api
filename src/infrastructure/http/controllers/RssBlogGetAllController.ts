import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IRssBlogGetAllRequest } from '@domain/rss/useCases/interfaces/IRssBlogGetAllRequest';
import { IRssBlogGetAllUseCase } from '@domain/rss/useCases/RssBlogGetAllUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { SECRET_JWT } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class RssBlogGetAllController extends BaseController {
  useCase: IRssBlogGetAllUseCase;

  constructor(useCase: IRssBlogGetAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE } = req.params;
    const tokenJWT = new TokenJWT(SECRET_JWT);

    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const rssBlogGetAllRequest: IRssBlogGetAllRequest = { session, language };

    const response = await this.useCase.execute(rssBlogGetAllRequest);

    return res.status(200).set('Content-Type', 'text/xml').send(response);
  }
}
