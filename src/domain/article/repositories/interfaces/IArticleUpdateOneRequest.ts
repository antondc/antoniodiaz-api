import { RichContentJson } from '@shared/services/RichContent';

export interface IArticleUpdateOneRequest {
  articleId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
