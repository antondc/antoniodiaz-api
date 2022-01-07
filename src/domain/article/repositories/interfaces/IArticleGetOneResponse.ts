import { RichContentJson } from '@shared/services/RichContent';

export type IArticleGetOneResponse = {
  id: number;
  order: number;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: string;
  userId: string;
  articleId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};
