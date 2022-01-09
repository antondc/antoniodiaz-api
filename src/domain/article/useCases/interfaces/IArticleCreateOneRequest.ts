import { User } from '@domain/user/entities/User';
import { RichContentJson } from '@shared/services/RichContent';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: RichContentJson;
}
