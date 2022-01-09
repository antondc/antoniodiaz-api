import { User } from '@domain/user/entities/User';

export interface IArticleSortOneRequest {
  session: User;
  language: string;
  articleId: number;
  order: number;
}
