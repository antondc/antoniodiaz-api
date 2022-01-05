import { allowedFileExtensions, File } from '@domain/file/entities/File';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IFileUploadOneRequest } from './interfaces/IFileUploadOneRequest';
import { IFileUploadOneResponse } from './interfaces/IFileUploadOneResponse';


export interface IFileUploadOneUseCase {
  execute: (imageUploadOneRequest: IFileUploadOneRequest) => Promise<IFileUploadOneResponse>;
}

export class FileUploadOneUseCase implements IFileUploadOneUseCase {
  private fileRepo: IFileRepo;

  constructor(fileRepo: IFileRepo) {
    this.fileRepo = fileRepo;
  }
  public async execute(imageUploadOneRequest: IFileUploadOneRequest): Promise<IFileUploadOneResponse> {
    const { file } = imageUploadOneRequest;
    if (!allowedFileExtensions.includes(file.extension)) throw new RequestError('Wrong file extension', 400);

    const fileInstance = new File({ file, fileRepo: this.fileRepo });

    const mimeIncludesSomeMimeFileType = allowedFileExtensions.some((item) => file.type.toLowerCase().includes(item.toLowerCase()));
    if (!mimeIncludesSomeMimeFileType) throw new RequestError('Wrong file type', 400);

    const { path } = await fileInstance.fileSaveInTempFolder({ file });

    return {
      ...file,
      path,
    };
  }
}
