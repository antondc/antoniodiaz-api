import { User } from '@domain/user/entities/User';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: string;
  contentHtml: string;
}
