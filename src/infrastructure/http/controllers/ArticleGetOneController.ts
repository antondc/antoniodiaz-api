import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IArticleGetOneUseCase } from '@domain/article/useCases/ArticleGetOneUseCase';
import { IArticleGetOneRequest } from '@domain/article/useCases/interfaces/IArticleGetOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ArticleGetOneController extends BaseController {
  useCase: IArticleGetOneUseCase;

  constructor(useCase: IArticleGetOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE_SLUG } = req.params;

    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const articleGetOneRequest: IArticleGetOneRequest = {
      language,
      articleId: Number(articleId),
      session,
    };

    const response = await this.useCase.execute(articleGetOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/articles/' + articleId,
      },
      data: {
        type: 'article',
        session: {
          self: URL_SERVER + PATH_API_V1 + '/articles/' + articleId,
        },
        id: response?.id,
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
