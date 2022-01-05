import { IFileFormatOptions } from '@domain/file/entities/interfaces/IFileFormatOptions';

export type IFileSaveOneRequest = {
  fileUrl: string;
  formatOptions: IFileFormatOptions;
};
