import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IFileDeleteOneUseCase } from '@domain/file/useCases/FileDeleteOneUseCase';
import { IFileDeleteOneRequest } from '@domain/file/useCases/interfaces/IFileDeleteOneRequest';
import { User } from '@domain/user/entities/User';
import { JWT_SECRET, PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class FileDeleteOneController extends BaseController {
  useCase: IFileDeleteOneUseCase;

  constructor(useCase: IFileDeleteOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { path } = req.body;

    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);

    const fileDeleteOneRequest: IFileDeleteOneRequest = {
      path,
      session,
    };

    const response = await this.useCase.execute(fileDeleteOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/images/single',
      },
      data: {
        success: response?.path,
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
