import { ILanguageRepo } from '@domain/language/repositories/ILanguageRepo';
import { ILanguageGetAllResponse } from '@domain/language/useCases/interfaces/ILanguageGetAllResponse';

export interface ILanguageGetAllUseCase {
  execute: () => Promise<ILanguageGetAllResponse>;
}

export class LanguageGetAllUseCase implements ILanguageGetAllUseCase {
  private languageRepo: ILanguageRepo;

  constructor(languageRepo: ILanguageRepo) {
    this.languageRepo = languageRepo;
  }

  public async execute(): Promise<ILanguageGetAllResponse> {
    const response = await this.languageRepo.languageGetAll();

    return response;
  }
}
