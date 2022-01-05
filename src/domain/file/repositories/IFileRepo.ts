import { IFileDeleteOneRequest } from './interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from './interfaces/IFileDeleteOneResponse';
import { IFileImageSaveOneRequest } from './interfaces/IFileImageSaveOneRequest';
import { IFileImageSaveOneResponse } from './interfaces/IFileImageSaveOneResponse';
import { IFileSaveInTempFolderRequest } from './interfaces/IFileSaveInTempFolderRequest';
import { IFileSaveInTempFolderResponse } from './interfaces/IFileSaveInTempFolderResponse';
import { IFileSaveOneRequest } from './interfaces/IFileSaveOneRequest';
import { IFileSaveOneResponse } from './interfaces/IFileSaveOneResponse';

export interface IFileRepo {
  fileSaveInTempFolder: (fileSaveInTempFolderRequest: IFileSaveInTempFolderRequest) => Promise<IFileSaveInTempFolderResponse>;
  fileSaveOne: (fileSaveOneRequest: IFileSaveOneRequest) => Promise<IFileSaveOneResponse>;
  fileDeleteOne: (fileDeleteRequest: IFileDeleteOneRequest) => Promise<IFileDeleteOneResponse>;
  fileImageSaveOne: (fileImageSaveOneRequest: IFileImageSaveOneRequest) => Promise<IFileImageSaveOneResponse>;
}
