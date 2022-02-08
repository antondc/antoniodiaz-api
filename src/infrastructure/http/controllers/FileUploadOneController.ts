import { Request, Response } from 'express';

import { IFileUploadOneUseCase } from '@domain/file/useCases/FileUploadOneUseCase';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class FileUploadOneController extends BaseController {
  useCase: IFileUploadOneUseCase;

  constructor(useCase: IFileUploadOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { file: fileBlob } = req.body;

    const response = await this.useCase.execute({ fileBlob });

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/images/upload/single',
      },
      data: {
        file: `${URL_SERVER}/${response?.path}`,
      },
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
