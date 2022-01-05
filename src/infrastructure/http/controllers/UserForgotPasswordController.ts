import { Request, Response } from 'express';

import { IUserForgotPasswordRequest } from '@domain/user/useCases/interfaces/IUserForgotPasswordRequest';
import { IUserForgotPasswordUseCase } from '@domain/user/useCases/UserForgotPasswordUseCase';
import { ENDPOINT_CLIENTS, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { URLWrapper } from '@shared/services/UrlWrapper';
import { BaseController } from './BaseController';

export class UserForgotPasswordController extends BaseController {
  useCase: IUserForgotPasswordUseCase;

  constructor(useCase: IUserForgotPasswordUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { nameOrEmail } = req.body;

    const userForgotPasswordRequest: IUserForgotPasswordRequest = {
      nameOrEmail,
    };

    const response = await this.useCase.execute(userForgotPasswordRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/login',
        next: URL_SERVER + PATH_API_V1 + '/reset-password',
      },
      data: {
        type: 'session',
        success: response.success,
        login: {
          self: URL_SERVER + PATH_API_V1 + '/login',
        },
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
