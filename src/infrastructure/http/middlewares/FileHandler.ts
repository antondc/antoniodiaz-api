import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { allowedFileExtensions } from '@domain/file/entities/File';
import { FileDTO } from '@domain/file/entities/FileDTO';
import { RequestError } from '@shared/errors/RequestError';
import getExtension from '@tools/helpers/file/getExtension';

export class FileHandler {
  static handleSingleFile() {
    const multerInstance = multer({
      limits: {
        files: 1,
      },
      fileFilter: FileHandler.fileFilter,
    });
    const retrieveSingleFile = multerInstance.any();

    return retrieveSingleFile;
  }

  // We want our files complying with our own interface
  static wrapSingleFile(req: Request, _: Response, next: NextFunction) {
    const [file] = req?.files as Express.Multer.File[];
    const mappedFiles: FileDTO = {
      name: file.originalname,
      type: file.mimetype,
      content: file.buffer,
      size: file.size,
      extension: `${file.originalname.split('.').pop()}`,
    };
    Object.assign(req.body, {
      file: mappedFiles,
    });

    return next();
  }

  static fileFilter(req, file, cb) {
    // Filter out files with not accepted mime types or extensions
    const mimeType = file.mimetype;
    const mimeIncludesSomeMimeFileType = allowedFileExtensions.some((item) => mimeType.toLowerCase().includes(item.toLowerCase()));
    const fileExtension = getExtension(file.originalname);
    const extensionIsAllowed = allowedFileExtensions.some((item) => item === fileExtension);
    if (mimeIncludesSomeMimeFileType && extensionIsAllowed) cb(null, true);
    if (!mimeIncludesSomeMimeFileType || !extensionIsAllowed) {
      cb(new RequestError('Wrong file type', 400));
    }
  }
}
