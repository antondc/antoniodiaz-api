import { TokenJWT, URLWrapper } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IUserLogoutRequest } from '@domain/user/useCases/interfaces/UserLogOutRequest';
import { IUserLogOutUseCase } from '@domain/user/useCases/UserLogOutUseCase';
import { ENDPOINT_CLIENTS, PATH_API_V1, SECRET_JWT, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class UserLogOutController extends BaseController {
  useCase: IUserLogOutUseCase;

  constructor(useCase: IUserLogOutUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const tokenJWT = new TokenJWT(SECRET_JWT);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const userLogOutRequest: IUserLogoutRequest = {
      session,
    };

    const response = await this.useCase.execute(userLogOutRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/login',
      },
      data: {
        type: 'session',
        id: response.session?.id,
        login: {
          self: URL_SERVER + PATH_API_V1 + '/login',
        },
        attributes: {
          id: response.session?.id,
        },
        relationships: {},
      },

      included: [],
    };

    const clientFound = ENDPOINT_CLIENTS.some((item) => item.includes(req.headers.origin)); // Identify the client
    const urlWrapper = new URLWrapper(`${req.protocol}://${req.hostname}`);
    const domainWithoutSubdomain = urlWrapper.getDomainWithoutSubdomain();
    const domainForCookie = clientFound ? '.' + domainWithoutSubdomain : null; // Return domain only for recognized clients

    return res.clearCookie('sessionToken', { path: '/', domain: domainForCookie }).status(205).send(formattedResponse);
  }
}
