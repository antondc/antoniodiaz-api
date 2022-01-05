import { FileDTO } from '@domain/file/entities/FileDTO';

export type IFileSaveInTempFolderRequest = {
  file: FileDTO;
};
