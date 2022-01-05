import { User } from '@domain/user/entities/User';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  content_json: string;
  content_html: string;
}
