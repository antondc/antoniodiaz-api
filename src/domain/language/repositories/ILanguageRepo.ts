import { ILanguageGetAllResponse } from './interfaces/ILanguageGetAllResponse';
import { ILanguageGetOneRequest } from './interfaces/ILanguageGetOneRequest';
import { ILanguageGetOneResponse } from './interfaces/ILanguageGetOneResponse';
import { ILanguageGlossaryUpdateOneRequest } from './interfaces/ILanguageGlossaryUpdateOneRequest';
import { ILanguageGlossaryUpdateOneResponse } from './interfaces/ILanguageGlossaryUpdateOneResponse';

export interface ILanguageRepo {
  languageGetOne: (languageGetOneRequest: ILanguageGetOneRequest) => Promise<ILanguageGetOneResponse>;
  languageGetAll: () => Promise<ILanguageGetAllResponse>;
  languageGlossaryUpdateOne: (languageGlossaryUpdateOneRequest: ILanguageGlossaryUpdateOneRequest) => Promise<ILanguageGlossaryUpdateOneResponse>;
}
