import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { IUserLogoutRequest } from './interfaces/UserLogOutRequest';
import { IUserLogoutResponse } from './interfaces/UserLogOutResponse';

export interface IUserLogOutUseCase {
  execute: (userLogout: IUserLogoutRequest) => Promise<IUserLogoutResponse>;
}

export class UserLogOutUseCase implements IUserLogOutUseCase {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(userLogout: IUserLogoutRequest): Promise<IUserLogoutResponse> {
    const { session } = userLogout;

    if (!session?.id) throw new AuthenticationError('User is not logged in', 500);

    const sessionLogData = {
      result: 'success',
      type: 'logout',
      userId: session?.id,
    };

    try {
      await this.userRepo.userLogSession(sessionLogData);
    } catch (err) {
      // TODO: log to DB with a service
    }

    const result = {
      session,
    };

    return result;
  }
}
