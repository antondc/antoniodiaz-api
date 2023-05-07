import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectUpdateOneRequest } from '@domain/project/useCases/interfaces/IProjectUpdateOneRequest';
import { IProjectUpdateOneUseCase } from '@domain/project/useCases/ProjectUpdateOneUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE_SLUG } from '@shared/constants/constants';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ProjectUpdateOneController extends BaseController {
  useCase: IProjectUpdateOneUseCase;

  constructor(useCase: IProjectUpdateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { projectId, language = DEFAULT_LANGUAGE_SLUG } = req.params;
    const { title, contentJson, published, carousel, files } = req.body;

    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const projectUpdateRequest: IProjectUpdateOneRequest = {
      projectId: Number(projectId),
      language,
      session,
      title,
      carousel,
      contentJson,
      published,
      files,
    };

    const response = await this.useCase.execute(projectUpdateRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/projects/me',
      },
      data: {
        type: 'project',
        id: response?.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/projects' + response.id,
        },
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
