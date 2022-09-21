import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectGetAllUseCase } from '@domain/project/useCases/ProjectGetAllUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE_SIZE } from '@shared/constants/constants';
import { PATH_API_V1, SECRET_JWT, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

const DEFAULT_ARTICLE_GET_ALL_SORT = 'order';

type ProjectGetAllControllerQueryType = {
  sort?: 'order' | '-order' | 'createdAt' | '-createdAt' | 'updatedAt' | '-updatedAt';
  page: {
    size: string;
    offset: string;
  };
  filter?: {
    tags?: string[];
  };
};

export class ProjectGetAllController extends BaseController {
  useCase: IProjectGetAllUseCase;

  constructor(useCase: IProjectGetAllUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE } = req.params;
    const { sort = DEFAULT_ARTICLE_GET_ALL_SORT, page: { size, offset } = {}, filter: { tags } = {} } = req.query as ProjectGetAllControllerQueryType;

    const tokenJWT = new TokenJWT(SECRET_JWT);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const castedSort = sort || undefined;
    const castedSize = Number(size) || DEFAULT_PAGE_SIZE;
    const castedOffset = Number(offset) || undefined;

    const { projects, meta } = await this.useCase.execute({
      session,
      language,
      sort: castedSort,
      size: castedSize,
      offset: castedOffset,
      filter: {
        tags,
      },
    });

    const formattedProjects = projects.map((item) => {
      return {
        type: 'project',
        id: item.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/projects/' + item.id,
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
      data: formattedProjects,
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
