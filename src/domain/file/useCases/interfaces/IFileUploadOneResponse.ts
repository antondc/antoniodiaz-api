import { FileBlobDTO } from '@domain/file/entities/FileBlobDTO';

export interface IFileUploadOneResponse extends FileBlobDTO {
  path: string;
}
