import { IStateRepo } from '@domain/state/repositories/IStateRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { IStateResetContentUseCaseRequest } from './interfaces/IStateResetContentUseCaseRequest';

export interface IStateResetContentUseCase {
  execute: (stateResetContentUseCaseRequest: IStateResetContentUseCaseRequest) => unknown;
}

export class StateResetContentUseCase {
  private stateRepo: IStateRepo;

  constructor(stateRepo: IStateRepo) {
    this.stateRepo = stateRepo;
  }

  public async execute(stateResetContentUseCaseRequest: IStateResetContentUseCaseRequest) {
    const { session } = stateResetContentUseCaseRequest;
    if (session?.level !== 'admin') throw new AuthenticationError('401 Unauthorized', 401); // (1)

    const response = await this.stateRepo.resetContent();

    return response;
  }
}

/* --- DOC ---
  Reset the database with default content
  Exceptions:
    (1) The user is not admin
*/
