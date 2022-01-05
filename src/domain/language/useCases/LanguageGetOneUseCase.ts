import { ILanguageRepo } from '@domain/language/repositories/ILanguageRepo';
import { ILanguageGetOneRequest } from '@domain/language/useCases/interfaces/ILanguageGetOneRequest';
import { ILanguageGetOneResponse } from '@domain/language/useCases/interfaces/ILanguageGetOneResponse';

export interface ILanguageGetOneUseCase {
  execute: (getLanguagesRequest: ILanguageGetOneRequest) => Promise<ILanguageGetOneResponse>;
}

export class LanguageGetOneUseCase implements ILanguageGetOneUseCase {
  private languageRepo: ILanguageRepo;

  constructor(languageRepo: ILanguageRepo) {
    this.languageRepo = languageRepo;
  }

  public async execute(getLanguagesRequest: ILanguageGetOneRequest): Promise<ILanguageGetOneResponse> {
    const response = await this.languageRepo.languageGetOne(getLanguagesRequest);

    return response;
  }
}
