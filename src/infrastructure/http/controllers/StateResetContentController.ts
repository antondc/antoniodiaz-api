import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { IStateResetContentUseCaseRequest } from '@domain/state/useCases/interfaces/IStateResetContentUseCaseRequest';
import { IStateResetContentUseCase } from '@domain/state/useCases/StateResetContentUseCase';
import { User } from '@domain/user/entities/User';
import { JWT_SECRET } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class StateResetContentController extends BaseController {
  useCase: IStateResetContentUseCase;

  constructor(resetContentUseCase: IStateResetContentUseCase) {
    super();
    this.useCase = resetContentUseCase;
  }

  async executeImpl(req: Request, res: Response) {
    const tokenJWT = new TokenJWT(JWT_SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const stateResetContentUseCaseRequest: IStateResetContentUseCaseRequest = {
      session,
    };
    const response = await this.useCase.execute(stateResetContentUseCaseRequest);

    return res.status(200).send(response);
  }
}
