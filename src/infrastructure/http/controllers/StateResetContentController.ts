import { Request, Response } from 'express';

import { IStateResetContentUseCaseRequest } from '@domain/state/useCases/interfaces/IStateResetContentUseCaseRequest';
import { IStateResetContentUseCase } from '@domain/state/useCases/StateResetContentUseCase';
import { User } from '@domain/user/entities/User';
import { TokenService } from '@shared/services/TokenService';
import { BaseController } from './BaseController';

export class StateResetContentController extends BaseController {
  useCase: IStateResetContentUseCase;

  constructor(resetContentUseCase: IStateResetContentUseCase) {
    super();
    this.useCase = resetContentUseCase;
  }

  async executeImpl(req: Request, res: Response) {
    const tokenService = new TokenService();
    const session = tokenService.decodeToken<User>(req.cookies.sessionToken);
    const stateResetContentUseCaseRequest: IStateResetContentUseCaseRequest = {
      session,
    };
    const response = await this.useCase.execute(stateResetContentUseCaseRequest);

    return res.status(200).send(response);
  }
}
