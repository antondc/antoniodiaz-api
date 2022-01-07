import { FileImage } from '@domain/file/entities/FileImage';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { User, userImageFormat } from '@domain/user/entities/User';
import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { RequestError } from '@shared/errors/RequestError';
import { UserError } from '@shared/errors/UserError';
import { StringValidator } from '@shared/services/StringValidator';
import { IUserUpdateOneRequest } from './interfaces/IUserUpdateOneRequest';
import { IUserUpdateOneResponse } from './interfaces/IUserUpdateOneResponse';

export interface IUserUpdateOneUseCase {
  execute: (userUpdateRequest: IUserUpdateOneRequest) => Promise<IUserUpdateOneResponse>;
}

export class UserUpdateOneUseCase implements IUserUpdateOneUseCase {
  private userRepo: IUserRepo;
  private fileRepo: IFileRepo;

  constructor(userRepo: IUserRepo, fileRepo: IFileRepo) {
    this.userRepo = userRepo;
    this.fileRepo = fileRepo;
  }

  public async execute(userUpdateRequest: IUserUpdateOneRequest): Promise<IUserUpdateOneResponse> {
    const { email, name, session, image } = userUpdateRequest;

    const isEmail = StringValidator.validateEmailAddress(email);
    if (!isEmail) throw new UserError('Email incorrect', 409);

    const userExists = await this.userRepo.userGetOne({ sessionId: session?.id, email, name });
    if (!userExists) throw new RequestError('User does not exist', 404);

    const userImageEntity = new FileImage({ fileRepo: this.fileRepo });
    const savedImage = await userImageEntity.fileImageSaveOne({ fileUrl: image, formatOptions: userImageFormat });

    await this.userRepo.userUpdateOne({ ...userUpdateRequest, userId: session?.id, image: savedImage?.path });

    const userData = await this.userRepo.userGetOne({ sessionId: session?.id, userId: session?.id });
    const user = new User(userData);

    return user;
  }
}
