import { IFileRepo } from '../repositories/IFileRepo';
import { FileDTO } from './FileDTO';
import { IFileDeleteOneRequest } from './interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from './interfaces/IFileDeleteOneResponse';
import { IFileGetOneRequest } from './interfaces/IFileGetOneRequest';
import { IFileGetOneResponse } from './interfaces/IFileGetOneResponse';
import { IFileSaveInTempFolderRequest } from './interfaces/IFileSaveInTempFolderRequest';
import { IFileSaveInTempFolderResponse } from './interfaces/IFileSaveInTempFolderResponse';
import { IFileSaveOneRequest } from './interfaces/IFileSaveOneRequest';
import { IFileSaveOneResponse } from './interfaces/IFileSaveOneResponse';

export const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'html', 'json'];

export class File extends FileDTO {
  fileRepo?: IFileRepo;

  constructor(fileRepo?: IFileRepo) {
    super();
    this.fileRepo = fileRepo;
  }

  async fileSaveInTempFolder(fileSaveInTempFolderRequest: IFileSaveInTempFolderRequest): Promise<IFileSaveInTempFolderResponse> {
    const { file } = fileSaveInTempFolderRequest;

    const { path } = await this.fileRepo.fileSaveInTempFolder({ file });

    return { path };
  }

  async fileSaveOne(fileSaveOneRequest: IFileSaveOneRequest): Promise<IFileSaveOneResponse> {
    const { path } = await this.fileRepo.fileSaveOne(fileSaveOneRequest);

    return { path };
  }

  fileGetOne(fileGetOneRequest: IFileGetOneRequest): IFileGetOneResponse {
    const fileExists = this.fileRepo.fileGetOne(fileGetOneRequest);

    return fileExists;
  }

  fileDeleteOne = async (url: IFileDeleteOneRequest): Promise<IFileDeleteOneResponse> => {
    const { success } = await this.fileRepo.fileDeleteOne(url);

    return {
      success,
    };
  };
}
