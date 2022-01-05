import { Request, Response } from 'express';

import { IArticleDeleteOneUseCase } from '@domain/article/useCases/ArticleDeleteOneUseCase';
import { IArticleDeleteOneRequest } from '@domain/article/useCases/interfaces/IArticleDeleteOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class ArticleDeleteOneController extends BaseController {
  useCase: IArticleDeleteOneUseCase;

  constructor(useCase: IArticleDeleteOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE } = req.params;
    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const articleDeleteOneRequest: IArticleDeleteOneRequest = {
      session,
      language,
      articleId: Number(articleId),
    };

    const response = await this.useCase.execute(articleDeleteOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/articles/' + response?.articleId,
      },
      data: [
        {
          type: 'article',
          id: response?.articleId,
          session: {
            self: URL_SERVER + PATH_API_V1 + '/articles/' + response?.articleId,
          },
          attributes: response,
          relationships: {},
        },
      ],
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
