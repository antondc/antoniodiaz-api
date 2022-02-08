import { IFileRepo } from '../repositories/IFileRepo';
import { FileBlobDTO } from './FileBlobDTO';
import { IFileDeleteOneRequest } from './interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from './interfaces/IFileDeleteOneResponse';
import { IFileSaveInTempFolderRequest } from './interfaces/IFileSaveInTempFolderRequest';
import { IFileSaveInTempFolderResponse } from './interfaces/IFileSaveInTempFolderResponse';
import { IFileSaveOneRequest } from './interfaces/IFileSaveOneRequest';
import { IFileSaveOneResponse } from './interfaces/IFileSaveOneResponse';

export const allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'html', 'json'];

export interface FileConstructorProps {
  fileName?: string;
  fileBlob?: FileBlobDTO;
  fileRepo?: IFileRepo;
}

export class File extends FileBlobDTO {
  fileName?: string;
  fileBlob?: FileBlobDTO;
  fileRepo?: IFileRepo;

  constructor(constructorProps?: FileConstructorProps) {
    super();
    this.fileName = constructorProps?.fileName || constructorProps?.fileBlob?.name;
    this.fileBlob = constructorProps?.fileBlob;
    this.fileRepo = constructorProps?.fileRepo;
  }

  async fileSaveInTempFolder(fileSaveInTempFolderRequest: IFileSaveInTempFolderRequest): Promise<IFileSaveInTempFolderResponse> {
    const { fileBlob } = fileSaveInTempFolderRequest;

    const { path } = await this.fileRepo.fileSaveInTempFolder({ fileBlob: fileBlob });

    return {
      name: this.fileName,
      path,
    };
  }

  async fileSaveOne(fileSaveOneRequest: IFileSaveOneRequest): Promise<IFileSaveOneResponse> {
    const { path } = await this.fileRepo.fileSaveOne(fileSaveOneRequest);

    return {
      name: this.fileName,
      path,
    };
  }

  fileDeleteOne = async (url: IFileDeleteOneRequest): Promise<IFileDeleteOneResponse> => {
    const { success } = await this.fileRepo.fileDeleteOne(url);

    return {
      success,
    };
  };
}
