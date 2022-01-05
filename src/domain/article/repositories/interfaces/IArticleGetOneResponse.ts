export type IArticleGetOneResponse = {
  id: number;
  order: number;
  title: string;
  contentJson: string;
  contentHtml: string;
  published: string;
  userId: string;
  articleId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};
