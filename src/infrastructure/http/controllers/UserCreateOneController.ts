import { Request, Response } from 'express';

import { IUserCreateOneRequest } from '@domain/user/useCases/interfaces/IUserCreateOneRequest';
import { IUserCreateOneUseCase } from '@domain/user/useCases/UserCreateOneUseCase';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class UserCreateOneController extends BaseController {
  useCase: IUserCreateOneUseCase;

  constructor(useCase: IUserCreateOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { name, email, password, password_repeated } = req.body;

    const userCreateRequest: IUserCreateOneRequest = {
      name,
      email,
      password,
      password_repeated,
    };
    const response = await this.useCase.execute(userCreateRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/users/me',
      },
      data: {
        type: 'user',
        id: response.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/users/me',
        },
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
