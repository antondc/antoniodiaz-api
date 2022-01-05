import { ILanguageGetAllResponse } from '@domain/language/repositories/interfaces/ILanguageGetAllResponse';
import { ILanguageGetOneRequest } from '@domain/language/repositories/interfaces/ILanguageGetOneRequest';
import { ILanguageGetOneResponse } from '@domain/language/repositories/interfaces/ILanguageGetOneResponse';

export interface ILanguageRepo {
  languageGetOne: (languageGetOneRequest: ILanguageGetOneRequest) => Promise<ILanguageGetOneResponse>;
  languageGetAll: () => Promise<ILanguageGetAllResponse>;
}
