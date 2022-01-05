import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { User } from '../entities/User';
import { IUserGetOneRequest } from './interfaces/IUserGetOneRequest';
import { IUserGetOneResponse } from './interfaces/IUserGetOneResponse';

export interface IUserGetOneUseCase {
  execute: (userGetOneRequest: IUserGetOneRequest) => Promise<IUserGetOneResponse>;
}

export class UserGetOneUseCase implements IUserGetOneUseCase {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(userGetOneRequest: IUserGetOneRequest): Promise<IUserGetOneResponse> {
    const { session, userId, email, name } = userGetOneRequest;

    const userData = await this.userRepo.userGetOne({ sessionId: session?.id, userId, name, email });
    const user = new User(userData);

    return user;
  }
}
