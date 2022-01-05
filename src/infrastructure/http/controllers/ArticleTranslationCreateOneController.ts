import { Request, Response } from 'express';

import { IArticleTranslationCreateOneUseCase } from '@domain/article/useCases/ArticleTranslationCreateOneUseCase';
import { IArticleTranslationCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleTranslationCreateOneRequest';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class ArticleTranslationCreateOneController extends BaseController {
  useCase: IArticleTranslationCreateOneUseCase;

  constructor(useCase: IArticleTranslationCreateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { articleId, language = DEFAULT_LANGUAGE } = req.params;
    const { title, content_json, content_html } = req.body;

    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const articleTranslationCreateRequest: IArticleTranslationCreateOneRequest = {
      articleId: Number(articleId),
      language,
      session,
      title,
      content_json,
      content_html,
    };

    const response = await this.useCase.execute(articleTranslationCreateRequest);

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
