import { TokenJWT } from '@antoniodcorrea/utils-backend';
import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IXmlRssGetAllRequest } from '@domain/xml/useCases/interfaces/IXmlRssGetAllRequest';
import { IXmlRssGetAllUseCase } from '@domain/xml/useCases/XmlRssGetAllUseCase';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class XmlRssGetAllController extends BaseController {
  useCase: IXmlRssGetAllUseCase;

  constructor(useCase: IXmlRssGetAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE_SLUG } = req.params;
    const tokenJWT = new TokenJWT(JWT_SECRET);

    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const rssBlogGetAllRequest: IXmlRssGetAllRequest = { session, language };

    const response = await this.useCase.execute(rssBlogGetAllRequest);

    return res.status(200).set('Content-Type', 'text/xml').send(response);
  }
}
