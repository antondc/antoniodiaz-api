import { TokenJWT } from '@antoniodcorrea/utils-backend';
import { Request, Response } from 'express';

import { IArticleUpdateOneUseCase } from '@domain/article/useCases/ArticleUpdateOneUseCase';
import { IArticleUpdateOneRequest } from '@domain/article/useCases/interfaces/IArticleUpdateOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ArticleUpdateOneController extends BaseController {
  useCase: IArticleUpdateOneUseCase;

  constructor(useCase: IArticleUpdateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE_SLUG } = req.params;
    const { title, contentJson, published, ogImage } = req.body;

    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const articleUpdateRequest: IArticleUpdateOneRequest = {
      articleId: Number(articleId),
      language,
      session,
      title,
      contentJson,
      published,
      ogImage,
    };

    const response = await this.useCase.execute(articleUpdateRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/articles/me',
      },
      data: {
        type: 'article',
        id: response?.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/articles' + response.id,
        },
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
