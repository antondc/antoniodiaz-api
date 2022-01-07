import { RichContentJson } from '@domain/richContent/entities/interfaces/RichContentJson';
import { User } from '@domain/user/entities/User';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
}
