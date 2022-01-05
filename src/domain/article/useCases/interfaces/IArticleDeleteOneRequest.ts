import { User } from '@domain/user/entities/User';

export interface IArticleDeleteOneRequest {
  session: User;
  language: string;
  articleId: number;
}
