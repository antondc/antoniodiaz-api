import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectGetOneRequest } from '@domain/project/useCases/interfaces/IProjectGetOneRequest';
import { IProjectGetOneUseCase } from '@domain/project/useCases/ProjectGetOneUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, SECRET_JWT, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ProjectGetOneController extends BaseController {
  useCase: IProjectGetOneUseCase;

  constructor(useCase: IProjectGetOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { projectId, language = DEFAULT_LANGUAGE } = req.params;

    const tokenJWT = new TokenJWT(SECRET_JWT);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const projectGetOneRequest: IProjectGetOneRequest = {
      language,
      projectId: Number(projectId),
      session,
    };

    const response = await this.useCase.execute(projectGetOneRequest);

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
