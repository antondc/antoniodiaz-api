import { Glossary } from '@domain/language/entities/Language';
import { User } from '@domain/user/entities/User';

export interface ILanguageUpdateOneRequest {
  session: User;
  slug: string;
  glossary: Glossary;
}
