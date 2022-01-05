import { FileDTO } from '@domain/file/entities/FileDTO';

export interface IFileUploadOneResponse extends FileDTO {
  path: string;
}
