import { TokenJWT } from '@antoniodcorrea/utils-backend';
import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IXmlSitemapGetAllRequest } from '@domain/xml/useCases/interfaces/IXmlSitemapGetAllRequest';
import { IXmlSitemapGetAllUseCase } from '@domain/xml/useCases/XmlSitemapGetAllUseCase';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class XmlSitemapGetAllController extends BaseController {
  useCase: IXmlSitemapGetAllUseCase;

  constructor(useCase: IXmlSitemapGetAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { languageSlug = DEFAULT_LANGUAGE_SLUG } = req.params;
    const tokenJWT = new TokenJWT(JWT_SECRET);

    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const rssBlogGetAllRequest: IXmlSitemapGetAllRequest = { session, language: languageSlug };

    const response = await this.useCase.execute(rssBlogGetAllRequest);

    return res.status(200).set('Content-Type', 'text/xml').send(response);
  }
}
