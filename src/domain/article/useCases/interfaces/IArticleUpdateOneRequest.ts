import { User } from '@domain/user/entities/User';
import { RichContentJson } from '@shared/services/RichContent';

export interface IArticleUpdateOneRequest {
  session: User;
  articleId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
