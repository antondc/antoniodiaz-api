import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectDeleteOneRequest } from '@domain/project/useCases/interfaces/IProjectDeleteOneRequest';
import { IProjectDeleteOneUseCase } from '@domain/project/useCases/ProjectDeleteOneUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ProjectDeleteOneController extends BaseController {
  useCase: IProjectDeleteOneUseCase;

  constructor(useCase: IProjectDeleteOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { projectId, language = DEFAULT_LANGUAGE_SLUG } = req.params;
    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const projectDeleteOneRequest: IProjectDeleteOneRequest = {
      session,
      language,
      projectId: Number(projectId),
    };

    const response = await this.useCase.execute(projectDeleteOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/projects/' + response?.projectId,
      },
      data: [
        {
          type: 'project',
          id: response?.projectId,
          session: {
            self: URL_SERVER + PATH_API_V1 + '/projects/' + response?.projectId,
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
