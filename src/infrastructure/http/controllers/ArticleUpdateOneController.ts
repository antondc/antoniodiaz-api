import { Request, Response } from 'express';

import { IArticleUpdateOneUseCase } from '@domain/article/useCases/ArticleUpdateOneUseCase';
import { IArticleUpdateOneRequest } from '@domain/article/useCases/interfaces/IArticleUpdateOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class ArticleUpdateOneController extends BaseController {
  useCase: IArticleUpdateOneUseCase;

  constructor(useCase: IArticleUpdateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE } = req.params;
    const { title, content_json, content_html } = req.body;

    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const articleUpdateRequest: IArticleUpdateOneRequest = {
      session,
      articleId: Number(articleId),
      language,
      title,
      content_json,
      content_html,
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
