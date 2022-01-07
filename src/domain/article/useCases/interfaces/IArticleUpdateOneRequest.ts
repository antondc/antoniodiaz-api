import { RichContentJson } from '@domain/richContent/entities/interfaces/RichContentJson';
import { User } from '@domain/user/entities/User';

export interface IArticleUpdateOneRequest {
  session: User;
  articleId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
