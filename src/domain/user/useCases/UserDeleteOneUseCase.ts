import { File } from '@domain/file/entities/File';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { RequestError } from '@shared/errors/RequestError';
import { User } from '../entities/User';
import { IUserDeleteOneRequest } from './interfaces/IUserDeleteOneRequest';
import { IUserDeleteOneResponse } from './interfaces/IUserDeleteOneResponse';

export interface IUserDeleteOneUseCase {
  execute: (userDeleteOneRequest: IUserDeleteOneRequest) => Promise<IUserDeleteOneResponse>;
}

export class UserDeleteOneUseCase implements IUserDeleteOneUseCase {
  private userRepo: IUserRepo;
  private fileRepo: IFileRepo;

  constructor(userRepo: IUserRepo, fileRepo: IFileRepo) {
    this.userRepo = userRepo;
    this.fileRepo = fileRepo;
  }

  public async execute(userDeleteOneRequest: IUserDeleteOneRequest): Promise<IUserDeleteOneResponse> {
    const { session } = userDeleteOneRequest;

    const userData = await this.userRepo.userGetOne({ userId: session?.id });
    if (!userData) throw new RequestError('User does not exist', 404);
    if (userData.status === 'disabled') throw new RequestError('User was already removed', 409);

    const user = new User(userData);
    const fileInstance = new File({ fileRepo: this.fileRepo });
    await fileInstance.fileDeleteOne(user?.image?.original);
    const { userId } = await this.userRepo.userDeleteOne({ userId: session?.id });

    return {
      userId,
    };
  }
}
