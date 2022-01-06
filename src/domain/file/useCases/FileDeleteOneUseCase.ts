import { File } from '@domain/file/entities/File';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { ServerError } from '@shared/errors/ServerError';
import { IFileDeleteOneRequest } from './interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from './interfaces/IFileDeleteOneResponse';

export interface IFileDeleteOneUseCase {
  execute: (fileDeleteOneRequest: IFileDeleteOneRequest) => Promise<IFileDeleteOneResponse>;
}

export class FileDeleteOneUseCase implements IFileDeleteOneUseCase {
  private fileRepo: IFileRepo;

  constructor(fileRepo: IFileRepo) {
    this.fileRepo = fileRepo;
  }

  public async execute(fileDeleteOneRequest: IFileDeleteOneRequest): Promise<IFileDeleteOneResponse> {
    const { session, path } = fileDeleteOneRequest;
    if (!path) throw new RequestError('Unprocessable Entity', 422);

    // Users are only allowed to edit files within their own folders
    if (!path.includes(session?.id) && !path.includes('temp_files')) throw new AuthenticationError('401 Unauthorized', 401);

    const fileInstance = new File({ fileRepo: this.fileRepo });
    const { success } = await fileInstance.fileDeleteOne(path);
    if (!success) throw new ServerError('Operation failed', 500);

    return {
      path,
    };
  }
}
