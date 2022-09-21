import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IProjectCreateOneRequest } from '@domain/project/useCases/interfaces/IProjectCreateOneRequest';
import { IProjectCreateOneUseCase } from '@domain/project/useCases/ProjectCreateOneUseCase';
import { User } from '@domain/user/entities/User';
import { DEFAULT_LANGUAGE } from '@shared/constants/constants';
import { PATH_API_V1, SECRET_JWT, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class ProjectCreateOneController extends BaseController {
  useCase: IProjectCreateOneUseCase;

  constructor(useCase: IProjectCreateOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { language = DEFAULT_LANGUAGE } = req.params;
    const { title, carousel, contentJson } = req.body;

    const tokenJWT = new TokenJWT(SECRET_JWT);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const projectCreateRequest: IProjectCreateOneRequest = {
      language,
      session,
      title,
      carousel,
      contentJson,
    };

    const response = await this.useCase.execute(projectCreateRequest);

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
