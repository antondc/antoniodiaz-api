import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { User } from '../entities/User';
import { IUserGetAllRequest } from './interfaces/IUserGetAllRequest';
import { IUserGetAllResponse } from './interfaces/IUserGetAllResponse';

export interface IUserGetAllUseCase {
  execute: (userGetAllRequest: IUserGetAllRequest) => Promise<IUserGetAllResponse>;
}

export class UserGetAllUseCase implements IUserGetAllUseCase {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(userGetAllRequest: IUserGetAllRequest): Promise<IUserGetAllResponse> {
    const { session, sort, size, offset, filter } = userGetAllRequest;

    const { usersData, meta } = await this.userRepo.userGetAll({ sessionId: session?.id, sort, size, offset, filter });

    const users = usersData.map((userData) => new User(userData));

    return {
      users,
      meta,
    };
  }
}
