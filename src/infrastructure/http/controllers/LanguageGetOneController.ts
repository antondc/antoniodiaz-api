import { Request, Response } from 'express';

import { ILanguageGetOneRequest } from '@domain/language/useCases/interfaces/ILanguageGetOneRequest';
import { ILanguageGetOneUseCase } from '@domain/language/useCases/LanguageGetOneUseCase';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

export class LanguageGetOneController extends BaseController {
  useCase: ILanguageGetOneUseCase;

  constructor(useCase: ILanguageGetOneUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { slug } = req.params;
    const languageGetOneRequest: ILanguageGetOneRequest = {
      slug,
    };

    const response = await this.useCase.execute(languageGetOneRequest);

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/languages/' + response.slug,
      },
      data: {
        type: 'language',
        attributes: response,
      },
    };

    return res.status(200).send(formattedResponse);
  }
}
