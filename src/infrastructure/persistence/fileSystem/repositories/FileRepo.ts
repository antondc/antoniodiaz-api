import fs from 'fs';
import Jimp from 'jimp';
import mkdirp from 'mkdirp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IFileDeleteOneRequest } from '@domain/file/repositories/interfaces/IFileDeleteOneRequest';
import { IFileDeleteOneResponse } from '@domain/file/repositories/interfaces/IFileDeleteOneResponse';
import { IFileImageSaveOneRequest } from '@domain/file/repositories/interfaces/IFileImageSaveOneRequest';
import { IFileImageSaveOneResponse } from '@domain/file/repositories/interfaces/IFileImageSaveOneResponse';
import { IFileSaveInTempFolderRequest } from '@domain/file/repositories/interfaces/IFileSaveInTempFolderRequest';
import { IFileSaveInTempFolderResponse } from '@domain/file/repositories/interfaces/IFileSaveInTempFolderResponse';
import { IFileSaveOneRequest } from '@domain/file/repositories/interfaces/IFileSaveOneRequest';
import { IFileSaveOneResponse } from '@domain/file/repositories/interfaces/IFileSaveOneResponse';
import config from '@root/config.test.json';
import { MS_30_MINS } from '@shared/constants/constants';
import { URL_SERVER } from '@shared/constants/env';
import { ServerError } from '@shared/errors/ServerError';
import { URLWrapper } from '@shared/services/UrlWrapper';
import { toRelative } from '@tools/helpers/url/toRelative';

export class FileRepo implements IFileRepo {
  public async fileImageSaveOne(fileImageSaveOneRequest: IFileImageSaveOneRequest): Promise<IFileImageSaveOneResponse> {
    const { path: finalPath, filename } = await this.fileSaveOne(fileImageSaveOneRequest);

    await this.imageResizeAndSave(finalPath, filename, fileImageSaveOneRequest.formatOptions);

    return {
      path: `${URL_SERVER}/${finalPath}`,
    };
  }

  private async imageResizeAndSave(originPath, filename, formatOptions): Promise<void> {
    if (!formatOptions?.sizes) return;

    await formatOptions.sizes.forEach(async (item) => {
      const destinationPath = path.join(config.MEDIA_FILES, formatOptions?.destinationFolder, `w${item.width}h${item.height}`);
      const destinationPathExists = fs.existsSync(destinationPath);
      if (!destinationPathExists) mkdirp.sync(destinationPath);

      const finalPath = path.join(destinationPath, filename);
      const finalPathExists = fs.existsSync(finalPath);

      if (finalPathExists) return; // If file already exists, return

      // Define mime type
      let mime;
      switch (formatOptions.extension) {
        case 'png':
          mime = Jimp.MIME_PNG;
          break;
        case 'jpg':
        default:
          mime = Jimp.MIME_JPEG;
          break;
      }

      const image = await Jimp.read(originPath);
      await image.scaleToFit(item.width, item.height);
      await image.getBuffer(mime, (err, buff) => fs.writeFileSync(finalPath, buff));
    });

    return;
  }

  async fileSaveOne(fileSaveOneRequest: IFileSaveOneRequest): Promise<IFileSaveOneResponse> {
    const myUrl = new URLWrapper(fileSaveOneRequest?.fileUrl);

    const originPath = toRelative(myUrl.getPath());
    const fileExists = fs.existsSync(originPath);
    if (!fileExists) throw new ServerError('File does not exist', 500);

    const file = fs.createReadStream(originPath);
    const destinationOriginalPath = path.join(config.MEDIA_FILES, fileSaveOneRequest.formatOptions?.destinationFolder, 'original');
    const destinationOriginalPathExists = fs.existsSync(destinationOriginalPath);
    if (!destinationOriginalPathExists) mkdirp.sync(destinationOriginalPath);

    const filename = myUrl.getFilename();
    const finalFilePath = path.join(destinationOriginalPath, filename);
    const finalFilePathExists = fs.existsSync(finalFilePath);
    // If file already exists, return
    if (finalFilePathExists) {
      return {
        path: finalFilePath,
        filename,
      };
    }

    const outStream = fs.createWriteStream(finalFilePath);

    file.pipe(outStream);

    return new Promise((resolve) => {
      outStream.on('finish', () => {
        const fileIsTemporary = originPath.includes(config.TEMP_FILES);
        fileIsTemporary && fs.unlinkSync(originPath);

        resolve({
          path: finalFilePath,
          filename,
        });
      });
    });
  }

  async fileSaveInTempFolder(fileSaveInTempFolderRequest: IFileSaveInTempFolderRequest): Promise<IFileSaveInTempFolderResponse> {
    const { content, extension } = fileSaveInTempFolderRequest.file;
    const name = `${uuidv4()}.${extension}`;
    const destinationPath = path.join(config.TEMP_FILES);
    const destinationPathExists = fs.existsSync(destinationPath);
    if (!destinationPathExists) mkdirp.sync(destinationPath);

    const finalFilePath = path.join(destinationPath, name);
    await fs.promises.writeFile(finalFilePath, content, 'binary');

    const finalFilePathExists = fs.existsSync(finalFilePath);
    if (!finalFilePathExists) throw new ServerError('Image saving failed', 500);

    // Remove file after 30 mins
    setTimeout(() => fs.promises.unlink(finalFilePath), MS_30_MINS);

    return {
      path: finalFilePath,
    };
  }

  async fileDeleteOne(url: IFileDeleteOneRequest): Promise<IFileDeleteOneResponse> {
    // We don't have files with same name in our system
    // Thus, we can traverse the /media folder recursively and remove coincidences
    const urlWrapper = new URLWrapper(url);
    const filename = urlWrapper.getFilename();
    const rootPath = config.MEDIA_FOLDER;

    this.fileRemoveRecursive(rootPath, filename);

    return {
      success: true,
    };
  }

  fileRemoveRecursive(startPath, targetFileName) {
    const files = fs.readdirSync(startPath);

    files.forEach((item) => {
      const checkedFilePath = path.join(startPath, item);
      const fileStats = fs.lstatSync(checkedFilePath);
      const contentItemIsDirectory = fileStats.isDirectory();
      const filePathIncludesFileName = checkedFilePath.includes(targetFileName);
      const checkedFilePathExists = fs.existsSync(checkedFilePath);

      if (contentItemIsDirectory) this.fileRemoveRecursive(checkedFilePath, targetFileName);
      if (filePathIncludesFileName && checkedFilePathExists) fs.unlinkSync(checkedFilePath);
    });
  }
}
