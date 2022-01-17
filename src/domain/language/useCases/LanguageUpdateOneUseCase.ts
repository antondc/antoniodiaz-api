import { Language } from '@domain/language/entities/Language';
import { ILanguageRepo } from '@domain/language/repositories/ILanguageRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { ILanguageUpdateOneRequest } from './interfaces/ILanguageUpdateOneRequest';
import { ILanguageUpdateOneResponse } from './interfaces/ILanguageUpdateOneResponse';

export interface ILanguageUpdateOneUseCase {
  execute: (languageUpdateRequest: ILanguageUpdateOneRequest) => Promise<ILanguageUpdateOneResponse>;
}

export class LanguageUpdateOneUseCase implements ILanguageUpdateOneUseCase {
  private languageRepo: ILanguageRepo;

  constructor(languageRepo: ILanguageRepo) {
    this.languageRepo = languageRepo;
  }

  public async execute(languageUpdateRequest: ILanguageUpdateOneRequest): Promise<ILanguageUpdateOneResponse> {
    const { session, slug, who, whoContentJson } = languageUpdateRequest;

    if (session?.level !== 'admin') throw new AuthenticationError('Unauthorized', 401);

    const languageExists = await this.languageRepo.languageGetOne({ slug });
    if (!languageExists?.id) throw new RequestError('Language does not exist', 404);

    await this.languageRepo.languageGlossaryUpdateOne({ id: languageExists?.id, who, whoContentJson });

    const languageData = await this.languageRepo.languageGetOne({ slug });
    const language = new Language(languageData);

    return language;
  }
}
