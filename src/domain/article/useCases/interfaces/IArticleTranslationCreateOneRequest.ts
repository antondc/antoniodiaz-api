import { User } from '@domain/user/entities/User';

export interface IArticleTranslationCreateOneRequest {
  session: User;
  articleId: number;
  language: string;
  title: string;
  content_json: string;
  content_html: string;
}
