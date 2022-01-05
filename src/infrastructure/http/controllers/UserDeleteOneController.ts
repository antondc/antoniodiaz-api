import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IUserDeleteOneRequest } from '@domain/user/useCases/interfaces/IUserDeleteOneRequest';
import { IUserDeleteOneUseCase } from '@domain/user/useCases/UserDeleteOneUseCase';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class UserDeleteOneController extends BaseController {
  useCase: IUserDeleteOneUseCase;

  constructor(useCase: IUserDeleteOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);

    const userDeleteOneRequest: IUserDeleteOneRequest = {
      session,
    };

    const response = await this.useCase.execute(userDeleteOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/users/' + response?.userId,
      },
      data: [
        {
          type: 'user',
          id: response?.userId,
          session: {
            self: URL_SERVER + PATH_API_V1 + '/users/' + response?.userId,
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
