import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IUserGetOneRequest } from '@domain/user/useCases/interfaces/IUserGetOneRequest';
import { IUserGetOneUseCase } from '@domain/user/useCases/UserGetOneUseCase';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class UserGetOneController extends BaseController {
  useCase: IUserGetOneUseCase;

  constructor(useCase: IUserGetOneUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { userId, name, email } = req.params;
    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);
    const userOrSession = userId === 'me' ? session?.id : userId;

    const userGetOneRequest: IUserGetOneRequest = {
      userId: userOrSession,
      name,
      email,
      session,
    };

    const response = await this.useCase.execute(userGetOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/users/' + userId,
      },
      data: {
        type: 'user',
        session: {
          self: URL_SERVER + PATH_API_V1 + '/users/' + userId,
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
