import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectSortOneRequest } from '@domain/project/useCases/interfaces/IProjectSortOneRequest';
import { IProjectSortOneUseCase } from '@domain/project/useCases/ProjectSortOneUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ProjectSortOneController extends BaseController {
  useCase: IProjectSortOneUseCase;

  constructor(useCase: IProjectSortOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { projectId, language = DEFAULT_LANGUAGE } = req.params;
    const { order } = req.body;

    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const projectSortOneRequest: IProjectSortOneRequest = {
      session,
      language,
      projectId: Number(projectId),
      order,
    };

    const response = await this.useCase.execute(projectSortOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/projects/' + projectId,
      },
      data: {
        type: 'project',
        session: {
          self: URL_SERVER + PATH_API_V1 + '/projects/' + projectId,
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
