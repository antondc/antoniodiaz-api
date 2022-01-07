import { RichContentJson } from '@domain/richContent/entities/interfaces/RichContentJson';

export interface IArticleUpdateOneRequest {
  articleId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
