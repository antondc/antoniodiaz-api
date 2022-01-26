import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { ILanguageUpdateOneRequest } from '@domain/language/useCases/interfaces/ILanguageUpdateOneRequest';
import { ILanguageUpdateOneUseCase } from '@domain/language/useCases/LanguageUpdateOneUseCase';
import { User } from '@domain/user/entities/User';
import { PATH_API_V1, SECRET, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class LanguageUpdateOneController extends BaseController {
  useCase: ILanguageUpdateOneUseCase;

  constructor(useCase: ILanguageUpdateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { slug } = req.params;
    const { glossary } = req.body;

    const tokenJWT = new TokenJWT(SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const languageUpdateRequest: ILanguageUpdateOneRequest = {
      session,
      slug,
      glossary,
    };

    const response = await this.useCase.execute(languageUpdateRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/languages/me',
      },
      data: {
        type: 'language',
        id: response?.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/languages' + response.id,
        },
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
