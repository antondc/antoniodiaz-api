import { User } from '@domain/user/entities/User';

export interface ILanguageUpdateOneRequest {
  session: User;
  slug: string;
  who: string;
  whoContentJson: string;
}
