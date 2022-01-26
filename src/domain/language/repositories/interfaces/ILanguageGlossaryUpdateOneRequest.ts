import { Glossary } from '@domain/language/entities/Language';

export interface ILanguageGlossaryUpdateOneRequest {
  id: number;
  glossary: Glossary;
}
