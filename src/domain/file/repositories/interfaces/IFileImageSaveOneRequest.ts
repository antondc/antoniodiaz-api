import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';

export type IFileImageSaveOneRequest = {
  fileUrl: string;
  formatOptions: IFileImageFormatOptions;
};
