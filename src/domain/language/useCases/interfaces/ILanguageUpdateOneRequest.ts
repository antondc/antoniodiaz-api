import { User } from '@domain/user/entities/User';
import { RichContentJson } from '@shared/services/RichContent';

export interface ILanguageUpdateOneRequest {
  session: User;
  slug: string;
  who: string;
  whoContentJson: RichContentJson;
}
