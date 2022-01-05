import { Request, Response } from 'express';

import { IArticleCreateOneUseCase } from '@domain/article/useCases/ArticleCreateOneUseCase';
import { IArticleCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleCreateOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class ArticleCreateOneController extends BaseController {
  useCase: IArticleCreateOneUseCase;

  constructor(useCase: IArticleCreateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE } = req.params;
    const { title, contentJson, contentHtml } = req.body;

    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const articleCreateRequest: IArticleCreateOneRequest = {
      language,
      session,
      title,
      contentJson,
      contentHtml,
    };

    const response = await this.useCase.execute(articleCreateRequest);

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
