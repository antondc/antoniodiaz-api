import { User } from '@domain/user/entities/User';
import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { PasswordHasher } from '@shared/services/PasswordHasher';
import { IUserLoginRequest } from './interfaces/IUserLoginRequest';
import { IUserLoginResponse } from './interfaces/IUserLoginResponse';

export interface IUserLoginUseCase {
  execute: (userLogin: IUserLoginRequest) => Promise<IUserLoginResponse>;
}

export class UserLoginUseCase implements IUserLoginUseCase {
  userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(userLogin: IUserLoginRequest): Promise<IUserLoginResponse> {
    const { nameOrEmail, password } = userLogin;

    const userData = await this.userRepo.userGetOne({ name: nameOrEmail, email: nameOrEmail });
    if (!userData) throw new AuthenticationError('User doesn’t exist', 500, 'nameOrEmail');

    const { password: existingHash } = await this.userRepo.userGetCredentials({ userId: userData?.id });

    const passwordHasher = new PasswordHasher();
    const hashBuffer = await passwordHasher.hashToBuffer(existingHash);
    const isEqual = await passwordHasher.verifyPassword(password, hashBuffer);
    if (!isEqual) throw new AuthenticationError('Password not correct', 500, 'password');

    const user = new User(userData);

    const sessionData = {
      id: user.id,
      order: user.order,
      name: user.name,
      level: user.level,
      email: user.email,
      image: user.image,
      status: user.status,
      statement: user.statement,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const sessionLogData = {
      result: 'success',
      type: 'login',
      userId: sessionData.id,
    };

    await this.userRepo.userLogSession(sessionLogData);

    return sessionData;
  }
}
