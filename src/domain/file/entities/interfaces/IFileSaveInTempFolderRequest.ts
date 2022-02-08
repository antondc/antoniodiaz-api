import { FileBlobDTO } from '@domain/file/entities/FileBlobDTO';

export type IFileSaveInTempFolderRequest = {
  fileBlob: FileBlobDTO;
};
