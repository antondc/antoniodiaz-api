import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { User } from '../entities/User';
import { IUserGetByIdsRequest } from './interfaces/IUserGetByIdsRequest';
import { IUserGetByIdsResponse } from './interfaces/IUserGetByIdsResponse';

export interface IUserGetByIdsUseCase {
  execute: (userGetByIdsRequest: IUserGetByIdsRequest) => Promise<IUserGetByIdsResponse>;
}

export class UserGetByIdsUseCase implements IUserGetByIdsUseCase {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(userGetByIdsRequest: IUserGetByIdsRequest): Promise<IUserGetByIdsResponse> {
    const { session, userIds, sort, size, offset } = userGetByIdsRequest;

    const { usersData } = await this.userRepo.userGetByIds({ sessionId: session?.id, userIds, sort, size, offset });

    const users = usersData.map((userData) => new User(userData));

    return users;
  }
}
