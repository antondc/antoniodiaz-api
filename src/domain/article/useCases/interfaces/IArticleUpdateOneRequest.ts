import { User } from '@domain/user/entities/User';

export interface IArticleUpdateOneRequest {
  session: User;
  articleId: number;
  language: string;
  title: string;
  contentJson: string;
  contentHtml: string;
}
