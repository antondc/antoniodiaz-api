import { IFileRepo } from '../repositories/IFileRepo';
import { FileDTO } from './FileDTO';
import { IFileDeleteOneRequest } from './interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from './interfaces/IFileDeleteOneResponse';
import { IFileSaveInTempFolderRequest } from './interfaces/IFileSaveInTempFolderRequest';
import { IFileSaveInTempFolderResponse } from './interfaces/IFileSaveInTempFolderResponse';
import { IFileSaveOneRequest } from './interfaces/IFileSaveOneRequest';
import { IFileSaveOneResponse } from './interfaces/IFileSaveOneResponse';

export const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'html', 'json'];

export interface FileConstructorProps {
  file?: FileDTO;
  fileRepo?: IFileRepo;
}

export class File extends FileDTO {
  file?: FileDTO;
  fileRepo?: IFileRepo;

  constructor(constructorProps?: FileConstructorProps) {
    super();
    this.file = constructorProps?.file;
    this.fileRepo = constructorProps?.fileRepo;
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

  fileDeleteOne = async (url: IFileDeleteOneRequest): Promise<IFileDeleteOneResponse> => {
    const { success } = await this.fileRepo.fileDeleteOne(url);

    return {
      success,
    };
  };
}
