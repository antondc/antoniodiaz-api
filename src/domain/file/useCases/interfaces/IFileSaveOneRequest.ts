import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';

export type IImageSaveOneRequest = {
  fileUrl: string;
  formatOptions: IFileImageFormatOptions;
};
