import { Request, Response } from 'express';

import { IUserResetPasswordRequest } from '@domain/user/useCases/interfaces/IUserResetPasswordRequest';
import { IUserResetPasswordUseCase } from '@domain/user/useCases/UserResetPasswordUseCase';
import { ENDPOINT_CLIENTS, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { TokenService } from '@shared/services/TokenService';
import { URLWrapper } from '@shared/services/UrlWrapper';
import { BaseController } from './BaseController';

export class UserResetPasswordController extends BaseController {
  useCase: IUserResetPasswordUseCase;

  constructor(useCase: IUserResetPasswordUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { name, token, password, passwordRepeated } = req.body;

    const userResetPasswordRequest: IUserResetPasswordRequest = {
      name,
      token,
      password,
      passwordRepeated,
    };

    const response = await this.useCase.execute(userResetPasswordRequest);

    const tokenService = new TokenService();
    const cookieToken = tokenService.createToken(response);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/users/me',
      },
      data: {
        type: 'session',
        id: response.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/users/me',
        },
        attributes: response,
        relationships: {},
      },
      included: [],
    };

    const clientFound = ENDPOINT_CLIENTS.some((item) => item.includes(req.headers.origin)); // Identify the client
    const urlWrapper = new URLWrapper(`${req.protocol}://${req.hostname}`);
    const domainWithoutSubdomain = urlWrapper.getDomainWithoutSubdomain();
    const domainForCookie = clientFound ? '.' + domainWithoutSubdomain : null; // Return domain only for recognized clients

    return res
      .cookie('sessionToken', cookieToken, {
        maxAge: 24 * 60 * 60 * 1000 * 30, // One month
        httpOnly: true,
        path: '/',
        domain: domainForCookie, // We need to prepend «.» to enable any subdomain
      })
      .json(formattedResponse)
      .end();
  }
}
