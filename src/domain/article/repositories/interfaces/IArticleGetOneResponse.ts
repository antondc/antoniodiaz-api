import { RichContentJson } from "@domain/richContent/entities/interfaces/RichContentJson";

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
