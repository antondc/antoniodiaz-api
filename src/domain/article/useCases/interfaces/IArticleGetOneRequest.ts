import { User } from '@domain/user/entities/User';

export interface IArticleGetOneRequest {
  session: User;
  articleId: number;
  language: string;
}
