import { Request, Response } from 'express';

import { IArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE_SIZE } from '@shared/constants/constants';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

const DEFAULT_USER_GET_ALL_SORT = '-createdAt';

type ArticleGetAllControllerQueryType = {
  sort?: 'order' | '-order' | 'createdAt' | '-createdAt' | 'updatedAt' | '-updatedAt';
  page: {
    size: string;
    offset: string;
  };
  filter?: {
    tags?: string[];
  };
};

export class ArticleGetAllController extends BaseController {
  useCase: IArticleGetAllUseCase;

  constructor(useCase: IArticleGetAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE } = req.params;
    const { sort = DEFAULT_USER_GET_ALL_SORT, page: { size, offset } = {}, filter: { tags } = {} } = req.query as ArticleGetAllControllerQueryType;

    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);
    const castedSort = sort || undefined;
    const castedSize = Number(size) || DEFAULT_PAGE_SIZE;
    const castedOffset = Number(offset) || undefined;

    const { articles, meta } = await this.useCase.execute({
      session,
      language,
      sort: castedSort,
      size: castedSize,
      offset: castedOffset,
      filter: {
        tags,
      },
    });

    const formattedArticles = articles.map((item) => {
      return {
        type: 'article',
        id: item.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/articles/' + item.id,
        },
        attributes: {
          ...item,
        },
      };
    });

    const formattedResponse = {
      meta,
      links: {
        self: URL_SERVER + PATH_API_V1 + req.originalUrl,
      },
      data: formattedArticles,
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
