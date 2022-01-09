import { Request, Response } from 'express';

import { IArticleSortOneUseCase } from '@domain/article/useCases/ArticleSortOneUseCase';
import { IArticleSortOneRequest } from '@domain/article/useCases/interfaces/IArticleSortOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class ArticleSortOneController extends BaseController {
  useCase: IArticleSortOneUseCase;

  constructor(useCase: IArticleSortOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE } = req.params;
    const { order } = req.body;

    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const articleSortOneRequest: IArticleSortOneRequest = {
      session,
      language,
      articleId: Number(articleId),
      order,
    };

    const response = await this.useCase.execute(articleSortOneRequest);

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
